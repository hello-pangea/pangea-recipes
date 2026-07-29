import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { config } from './config/config.ts';

Sentry.init({
  dsn: config.SENTRY_DSN,
  integrations: [nodeProfilingIntegration(), Sentry.prismaIntegration()],
  tracesSampleRate: 1.0,
});
