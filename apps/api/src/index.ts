import { createServer } from '#src/server/server.ts';
import closeWithGrace from 'close-with-grace';
import { config } from './config/config.ts';
import { shutdownBrowser } from './lib/browser.ts';

const server = await createServer();

closeWithGrace({ delay: 500 }, async function ({ err }) {
  if (err) {
    server.log.error(err);
  }

  await server.close();
  await shutdownBrowser();
});

server.listen({ port: config.PORT, host: '::' }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }

  console.log(`👂 Api server listening to: '${address}'`);
});

await server.ready();
