import { prisma } from '#src/lib/prisma.js';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { type User } from '@open-zero/features';
import { Lucia } from 'lucia';

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // we don't need to expose the hashed password!
      email: attributes.email,
      accessRole: attributes.accessRole,
    };
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      accessRole: User['accessRole'];
    };
  }
}
