import { canonicalIngredientRoutes } from '#src/features/canonical-ingredients/canonicalIngredientRoutes.ts';
import { recipeBookRequestRoutes } from '#src/features/recipe-book-requests/recipeBookRequestRoutes.ts';
import { imageRoutes } from '../features/images/imageRoutes.ts';
import { importedRecipeRoutes } from '../features/imported-recipes/importedRecipeRoutes.ts';
import { recipeBookRoutes } from '../features/recipe-books/recipeBookRoutes.ts';
import { recipeRoutes } from '../features/recipes/recipeRoutes.ts';
import { userRoutes } from '../features/users/userRoutes.ts';
import type { FastifyTypebox } from './fastifyTypebox.ts';

export async function routes(fastify: FastifyTypebox) {
  await fastify.register(canonicalIngredientRoutes, {
    prefix: '/canonical-ingredients',
  });
  await fastify.register(importedRecipeRoutes, { prefix: '/imported-recipes' });
  await fastify.register(recipeRoutes, { prefix: '/recipes' });
  await fastify.register(recipeBookRoutes, { prefix: '/recipe-books' });
  await fastify.register(recipeBookRequestRoutes, {
    prefix: '/recipe-book-requests',
  });
  await fastify.register(imageRoutes, { prefix: '/images' });
  await fastify.register(userRoutes, { prefix: '/users' });
}
