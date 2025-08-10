import { z } from 'zod';

export const nutritionSchema = z.object({
  calories: z.number().nullable(),

  totalFatG: z.number().nullable(),
  unsaturatedFatG: z.number().nullable(),
  saturatedFatG: z.number().nullable(),
  transFatG: z.number().nullable(),

  carbsG: z.number().nullable(),
  proteinG: z.number().nullable(),
  fiberG: z.number().nullable(),
  sugarG: z.number().nullable(),

  sodiumMg: z.number().nullable(),
  ironMg: z.number().nullable(),
  calciumMg: z.number().nullable(),
  potassiumMg: z.number().nullable(),
  cholesterolMg: z.number().nullable(),
});

export type Nutrition = z.infer<typeof nutritionSchema>;
