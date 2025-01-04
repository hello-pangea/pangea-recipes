import { canonicalIngredientRoutes } from '#src/features/canonical-ingredients/canonicalIngredientRoutes.js';
import { imageRoutes } from '../features/images/imageRoutes.js';
import { importedRecipeRoutes } from '../features/imported-recipes/importedRecipeRoutes.js';
import { recipeBookRoutes } from '../features/recipe-books/recipeBookRoutes.js';
import { recipeRoutes } from '../features/recipes/recipeRoutes.js';
import { userRoutes } from '../features/users/userRoutes.js';
import type { FastifyTypebox } from './fastifyTypebox.js';

export async function routes(fastify: FastifyTypebox) {
  await fastify.register(canonicalIngredientRoutes, {
    prefix: '/canonical-ingredients',
  });
  await fastify.register(importedRecipeRoutes, { prefix: '/imported-recipes' });
  await fastify.register(recipeRoutes, { prefix: '/recipes' });
  await fastify.register(recipeBookRoutes, { prefix: '/recipe-books' });
  await fastify.register(imageRoutes, { prefix: '/images' });
  await fastify.register(userRoutes, { prefix: '/users' });
}
