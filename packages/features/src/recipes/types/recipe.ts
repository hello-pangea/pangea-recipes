import type { Decimal } from 'decimal.js';
import { z } from 'zod/v4';
import { tagSchema } from '../../common/tag.js';
import { nutritionSchema } from './nutrition.js';

export const recipeSchema = z
  .object({
    id: z.uuidv4().describe('unique id'),
    userId: z.uuidv4().describe('id of the user who created the recipe'),
    createdAt: z.coerce.date(), // Accepts string, coerces to Date
    name: z.string(),
    description: z.string().nullable(),
    prepTime: z.number().nullable(),
    cookTime: z.number().nullable(),
    servings: z.number().nullable(),
    tryLater: z.boolean(),
    favorite: z.boolean(),
    websiteSource: z
      .object({
        title: z.string().nullable(),
        url: z.string(),
      })
      .nullable(),
    images: z
      .array(
        z.object({
          id: z.string(),
          url: z.string(),
          favorite: z.boolean(),
        }),
      )
      .nullable(),
    ingredientGroups: z.array(
      z.object({
        id: z.string(),
        name: z.string().nullable(),
        ingredients: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            quantity: z.custom<Decimal>().nullable(), // z.custom for Decimal
            unit: z.string().nullable(),
            notes: z.string().nullable(),
            icon_url: z.string().nullable(),
          }),
        ),
      }),
    ),
    instructionGroups: z.array(
      z.object({
        id: z.string(),
        name: z.string().nullable(),
        instructions: z.array(
          z.object({
            id: z.string(),
            text: z.string(),
          }),
        ),
      }),
    ),
    tags: z.array(tagSchema),
    nutrition: nutritionSchema.optional(),
    usesRecipes: z.array(z.string()).optional(),
  })
  .meta({
    id: 'Recipe',
  });

export type Recipe = z.infer<typeof recipeSchema>;
