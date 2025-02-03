import multipart from '@fastify/multipart';
import { canonicalIngredientSchema } from '@open-zero/features/canonical-ingredients';
import { recipeBookRequestSchema } from '@open-zero/features/recipe-book-requests';
import { recipeBookSchema } from '@open-zero/features/recipe-books';
import { nutritionSchema, recipeSchema } from '@open-zero/features/recipes';
import { userSchema } from '@open-zero/features/users';
import ajvModule from 'ajv';
import ajvFormatsModule from 'ajv-formats';
import { fastUri } from 'fast-uri';
import fastifyPlugin from 'fastify-plugin';
import type { FastifyTypebox } from './fastifyTypebox.ts';

const addAjvFormats = ajvFormatsModule.default;
const Ajv = ajvModule.default;

function schemaPlugin(fastify: FastifyTypebox) {
  const defaultAjvOption: ajvModule.Options = {
    coerceTypes: 'array',
    useDefaults: true,
    removeAdditional: true,
    uriResolver: fastUri,
    addUsedSchema: false,
    allErrors: false,
  };

  const schemaCompilers = {
    body: addAjvFormats(
      new Ajv({
        ...defaultAjvOption,
        coerceTypes: false,
      }),
      {
        mode: 'fast',
      },
    ),
    params: addAjvFormats(new Ajv(defaultAjvOption), {
      mode: 'fast',
    }),
    querystring: addAjvFormats(new Ajv(defaultAjvOption), {
      mode: 'fast',
    }),
    headers: addAjvFormats(new Ajv(defaultAjvOption), {
      mode: 'fast',
    }),
  };

  // Adds the file plugin to help @fastify/swagger schema generation
  multipart.ajvFilePlugin(schemaCompilers.body);

  fastify.setValidatorCompiler((req) => {
    if (!req.httpPart) {
      throw new Error('Missing httpPart');
    }

    const compiler = schemaCompilers[
      req.httpPart as keyof typeof schemaCompilers
    ] as ajvModule.Ajv | undefined;

    if (!compiler) {
      throw new Error(`Missing compiler for ${req.httpPart}`);
    }

    return compiler.compile(req.schema);
  });

  function addSchema(schema: ajvModule.AnySchema) {
    fastify.addSchema(schema);
    schemaCompilers.body.addSchema(schema);
  }

  addSchema(canonicalIngredientSchema);
  addSchema(recipeSchema);
  addSchema(recipeBookSchema);
  addSchema(userSchema);
  addSchema(recipeBookRequestSchema);
  addSchema(nutritionSchema);
}

export default fastifyPlugin(schemaPlugin);
