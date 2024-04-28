import { ingredientRoutes } from '../features/ingredients/ingredientRoutes.js';
import { recipeRoutes } from '../features/recipes/recipeRoutes.js';
import { unitRoutes } from '../features/units/unitRoutes.js';
import { userRoutes } from '../features/users/userRoutes.js';
import { lucia } from '../lib/lucia.js';
import type { FastifyTypebox } from './fastifyTypebox.js';

export async function routes(fastify: FastifyTypebox) {
  fastify.decorateRequest('user', null);

  fastify.addHook('onRequest', async (request, reply) => {
    const originHeader = request.headers.origin;
    const hostHeader = request.headers.host;

    console.log('Auth: originHeader', originHeader);
    console.log('Auth: hostHeader', hostHeader);

    // if (
    //   !originHeader ||
    //   !hostHeader ||
    //   !verifyRequestOrigin(originHeader, [hostHeader])
    // ) {
    //   return new Response(null, {
    //     status: 403,
    //   });
    // }

    const sessionId = request.cookies[lucia.sessionCookieName];

    console.log('Auth: sessionId', sessionId);

    if (sessionId) {
      const { session, user } = await lucia.validateSession(sessionId);

      console.log('Auth: session', session);
      console.log('Auth: user', user);

      request.user = user;

      if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();

        void reply.header('set-cookie', sessionCookie.serialize());
      }

      if (session?.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);

        void reply.header('set-cookie', sessionCookie.serialize());
      }
    }
  });

  void fastify.register(ingredientRoutes, { prefix: '/ingredients' });
  void fastify.register(recipeRoutes, { prefix: '/recipes' });
  void fastify.register(unitRoutes, { prefix: '/units' });
  void fastify.register(userRoutes, { prefix: '/users' });
}
