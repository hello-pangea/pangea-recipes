import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import { fastifyPlugin } from 'fastify-plugin';

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

    const allowedHosts = [hostHeader, 'hellorecipes.com'];

    if (!originHeader || !hostHeader || !allowedHosts.includes(originHeader)) {
      console.error('Invalid origin', { originHeader, hostHeader });

      return res.status(403).send({
        message:
          "Invalid origin. Please make sure you're using the correct URL.",
      });
    }

    return;
  });
}

export const csrfPlugin = fastifyPlugin(plugin, {
  name: 'csrfPlugin',
  fastify: '5.x',
});
