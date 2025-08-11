import { DragPreview } from '#src/components/DragPreview';
import { RouterCardActionArea } from '#src/components/RouterCardActionArea';
import { secondsToTimeString } from '#src/utils/timeFormatting';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { type RecipeProjected } from '@repo/features/recipes';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { RecipeMoreMenu } from './RecipeMoreMenu';

interface Props {
  recipe: RecipeProjected;
  onRemoveFromRecipeBook?: () => void;
  compact?: boolean;
}

export function RecipeCell({ recipe, onRemoveFromRecipeBook, compact }: Props) {
  const ref = useRef<null | HTMLButtonElement>(null);
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

    if (!element) {
      return;
    }

    const data = {
      type: 'recipe',
      recipeId: recipe.id,
      tryLater: Boolean(recipe.tryLaterAt),
      favorite: Boolean(recipe.favoritedAt),
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
  }, [recipe]);

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

  const coverImage = recipe.images?.at(0)?.url ?? '/assets/recipe.jpg';

  const totalTime = (recipe.cookTime ?? 0) + (recipe.prepTime ?? 0);

  return (
    <>
      <RouterCardActionArea
        ref={ref}
        sx={{
          display: 'flex',
          p: compact ? 0.5 : 1,
          borderRadius: 1,
        }}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => {
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
        to="/app/recipes/$recipeId"
        params={{ recipeId: recipe.id }}
      >
        {!compact && (
          <img
            src={coverImage}
            height={56}
            width={56}
            style={{ objectFit: 'cover', display: 'block', borderRadius: 8 }}
            draggable={false}
          />
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
            <Typography
              sx={{
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {recipe.name}
            </Typography>
            {!compact && (
              <Stack
                direction={'row'}
                divider={
                  <Typography
                    variant="caption"
                    sx={{
                      color: (theme) => theme.palette.text.secondary,
                      pr: 0.5,
                    }}
                  >
                    ,{' '}
                  </Typography>
                }
              >
                {totalTime > 0 && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: (theme) => theme.palette.text.secondary,
                    }}
                  >
                    <TimerRoundedIcon
                      fontSize="inherit"
                      sx={{
                        verticalAlign: 'bottom',
                      }}
                    />{' '}
                    {secondsToTimeString(totalTime)}
                  </Typography>
                )}
                {recipe.websiteSource && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: (theme) => theme.palette.text.secondary,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();

                      window.open(
                        recipe.websiteSource?.url,
                        '_blank',
                        'noopener',
                      );
                    }}
                  >
                    {recipe.websiteSource.title}
                  </Typography>
                )}
              </Stack>
            )}
          </Box>
          <IconButton
            component="div"
            id="more-button"
            aria-controls={moreMenuOpen ? 'more-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={moreMenuOpen ? 'true' : undefined}
            size={compact ? 'small' : undefined}
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();

              setMoreMenuAnchor({
                type: 'more',
                anchorEl: event.currentTarget,
              });
            }}
            sx={{
              visibility: isHovering || moreMenuAnchor ? 'visible' : 'hidden',
            }}
          >
            <MoreVertRoundedIcon fontSize={compact ? 'small' : undefined} />
          </IconButton>
        </Box>
      </RouterCardActionArea>
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
      {previewContainer
        ? createPortal(<DragPreview text={recipe.name} />, previewContainer)
        : null}
    </>
  );
}
