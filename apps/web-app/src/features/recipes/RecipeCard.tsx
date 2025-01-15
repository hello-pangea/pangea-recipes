import { DragPreview } from '#src/components/DragPreview';
import { RouterLink } from '#src/components/RouterLink';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Link as MuiLink,
  Typography,
} from '@mui/material';
import { useRecipe } from '@open-zero/features/recipes';
import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { RecipeMoreMenu } from './RecipeMoreMenu';

interface Props {
  recipeId: string;
  onRemoveFromRecipeBook?: () => void;
}

export function RecipeCard({ recipeId, onRemoveFromRecipeBook }: Props) {
  const recipeQuery = useRecipe({ recipeId: recipeId });
  const ref = useRef<null | HTMLDivElement>(null);
  const [previewContainer, setPreviewContainer] = useState<HTMLElement | null>(
    null,
  );
  const recipe = recipeQuery.data?.recipe;
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const moreMenuOpen = Boolean(moreMenuAnchorEl);

  useEffect(() => {
    const element = ref.current;

    if (!element || !recipe) {
      return;
    }

    const data = {
      type: 'recipe',
      recipeId: recipeId,
    };

    return draggable({
      element: element,
      getInitialData: () => data,
      // onDragStart: () => {
      //   setDragging(true);
      // },
      // onDrop: () => {
      //   setDragging(false);
      // },
      onGenerateDragPreview({ nativeSetDragImage }) {
        setCustomNativeDragPreview({
          nativeSetDragImage,
          getOffset: pointerOutsideOfPreview({
            x: '16px',
            y: '8px',
          }),
          render({ container }) {
            setPreviewContainer(container);
          },
        });
      },
    });
  }, [recipeId, recipe]);

  if (!recipe) {
    return <CircularProgress />;
  }

  return (
    <>
      <Card
        variant="outlined"
        ref={ref}
        sx={{
          '&:hover': {
            boxShadow:
              '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          },
        }}
      >
        {recipe.images?.length ? (
          <Link
            to="/recipes/$recipeId"
            params={{
              recipeId: recipeId,
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
            to="/recipes/$recipeId"
            params={{
              recipeId: recipeId,
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
              to="/recipes/$recipeId"
              params={{
                recipeId: recipeId,
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
      </Card>
      <RecipeMoreMenu
        recipeId={recipeId}
        anchorEl={moreMenuAnchorEl}
        onClose={() => {
          setMoreMenuAnchorEl(null);
        }}
        onRemoveFromRecipeBook={onRemoveFromRecipeBook}
      />
      {previewContainer
        ? createPortal(<DragPreview text={recipe.name} />, previewContainer)
        : null}
    </>
  );
}
