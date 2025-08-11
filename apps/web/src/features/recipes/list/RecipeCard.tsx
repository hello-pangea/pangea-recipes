import { RouterLink } from '#src/components/RouterLink';
import { useSignedInUserId } from '#src/features/auth/useSignedInUserId';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import {
  Box,
  Card,
  IconButton,
  Link as MuiLink,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { type RecipeProjected } from '@repo/features/recipes';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { RecipeMoreMenu } from '../RecipeMoreMenu';
import { RecipeDraggable } from './RecipeDraggable';

interface Props {
  recipe: RecipeProjected;
  onRemoveFromRecipeBook?: () => void;
}

export function RecipeCard({ recipe, onRemoveFromRecipeBook }: Props) {
  const userId = useSignedInUserId();
  const [isHovering, setIsHovering] = useState(false);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<
    | {
        type: 'context';
        mouseX: number;
        mouseY: number;
      }
    | {
        type: 'more';
        anchorEl: HTMLElement;
      }
    | null
  >(null);
  const moreMenuOpen = Boolean(moreMenuAnchor);
  const isTouchDevice = useMediaQuery('(hover: none)');

  const ownsRecipe = recipe.userId === userId;

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();

    setMoreMenuAnchor(
      moreMenuAnchor === null
        ? {
            type: 'context',
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null,
    );

    // Prevent text selection lost after opening the context menu on Safari and Firefox
    const selection = document.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      setTimeout(() => {
        selection.addRange(range);
      });
    }
  };

  return (
    <>
      <RecipeDraggable recipe={recipe}>
        <Card
          variant="outlined"
          sx={{
            '&:hover': {
              boxShadow:
                '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            },
          }}
          onContextMenu={
            isTouchDevice || !ownsRecipe ? undefined : handleContextMenu
          }
          onMouseEnter={
            isTouchDevice
              ? undefined
              : () => {
                  setIsHovering(true);
                }
          }
          onMouseLeave={
            isTouchDevice
              ? undefined
              : () => {
                  setIsHovering(false);
                }
          }
        >
          {recipe.images?.length ? (
            <Link
              to="/app/recipes/$recipeId"
              params={{
                recipeId: recipe.id,
              }}
              draggable={false}
              tabIndex={-1}
            >
              <img
                src={recipe.images.at(0)?.url}
                height={200}
                width={'100%'}
                style={{ objectFit: 'cover', display: 'block' }}
                draggable={false}
              />
            </Link>
          ) : (
            <Link
              to="/app/recipes/$recipeId"
              params={{
                recipeId: recipe.id,
              }}
              draggable={false}
              tabIndex={-1}
            >
              <img
                src={'/assets/recipe.jpg'}
                height={200}
                width={'100%'}
                style={{ objectFit: 'cover', display: 'block' }}
                draggable={false}
              />
            </Link>
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
              <RouterLink
                to="/app/recipes/$recipeId"
                params={{
                  recipeId: recipe.id,
                }}
                draggable={false}
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {recipe.name}
              </RouterLink>
              {recipe.websiteSource && (
                <Typography variant="caption">
                  <MuiLink
                    href={recipe.websiteSource.url}
                    rel="nofollow noopener"
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                    target="_blank"
                  >
                    {recipe.websiteSource.title ?? 'Source'}
                  </MuiLink>
                </Typography>
              )}
            </Box>
            {ownsRecipe && (
              <IconButton
                id="more-button"
                aria-controls={moreMenuOpen ? 'more-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={moreMenuOpen ? 'true' : undefined}
                onClick={(event) => {
                  setMoreMenuAnchor({
                    type: 'more',
                    anchorEl: event.currentTarget,
                  });
                }}
                sx={{
                  visibility:
                    isHovering || moreMenuAnchor || isTouchDevice
                      ? 'visible'
                      : 'hidden',
                }}
              >
                <MoreVertRoundedIcon />
              </IconButton>
            )}
          </Box>
        </Card>
      </RecipeDraggable>
      {ownsRecipe && (
        <RecipeMoreMenu
          recipe={recipe}
          anchorEl={
            moreMenuAnchor?.type === 'more' ? moreMenuAnchor.anchorEl : null
          }
          onClose={() => {
            setMoreMenuAnchor(null);
          }}
          anchorReference={
            moreMenuAnchor?.type === 'context' ? 'anchorPosition' : 'anchorEl'
          }
          onRemoveFromRecipeBook={onRemoveFromRecipeBook}
          anchorPosition={
            moreMenuAnchor?.type === 'context'
              ? { top: moreMenuAnchor.mouseY, left: moreMenuAnchor.mouseX }
              : undefined
          }
        />
      )}
    </>
  );
}
