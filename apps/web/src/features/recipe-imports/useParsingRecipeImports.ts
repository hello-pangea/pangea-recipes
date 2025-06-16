import { useRecipeImports } from '@open-zero/features/recipe-imports';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSignedInUserId } from '../auth/useSignedInUserId';

interface Options {
  enableRecipeRefreshing?: boolean;
}

export function useParsingRecipeImports({
  enableRecipeRefreshing = false,
}: Options) {
  const queryClient = useQueryClient();
  const userId = useSignedInUserId();
  const { data: recipeImports } = useRecipeImports({
    options: {
      userId: userId,
    },
    queryConfig: {
      refetchInterval: (data) => {
        return (data.state.data?.length ?? 0) > 0 ? 1000 : false;
      },
    },
  });

  // Refresh the main recipes list when a quick import finishes
  const importingRecipesLength = recipeImports?.length ?? 0;
  useEffect(() => {
    if (!enableRecipeRefreshing) {
      return;
    }

    void queryClient.invalidateQueries({
      queryKey: ['recipes'],
    });
  }, [importingRecipesLength, queryClient, enableRecipeRefreshing]);

  return recipeImports;
}
