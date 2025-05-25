import { config } from '#src/config/config.ts';
import { resend } from '#src/lib/resend.ts';
import { prisma } from '@open-zero/database';
import { ResetPassword, VerifyEmail } from '@open-zero/email';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { openAPI } from 'better-auth/plugins';
import { claimRecipeBookInvites } from '../users/userUtils.ts';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: 'Hello Recipes <auth@notify.hellorecipes.com>',
        to: user.email,
        subject: `Reset your password`,
        replyTo: 'hello@hellorecipes.com',
        react: ResetPassword({
          url: url,
        }),
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ url, user }) => {
      await resend.emails.send({
        from: 'Hello Recipes <auth@notify.hellorecipes.com>',
        to: user.email,
        subject: `Verify your email address`,
        replyTo: 'hello@hellorecipes.com',
        react: VerifyEmail({
          url: url,
        }),
      });
    },
  },
  plugins: [openAPI()],
  basePath: '/auth',
  baseURL:
    config.NODE_ENV === 'production'
      ? 'https://api.hellorecipes.com'
      : 'http://localhost:3001',
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://hellorecipes.com',
    'https://api.hellorecipes.com',
  ],
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain:
        config.NODE_ENV === 'production' ? '.hellorecipes.com' : 'localhost',
    },
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    },
    database: {
      generateId: false,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  user: {
    additionalFields: {
      accessRole: {
        type: 'string',
        required: true,
        defaultValue: 'user',
        input: false,
      },
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
  secret: config.BETTER_AUTH_SECRET,
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await claimRecipeBookInvites(user);
        },
      },
    },
  },
});
