import 'dotenv/config';
import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: path.join('prisma'),
  datasource: {
    url: process.env['PG_DATABASE_URL'] ?? '',
  },
});
