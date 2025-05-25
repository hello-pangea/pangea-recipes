import { defineConfig } from 'prisma/config';
import path from 'node:path';
import 'dotenv/config';

export default defineConfig({
  earlyAccess: true,
  schema: path.join('prisma'),
});
