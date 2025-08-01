import { DragPreview } from '#src/components/DragPreview';
import { RouterLink } from '#src/components/RouterLink';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import {
  Box,
  CardActionArea,
  CircularProgress,
  IconButton,
  Link as MuiLink,
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

export function RecipeCell({ recipeId, onRemoveFromRecipeBook }: Props) {
  const { data: recipe } = useRecipe({ recipeId: recipeId });
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

  useEffect(() => {
    const element = ref.current;

    if (!element || !recipe) {
      return;
    }

    const data = {
      type: 'recipe',
      recipeId: recipeId,
      tryLater: recipe.tryLater,
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
    });
  }, [recipeId, recipe]);

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
      <CardActionArea
        // ref={ref}
        sx={{
          display: 'flex',
          p: 1,
          borderRadius: 1,
        }}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => {
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
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
              height={48}
              width={72}
              style={{ objectFit: 'cover', display: 'block', borderRadius: 8 }}
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
              height={48}
              width={72}
              style={{ objectFit: 'cover', display: 'block', borderRadius: 8 }}
              draggable={false}
            />
          </Link>
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            ml: 1.5,
            width: '100%',
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
              variant="body1"
            >
              {recipe.name}
            </RouterLink>
            {recipe.websiteSource && (
              <MuiLink
                href={recipe.websiteSource.url}
                rel="nofollow noopener"
                variant="caption"
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
            )}
          </Box>
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
              visibility: isHovering || moreMenuAnchor ? 'visible' : 'hidden',
            }}
          >
            <MoreVertRoundedIcon />
          </IconButton>
        </Box>
      </CardActionArea>
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
      {previewContainer
        ? createPortal(<DragPreview text={recipe.name} />, previewContainer)
        : null}
    </>
  );
}
