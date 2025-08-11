import { DragPreview } from '#src/components/DragPreview';
import { useSignedInUserId } from '#src/features/auth/useSignedInUserId';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { type RecipeProjected } from '@repo/features/recipes';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  recipe: RecipeProjected;
  children: React.ReactNode;
}

export function RecipeDraggable({ recipe, children }: Props) {
  const userId = useSignedInUserId();
  const ref = useRef<null | HTMLDivElement>(null);
  const [previewContainer, setPreviewContainer] = useState<HTMLElement | null>(
    null,
  );

  const ownsRecipe = recipe.userId === userId;

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const data = {
      type: 'recipe',
      recipe: recipe,
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
  }, [recipe.id, recipe, ownsRecipe]);

  return (
    <>
      <div ref={ref}>{children}</div>
      {previewContainer
        ? createPortal(<DragPreview text={recipe.name} />, previewContainer)
        : null}
    </>
  );
}
