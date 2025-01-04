import { CardActionAreaLink } from '#src/components/CardActionAreaLink';
import { DragPreview } from '#src/components/DragPreview';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Link,
  Typography,
} from '@mui/material';
import { useRecipe } from '@open-zero/features/recipes';
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
      <Card variant="outlined" ref={ref}>
        <CardActionAreaLink
          to="/recipes/$recipeId"
          params={{
            recipeId: recipeId,
          }}
          draggable={false}
        >
          {recipe.images?.length ? (
            <img
              src={recipe.images.at(0)?.url}
              height={200}
              width={'100%'}
              style={{ objectFit: 'cover', display: 'block' }}
              draggable={false}
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
                draggable={false}
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
        onRemoveFromRecipeBook={onRemoveFromRecipeBook}
      />
      {previewContainer
        ? createPortal(<DragPreview text={recipe.name} />, previewContainer)
        : null}
    </>
  );
}
