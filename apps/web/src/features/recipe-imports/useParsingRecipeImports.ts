import { listRecipeImportsQueryOptions } from '@repo/features/recipe-imports';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useSignedInUserId } from '../auth/useSignedInUserId';

interface Options {
  enableRecipeRefreshing?: boolean;
}

export function useParsingRecipeImports({
  enableRecipeRefreshing = false,
}: Options) {
  const queryClient = useQueryClient();
  const userId = useSignedInUserId();
  const { data: recipeImports } = useQuery({
    ...listRecipeImportsQueryOptions({
      userId,
    }),
    refetchInterval: (data) => {
      return (data.state.data?.length ?? 0) > 0 ? 1000 : false;
    },
  });

  // Refresh the main recipes list when a quick import finishes
  const importingRecipesLength = recipeImports?.length ?? 0;
  const prevLengthRef = useRef(importingRecipesLength);

  useEffect(() => {
    if (!enableRecipeRefreshing) {
      prevLengthRef.current = importingRecipesLength;
      return;
    }

    if (importingRecipesLength < prevLengthRef.current) {
      void queryClient.invalidateQueries({
        queryKey: ['recipes'],
      });
    }

    prevLengthRef.current = importingRecipesLength;
  }, [importingRecipesLength, queryClient, enableRecipeRefreshing]);

  return recipeImports;
}
