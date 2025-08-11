import { useLocalStorage } from '@mantine/hooks';
import { z } from 'zod';

const defaultSort = {
  key: 'date',
  direction: 'desc',
} as const;

const sortSchema = z
  .object({
    key: z.enum(['date', 'name']),
    direction: z.enum(['asc', 'desc']),
  })
  .catch(defaultSort);

export type Sort = z.infer<typeof sortSchema>;

export function useSort(localStorageKey: string) {
  return useLocalStorage<Sort>({
    key: localStorageKey,
    defaultValue: defaultSort,
    deserialize: (value) => {
      return sortSchema.parse(JSON.parse(value || '{}'));
    },
  });
}
