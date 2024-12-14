import { prisma } from './index.js';
import { canonicalIngredients } from './seed-data/canonicalIngredients.js';

async function seedDatabase() {
  await prisma.canonicalIngredient.createMany({
    data: canonicalIngredients,
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
