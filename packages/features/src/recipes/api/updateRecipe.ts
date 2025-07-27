import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import { nutritionSchema } from '../types/nutrition.js';
import { recipeSchema, type Recipe } from '../types/recipe.js';
import { createRecipeDtoScema } from './createRecipe.js';
import { getRecipeQueryOptions } from './getRecipe.js';

export const updateRecipeDtoScema = z
  .object({
    ...recipeSchema.pick({
      name: true,
      description: true,
      prepTime: true,
      cookTime: true,
      servings: true,
      tryLater: true,
      favorite: true,
    }).shape,
    ...createRecipeDtoScema.pick({
      usesRecipes: true,
      tags: true,
    }).shape,
    imageIds: z.array(z.uuidv4()).nullable().optional(),
    ingredientGroups: z.array(
      z.object({
        id: z.uuidv4().optional(),
        name: z.string().min(1).nullable().optional(),
        ingredients: z.array(
          z.object({
            id: z.uuidv4().optional(),
            name: z.string().min(1),
            unit: z.string().min(1).nullable().optional(),
            quantity: z.number().nullable().optional(),
            notes: z.string().min(1).nullable().optional(),
          }),
        ),
      }),
    ),
    instructionGroups: z.array(
      z.object({
        id: z.uuidv4().optional(),
        name: z.string().min(1).nullable().optional(),
        instructions: z.array(
          z.object({
            id: z.uuidv4().optional(),
            text: z.string().min(1),
          }),
        ),
      }),
    ),
    nutrition: nutritionSchema.partial().optional(),
  })
  .partial();

export type UpdateRecipeDto = z.infer<typeof updateRecipeDtoScema>;

function updateRecipe(data: UpdateRecipeDto & { id: string }) {
  return api
    .patch(`recipes/${data.id}`, { json: data })
    .then((res) => res.json<{ recipe: Recipe }>());
}

interface Options {
  mutationConfig?: MutationConfig<typeof updateRecipe>;
}

export function useUpdateRecipe({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      const [data] = args;

      void queryClient.invalidateQueries({
        queryKey: ['recipeBooks'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['recipes'],
      });
      queryClient.setQueryData(
        getRecipeQueryOptions(data.recipe.id).queryKey,
        data.recipe,
      );

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateRecipe,
  });
}
