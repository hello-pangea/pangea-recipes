import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import { fastifyPlugin } from 'fastify-plugin';
import { verifyRequestOrigin } from 'lucia';

interface Options {
  enabled: boolean;
}

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

    console.log('Auth: originHeader', originHeader);
    console.log('Auth: hostHeader', hostHeader);

    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      console.error('Invalid origin', { originHeader, hostHeader });
      return res.status(403);
    }

    return;
  });
}

export const csrfPlugin = fastifyPlugin(plugin, {
  name: 'csrfPlugin',
  fastify: '4.x',
});
