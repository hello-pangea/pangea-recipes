import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import { fastifyPlugin } from 'fastify-plugin';
import { verifyRequestOrigin } from 'lucia';

interface Options {
  enabled: boolean;
}

// eslint-disable-next-line @typescript-eslint/require-await
async function plugin(fastify: FastifyTypebox, opts: Options) {
  if (!opts.enabled) {
    return;
  }

  fastify.addHook('preHandler', async (req, res) => {
    if (req.method === 'GET') {
      return;
    }

    const originHeader = req.headers.origin ?? null;
    const hostHeader = req.headers.host ?? null;

    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader, 'hellorecipes.com'])
    ) {
      console.error('Invalid origin', { originHeader, hostHeader });
      return res.status(403);
    }

    return;
  });
}

export const csrfPlugin = fastifyPlugin(plugin, {
  name: 'csrfPlugin',
  fastify: '5.x',
});
