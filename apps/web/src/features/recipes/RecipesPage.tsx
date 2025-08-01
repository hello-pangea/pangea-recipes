import { Page } from '#src/components/Page';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import ViewModuleRoundedIcon from '@mui/icons-material/ViewModuleRounded';
import {
  Box,
  InputBase,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { getListRecipesQueryOptions } from '@open-zero/features/recipes';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useSignedInUserId } from '../auth/useSignedInUserId';
import { EmptyRecipes } from './EmptyRecipes';
import { RecipeGrid } from './RecipeGrid';
import { RecipeList } from './RecipeList';

export function RecipesPage() {
  const userId = useSignedInUserId();
  const { data: recipes, isError } = useSuspenseQuery(
    getListRecipesQueryOptions({ userId: userId }),
  );
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [layout, setLayout] = useState<'list' | 'grid'>('grid');

  const filteredRecipes = useMemo(() => {
    const triedRecipes = recipes.filter((recipe) => !recipe.tryLater);

    if (search) {
      return triedRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return triedRecipes;
  }, [recipes, search]);

  return (
    <Page>
      <Typography
        variant="h1"
        sx={{
          mb: {
            xs: 2,
            sm: 4,
          },
          textAlign: 'center',
          mt: { xs: 0, sm: 4 },
        }}
      >
        My Recipes
      </Typography>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          // justifyContent: 'center',
          alignItems: 'center',
          mb: 2,
          gap: 2,
        }}
      >
        <Box
          sx={{
            marginRight: 'auto',
            flex: 1,
            display: 'flex',
          }}
        />
        <Box
          sx={[
            {
              maxWidth: 800,
              borderRadius: 99,
              backgroundColor: (theme) =>
                searchFocused
                  ? theme.vars.palette.background.paper
                  : theme.vars.palette.grey[200],
              display: 'flex',
              alignItems: 'center',
              // width: '100%',
              px: 2,
              py: 1,
              gap: 2,
              flex: 5,
              boxShadow: searchFocused
                ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                : undefined,
            },
            (theme) =>
              theme.applyStyles('dark', {
                backgroundColor: searchFocused
                  ? theme.vars.palette.background.paper
                  : theme.vars.palette.grey[900],
              }),
          ]}
        >
          <SearchRoundedIcon />
          <InputBase
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            placeholder="Search for a recipe..."
            sx={{ flex: 1 }}
            onFocus={() => {
              setSearchFocused(true);
            }}
            onBlur={() => {
              setSearchFocused(false);
            }}
          />
        </Box>
        <Box
          sx={{
            marginLeft: 'auto',
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <ToggleButtonGroup
            value={layout}
            exclusive
            onChange={(_event, newLayout: typeof layout | null) => {
              if (newLayout) {
                setLayout(newLayout);
              }
            }}
            aria-label="layout"
          >
            <Tooltip title="List layout" placement="bottom">
              <ToggleButton
                value="list"
                aria-label="left aligned"
                sx={{
                  borderRadius: 99,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              >
                <TableRowsRoundedIcon fontSize="small" />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Grid layout" placement="bottom">
              <ToggleButton
                value="grid"
                aria-label="centered"
                sx={{
                  borderRadius: 99,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
              >
                <ViewModuleRoundedIcon fontSize="small" />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </Box>
      </Box>
      {layout === 'grid' ? (
        <RecipeGrid recipes={filteredRecipes} />
      ) : (
        <RecipeList recipes={filteredRecipes} />
      )}
      {!isError && !recipes.length && <EmptyRecipes sx={{ mt: 8 }} />}
    </Page>
  );
}
