import { useLocalStorage } from '@mantine/hooks';
import { useMediaQuery } from '@mui/material';
import { z } from 'zod';

const defaultView = 'grid' as const;

const viewSchema = z.enum(['grid', 'list', 'compact']).catch(defaultView);

type View = z.infer<typeof viewSchema>;

export function useViewPreference() {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return useLocalStorage<View>({
    key: 'viewPreference',
    defaultValue: isSmall ? 'list' : defaultView,
    deserialize: (value) => {
      return viewSchema.parse(JSON.parse(value || ''));
    },
  });
}
