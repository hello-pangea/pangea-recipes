import { importedRecipeRoutes } from '../features/imported-recipes/importedRecipeRoutes.js';
import { ingredientRoutes } from '../features/ingredients/ingredientRoutes.js';
import { recipeRoutes } from '../features/recipes/recipeRoutes.js';
import { unitRoutes } from '../features/units/unitRoutes.js';
import { userRoutes } from '../features/users/userRoutes.js';
import type { FastifyTypebox } from './fastifyTypebox.js';

export async function routes(fastify: FastifyTypebox) {
  void fastify.register(ingredientRoutes, { prefix: '/ingredients' });
  void fastify.register(recipeRoutes, { prefix: '/recipes' });
  void fastify.register(unitRoutes, { prefix: '/units' });
  void fastify.register(userRoutes, { prefix: '/users' });
  void fastify.register(importedRecipeRoutes, { prefix: '/imported-recipes' });
}
