import { CardActionAreaLink } from '#src/components/CardActionAreaLink';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Link,
  Typography,
} from '@mui/material';
import { useRecipe } from '@open-zero/features';
import { useState } from 'react';
import { RecipeMoreMenu } from './RecipeMoreMenu';

interface Props {
  recipeId: string;
}

export function RecipeCard({ recipeId }: Props) {
  const recipeQuery = useRecipe({ recipeId: recipeId });
  const recipe = recipeQuery.data?.recipe;
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const moreMenuOpen = Boolean(moreMenuAnchorEl);

  if (!recipe) {
    return <CircularProgress />;
  }

  return (
    <>
      <Card variant="outlined">
        <CardActionAreaLink
          to="/recipes/$recipeId"
          params={{
            recipeId: recipeId,
          }}
        >
          {recipe.images?.length ? (
            <img
              src={recipe.images.at(0)?.url}
              height={200}
              width={'100%'}
              style={{ objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <Box
              sx={{
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={'/assets/lil-guy.svg'}
                height={100}
                width={'100%'}
                style={{ objectFit: 'contain', display: 'block' }}
              />
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1,
            }}
          >
            <Box>
              <Typography variant="body1">{recipe.name}</Typography>
              {recipe.websiteSource && (
                <Typography variant="caption">
                  <Link
                    href={recipe.websiteSource.url}
                    rel="nofollow noopener"
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {recipe.websiteSource.title ?? 'Source'}
                  </Link>
                </Typography>
              )}
            </Box>
            <IconButton
              id="more-button"
              aria-controls={moreMenuOpen ? 'more-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={moreMenuOpen ? 'true' : undefined}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                setMoreMenuAnchorEl(event.currentTarget);
              }}
              onMouseDown={(event) => {
                event.stopPropagation();
                event.preventDefault();
              }}
            >
              <MoreVertRoundedIcon />
            </IconButton>
          </Box>
        </CardActionAreaLink>
      </Card>
      <RecipeMoreMenu
        recipeId={recipeId}
        anchorEl={moreMenuAnchorEl}
        onClose={() => {
          setMoreMenuAnchorEl(null);
        }}
      />
    </>
  );
}
