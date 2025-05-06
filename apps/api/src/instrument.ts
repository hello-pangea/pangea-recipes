import { PrismaInstrumentation } from '@prisma/instrumentation';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { config } from './config/config.ts';

Sentry.init({
  dsn: config.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
    Sentry.prismaIntegration({
      // Override the default instrumentation that Sentry uses
      prismaInstrumentation: new PrismaInstrumentation(),
    }),
  ],
  tracesSampleRate: 1.0,
});
