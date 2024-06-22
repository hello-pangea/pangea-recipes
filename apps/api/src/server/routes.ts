import { foodRoutes } from '../features/foods/foodRoutes.js';
import { imageRoutes } from '../features/images/imageRoutes.js';
import { importedRecipeRoutes } from '../features/imported-recipes/importedRecipeRoutes.js';
import { recipeRoutes } from '../features/recipes/recipeRoutes.js';
import { userRoutes } from '../features/users/userRoutes.js';
import type { FastifyTypebox } from './fastifyTypebox.js';

export async function routes(fastify: FastifyTypebox) {
  void fastify.register(foodRoutes, { prefix: '/foods' });
  void fastify.register(importedRecipeRoutes, { prefix: '/imported-recipes' });
  void fastify.register(recipeRoutes, { prefix: '/recipes' });
  void fastify.register(imageRoutes, { prefix: '/images' });
  void fastify.register(userRoutes, { prefix: '/users' });
}
