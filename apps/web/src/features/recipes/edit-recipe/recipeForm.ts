import { minutesToSecondsSchema } from '#src/utils/zod/minutesToSecondsSchema';
import { positiveNumberOrNullSchema } from '#src/utils/zod/positiveNumberOrNullSchema';
import { formOptions } from '@tanstack/react-form';
import { z } from 'zod/v4';

export const recipeFormSchema = z.object({
  recipeName: z.string().min(1, { message: 'Recipe name is required' }),
  description: z.string().nullable(),
  prepTime: minutesToSecondsSchema,
  cookTime: minutesToSecondsSchema,
  servings: z.string().optional(),
  tryLater: z.boolean().default(false),
  image: z
    .object({
      id: z.string(),
      url: z.string(),
    })
    .nullable()
    .optional(),
  ingredientGroups: z.array(
    z.object({
      id: z
        .string()
        .optional()
        .nullable()
        .transform((val) => val ?? undefined),
      name: z.string().nullable(),
      ingredients: z.array(
        z.object({
          name: z.string().min(1, { message: 'Ingredient name is required' }),
          unit: z.string().nullable(),
          quantity: positiveNumberOrNullSchema,
          notes: z.string().nullable(),
        }),
      ),
    }),
  ),
  usesRecipes: z.array(z.object({ recipeId: z.string() })),
  instructionGroups: z.array(
    z.object({
      id: z.string().optional().nullable(),
      name: z.string().nullable(),
      instructions: z.array(z.object({ text: z.string() })),
    }),
  ),
  websitePageId: z.string().optional(),
  nutrition: z
    .object({
      calories: positiveNumberOrNullSchema,
      totalFatG: positiveNumberOrNullSchema,
      unsaturatedFatG: positiveNumberOrNullSchema,
      saturatedFatG: positiveNumberOrNullSchema,
      transFatG: positiveNumberOrNullSchema,

      carbsG: positiveNumberOrNullSchema,
      proteinG: positiveNumberOrNullSchema,
      fiberG: positiveNumberOrNullSchema,
      sugarG: positiveNumberOrNullSchema,

      sodiumMg: positiveNumberOrNullSchema,
      ironMg: positiveNumberOrNullSchema,
      calciumMg: positiveNumberOrNullSchema,
      potassiumMg: positiveNumberOrNullSchema,
      cholesterolMg: positiveNumberOrNullSchema,
    })
    .optional(),
});
export type RecipeFormInputs = z.input<typeof recipeFormSchema>;

export const recipeFormOptions = formOptions({
  defaultValues: {} as RecipeFormInputs,
  validators: {
    onSubmit: recipeFormSchema,
  },
});
