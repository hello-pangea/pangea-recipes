import { createServer } from '#src/server/server.js';
import { env } from './config/config.js';

const server = await createServer();

const port = Number(env.PORT);

server.listen({ port: port, host: '::' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`👂 Api server listening to: '${address}'`);
});

function closeGracefully(signal: string) {
  console.log(`Received signal to terminate: ${signal}`);

  void server.close();

  process.kill(process.pid, signal);
}

process.once('SIGINT', closeGracefully);
process.once('SIGTERM', closeGracefully);

await server.ready();
