import { config } from '#src/config/config.ts';
import { prisma } from '@open-zero/database';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { openAPI } from 'better-auth/plugins';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [openAPI()],
  basePath: '/auth',
  baseURL:
    config.NODE_ENV === 'production'
      ? 'https://hello-recipes-staging.up.railway.app'
      : 'http://localhost:3001',
  trustedOrigins: [
    'http://localhost:3000',
    'https://hellorecipes.com',
    'https://api.hellorecipes.com',
  ],
  logger: {
    disabled: false,
    level: 'debug',
  },
  advanced: {
    generateId: false,
    crossSubDomainCookies: {
      enabled: true,
      domain: '.hellorecipes.com',
    },
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  socialProviders: {
    google: {
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      clientId: config.FACEBOOK_APP_ID,
      clientSecret: config.FACEBOOK_APP_SECRET,
    },
  },
  // user: {
  //   modelName: 'users',
  //   fields: {
  //     emailVerified: 'email_verified',
  //     updatedAt: 'updated_at',
  //     createdAt: 'created_at',
  //   },
  // },
  // account: {
  //   modelName: 'accounts',
  // },
  // session: {
  //   modelName: 'sessions',
  // },
  // databaseHooks: {
  //   user: {
  //     create: {
  //       after: (user) => {

  //       },
  //     }
  //   }
  // }
});
