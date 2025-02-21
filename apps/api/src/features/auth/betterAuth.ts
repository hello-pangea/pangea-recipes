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
  baseURL: 'http://localhost:3001',
  trustedOrigins: ['http://localhost:3000'],
  logger: {
    disabled: false,
    level: 'debug',
  },
  advanced: {
    generateId: false,
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
