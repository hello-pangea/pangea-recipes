import { createServer } from '#src/server/server.js';
import closeWithGrace from 'close-with-grace';
import { config } from './config/config.js';

const server = await createServer();

const port = Number(config.PORT);

closeWithGrace({ delay: 500 }, async function ({ err }) {
  if (err) {
    server.log.error(err);
  }
  await server.close();
});

server.listen({ port: port, host: '::' }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }

  console.log(`👂 Api server listening to: '${address}'`);
});

await server.ready();
