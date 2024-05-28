import { prisma } from './index.js';
import { foods } from './seed-data/foods.js';
import { units } from './seed-data/units.js';

async function seedDatabase() {
  await prisma.unit.createMany({
    data: units,
  });

  await prisma.food.createMany({
    data: foods,
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
