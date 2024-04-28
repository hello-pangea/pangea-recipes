import { prisma } from './index.js';
import { units } from './seed-data/units.js';

async function seedDatabase() {
  await prisma.unit.createMany({
    data: units,
  });
}

seedDatabase()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: unknown) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
