import { auth } from '#src/features/auth/betterAuth.ts';
import openApi from '@fastify/swagger';
import fastifyPlugin from 'fastify-plugin';
import {
  jsonSchemaTransform,
  jsonSchemaTransformObject,
} from 'fastify-type-provider-zod';
import { config } from '../config/config.ts';

export const customOpenApi = fastifyPlugin(async (fastify) => {
  // -
  // BetterAuth exports their own openapi schema
  // Change their tag to 'Auth' instead of the their default 'Default'
  // -

  const authOpenAPISchema = await auth.api.generateOpenAPISchema();
  Object.keys(authOpenAPISchema.paths).forEach((path) => {
    if (authOpenAPISchema.paths[path]?.post) {
      authOpenAPISchema.paths[path].post.tags = ['Auth'];
    } else if (authOpenAPISchema.paths[path]?.get) {
      authOpenAPISchema.paths[path].get.tags = ['Auth'];
    }
  });

  authOpenAPISchema.tags = [];

  //

  const openApiServers = [
    {
      url: 'https://api.pangearecipes.com',
      description: 'Production',
    },
    {
      url: 'http://localhost:3001',
      description: 'Local',
    },
  ];

  if (config.NODE_ENV === 'development') {
    openApiServers.reverse();
  }

  void fastify.register(openApi, {
    openapi: {
      openapi: '3.1.1',
      info: {
        title: 'Pangea Recipes',
        description: 'A recipe management app by Open Zero',
        version: '1.0.0',
      },
      tags: [
        {
          name: 'Foods',
          description: 'Food related endpoints',
        },
        {
          name: 'Recipes',
          description: 'Recipe related endpoints',
        },
        {
          name: 'Recipe books',
          description: 'Collections of recipes that you can share with others',
        },
        {
          name: 'Users',
          description: 'User related endpoints',
        },
        {
          name: 'Imported recipes',
          description: 'Import recipes from other websites',
        },
        {
          name: 'Auth',
          description: 'Authentication endpoints',
        },
      ],
      servers: openApiServers,
    },
    // https://stackoverflow.com/a/77501891
    // refResolver: {
    //   buildLocalReference(json, _baseUri, _fragment, i) {
    //     // This mirrors the default behaviour
    //     // see: https://github.com/fastify/fastify-swagger/blob/1b53e376b4b752481643cf5a5655c284684383c3/lib/mode/dynamic.js#L17
    //     if (!json['title'] && json['$id']) {
    //       json['title'] = json['$id'];
    //     }
    //     // Fallback if no $id is present
    //     if (!json['$id']) {
    //       return `def-${String(i)}`;
    //     }

    //     // eslint-disable-next-line @typescript-eslint/no-base-to-string
    //     return String(json['$id']);
    //   },
    // },
    // transformObject: (swaggerDocumentObject) => {
    //   if ('openapiObject' in swaggerDocumentObject) {
    //     const openapiObject = swaggerDocumentObject.openapiObject;

    //     const mergeResult = merge([
    //       {
    //         // @ts-expect-error - This is a valid input
    //         oas: openapiObject,
    //       },
    //       {
    //         // @ts-expect-error - This is a valid input
    //         oas: authOpenAPISchema,
    //         pathModification: {
    //           prepend: '/auth',
    //         },
    //       },
    //     ]);

    //     if (isErrorResult(mergeResult)) {
    //       console.error(`${mergeResult.message} (${mergeResult.type})`);

    //       return openapiObject;
    //     } else {
    //       return mergeResult.output;
    //     }
    //   } else {
    //     return swaggerDocumentObject.swaggerObject as object;
    //   }
    // },
    // transform: createJsonSchemaTransform,
    transformObject: jsonSchemaTransformObject,
    transform: jsonSchemaTransform,
  });
});
