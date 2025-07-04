import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated-prisma-client/client.js';

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: process.env['PG_DATABASE_URL'],
});
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = prisma;
}
