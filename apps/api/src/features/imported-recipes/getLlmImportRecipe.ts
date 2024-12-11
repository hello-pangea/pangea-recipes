import { openAi } from '#src/lib/openAi.js';
import { prisma } from '@open-zero/database';
import { unitSchema } from '@open-zero/features';
import { Type, type Static, type TSchema } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import playwright from 'playwright-chromium';

async function processWebsite(data: {
  urlString: string;
  page: playwright.Page;
}) {
  const { urlString, page } = data;

  const url = new URL(urlString);

  const urlHost = url.host;

  const existingWebsite = await prisma.website.findUnique({
    where: {
      host: urlHost,
    },
  });

  if (existingWebsite) {
    return existingWebsite;
  }

  const urlOrigin = url.origin;

  await page.goto(urlOrigin);

  const title = await page.title().catch(() => null);
  const openGraphSiteName = await page
    .locator('meta[property="og:site_name"]')
    .getAttribute('content')
    .catch(() => null);
  const openGraphTitle = await page
    .locator('meta[property="og:title"]')
    .getAttribute('content')
    .catch(() => null);
  const description = await page
    .locator('meta[name="description"]')
    .getAttribute('content')
    .catch(() => null);

  return prisma.website.create({
    data: {
      host: urlHost,
      title: openGraphSiteName ?? openGraphTitle ?? title,
      description: description,
    },
  });
}

export async function getLlmImportRecipe(urlString: string) {
  const browser = await playwright.chromium.launch({
    args: ['--disable-gl-drawing-for-tests'],
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  const website = await processWebsite({ urlString, page });

  const url = new URL(urlString);

  const websitePage = await prisma.websitePage.upsert({
    where: {
      path_websiteId: {
        path: url.pathname,
        websiteId: website.id,
      },
    },
    update: {},
    create: {
      path: url.pathname,
      website: {
        connect: {
          id: website.id,
        },
      },
    },
  });

  await page.goto(urlString);

  const pageText = await page.innerText('body');

  await browser.close();

  const openAiRes = await openAi.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistent specializing in reading recipes. You will be given unstructured recipe info from a website. Parse it into the given structured data format.',
      },
      {
        role: 'user',
        content: pageText,
      },
    ],
    model: 'gpt-4o-mini-2024-07-18',
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'recipe',
        strict: true,
        schema: llmRecipeSchema,
      },
    },
  });

  const llmContent = JSON.parse(
    openAiRes.choices.at(0)?.message.content ?? '',
  ) as object;

  (llmContent as Static<typeof llmRecipeSchema>).ingredientGroups?.map((ig) =>
    ig.ingredients.map((i) => {
      // @ts-expect-error The llm can mess up and return "null" as a string
      if (i.unit === 'null') {
        i.unit = null;
      }

      if (i.notes === '') {
        i.notes = null;
      }
    }),
  );

  const parsedRecipe = parse(llmRecipeSchema, llmContent);

  return { parsedRecipe, websitePage };
}

function parse<T extends TSchema>(schema: T, value: unknown): Static<T> {
  const c = Value.Convert(
    schema,
    Value.Cast(
      schema,
      Value.Default(schema, Value.Clean(schema, Value.Clone(value))),
    ),
  );
  Value.Assert(schema, c);
  return Value.Decode(schema, c);
}

const Nullable = <T extends TSchema>(schema: T) =>
  Type.Union([schema, Type.Null()]);

const llmRecipeSchema = Type.Object(
  {
    name: Nullable(Type.String()),

    description: Nullable(Type.String()),

    /** Minutes */
    prepTime: Nullable(Type.Number({ description: 'Prep time in minutes' })),
    /** Minutes */
    cookTime: Nullable(Type.Number({ description: 'Cook time in minutes' })),
    /** Minutes */
    totalTime: Nullable(Type.Number({ description: 'Total time in minutes' })),

    ingredientGroups: Nullable(
      Type.Array(
        Type.Object(
          {
            title: Nullable(Type.String()),
            ingredients: Type.Array(
              Type.Object(
                {
                  name: Type.String(),
                  unit: unitSchema,
                  amount: Nullable(Type.Number()),
                  notes: Nullable(Type.String()),
                },
                { additionalProperties: false },
              ),
            ),
          },
          { additionalProperties: false },
        ),
      ),
    ),

    instructionGroups: Nullable(
      Type.Array(
        Type.Object(
          {
            title: Nullable(Type.String()),
            instructions: Type.Array(Type.String()),
          },
          { additionalProperties: false },
        ),
      ),
    ),
  },
  { additionalProperties: false },
);
