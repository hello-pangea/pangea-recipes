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
import { useSignedInUserId } from '../auth/useSignedInUserId';
import { RecipeMoreMenu } from './RecipeMoreMenu';

interface Props {
  recipeId: string;
  onRemoveFromRecipeBook?: () => void;
}

export function RecipeCard({ recipeId, onRemoveFromRecipeBook }: Props) {
  const { data: recipe } = useRecipe({ recipeId: recipeId });
  const userId = useSignedInUserId();
  const ref = useRef<null | HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [previewContainer, setPreviewContainer] = useState<HTMLElement | null>(
    null,
  );
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
  const isTouchDevice = matchMedia('(hover: none)').matches;

  const ownsRecipe = recipe?.userId === userId;

  useEffect(() => {
    const element = ref.current;

    if (!element || !recipe) {
      return;
    }

    const data = {
      type: 'recipe',
      recipeId: recipeId,
      tryLater: recipe.tryLater,
      favorite: recipe.favorite,
    };

    return draggable({
      element: element,
      getInitialData: () => data,
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
      canDrag: () => ownsRecipe,
    });
  }, [recipeId, recipe, ownsRecipe]);

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
            to="/app/recipes/$recipeId"
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
              to="/app/recipes/$recipeId"
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
      {ownsRecipe && (
        <RecipeMoreMenu
          recipeId={recipeId}
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
      {previewContainer
        ? createPortal(<DragPreview text={recipe.name} />, previewContainer)
        : null}
    </>
  );
}
