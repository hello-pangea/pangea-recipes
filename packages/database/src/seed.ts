import { prisma } from './index.js';
import { foods } from './seed-data/foods.js';

async function seedDatabase() {
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
