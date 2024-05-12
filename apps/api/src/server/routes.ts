import { foodRoutes } from '../features/foods/foodRoutes.js';
import { importedRecipeRoutes } from '../features/imported-recipes/importedRecipeRoutes.js';
import { recipeRoutes } from '../features/recipes/recipeRoutes.js';
import { unitRoutes } from '../features/units/unitRoutes.js';
import { userRoutes } from '../features/users/userRoutes.js';
import type { FastifyTypebox } from './fastifyTypebox.js';

export async function routes(fastify: FastifyTypebox) {
  void fastify.register(foodRoutes, { prefix: '/foods' });
  void fastify.register(recipeRoutes, { prefix: '/recipes' });
  void fastify.register(unitRoutes, { prefix: '/units' });
  void fastify.register(userRoutes, { prefix: '/users' });
  void fastify.register(importedRecipeRoutes, { prefix: '/imported-recipes' });
}
