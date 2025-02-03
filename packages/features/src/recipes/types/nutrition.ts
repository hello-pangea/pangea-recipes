import { Type, type Static } from '@sinclair/typebox';
import { Nullable } from '../../lib/nullable.js';

const nutritionSchemaId = 'Nutrition';

export type Nutrition = Static<typeof nutritionSchema>;
export const nutritionSchema = Type.Object(
  {
    calories: Nullable(Type.Number()),

    totalFatG: Nullable(Type.Unsafe<number>(Type.Number())),
    unsaturatedFatG: Nullable(Type.Unsafe<number>(Type.Number())),
    saturatedFatG: Nullable(Type.Unsafe<number>(Type.Number())),
    transFatG: Nullable(Type.Unsafe<number>(Type.Number())),

    carbsG: Nullable(Type.Unsafe<number>(Type.Number())),
    proteinG: Nullable(Type.Unsafe<number>(Type.Number())),
    fiberG: Nullable(Type.Unsafe<number>(Type.Number())),
    sugarG: Nullable(Type.Unsafe<number>(Type.Number())),

    sodiumMg: Nullable(Type.Unsafe<number>(Type.Number())),
    ironMg: Nullable(Type.Unsafe<number>(Type.Number())),
    calciumMg: Nullable(Type.Unsafe<number>(Type.Number())),
    potassiumMg: Nullable(Type.Unsafe<number>(Type.Number())),
    cholesterolMg: Nullable(Type.Unsafe<number>(Type.Number())),
  },
  { $id: nutritionSchemaId },
);

export const nutritionSchemaRef = Type.Unsafe<Nutrition>(
  Type.Ref(nutritionSchemaId),
);
