import { openAi } from '#src/lib/openAi.js';
import { unitSchema } from '@open-zero/features';
import { Type, type TSchema } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import playwright from 'playwright-chromium';

export async function getLlmImportRecipe(url: string) {
  const browser = await playwright.chromium.launch({
    args: ['--disable-gl-drawing-for-tests'],
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(url);

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

  const parsedRecipe = Value.Parse(llmRecipeSchema, llmContent);

  return parsedRecipe;
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

    ingredients: Nullable(
      Type.Array(
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
