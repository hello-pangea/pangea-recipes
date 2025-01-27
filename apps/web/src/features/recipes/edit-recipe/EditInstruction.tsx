import { DragPreview } from '#src/components/DragPreview';
import { DropIndicator } from '#src/components/DropIndicator';
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import { Box, FormLabel, IconButton } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { type UseFieldArrayRemove } from 'react-hook-form';
import {
  TextFieldElement,
  useFormContext,
  useWatch,
} from 'react-hook-form-mui';
import type { RecipeFormInputs } from './CreateRecipePage';

interface Props {
  instructionGroupIndex: number;
  index: number;
  removeInstruction: UseFieldArrayRemove;
}

export function EditInstruction({
  index,
  instructionGroupIndex,
  removeInstruction,
}: Props) {
  const { control } = useFormContext<RecipeFormInputs>();
  const ref = useRef<null | HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLButtonElement>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [previewContainer, setPreviewContainer] = useState<HTMLElement | null>(
    null,
  );
  const instruction = useWatch({
    control,
    name: `instructionGroups.${instructionGroupIndex}.instructions.${index}.text`,
  });

  useEffect(() => {
    const element = ref.current;
    const dragHandle = dragHandleRef.current;

    if (!element || !dragHandle) {
      return;
    }

    const data = {
      type: 'instruction',
      index: index,
      groupIndex: instructionGroupIndex,
      instruction: {
        text: instruction,
      },
    };

    return combine(
      draggable({
        element: dragHandle,
        getInitialData: () => data,
        onDragStart: () => {
          setDragging(true);
        },
        onDrop: () => {
          setDragging(false);
        },
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
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          return source.data['type'] === 'instruction';
        },
        getData({ input }) {
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ['top', 'bottom'],
          });
        },
        getIsSticky() {
          return true;
        },
        onDrag({ self, source }) {
          const isSource =
            source.element === element || source.element === dragHandle;
          if (isSource) {
            setClosestEdge(null);
            return;
          }

          const closestEdge = extractClosestEdge(self.data);

          const sourceIndex = source.data['index'];
          if (typeof sourceIndex !== 'number') {
            return;
          }

          const sourceGroupIndex = source.data['groupIndex'] as number;

          const isItemBeforeSource =
            index === sourceIndex - 1 &&
            instructionGroupIndex === sourceGroupIndex;
          const isItemAfterSource =
            index === sourceIndex + 1 &&
            instructionGroupIndex === sourceGroupIndex;

          const isDropIndicatorHidden =
            (isItemBeforeSource && closestEdge === 'bottom') ||
            (isItemAfterSource && closestEdge === 'top');

          if (isDropIndicatorHidden) {
            setClosestEdge(null);
            return;
          }

          setClosestEdge(closestEdge);
        },
        onDragEnter({ self, source }) {
          const isSource =
            source.element === element || source.element === dragHandle;
          if (isSource) {
            setClosestEdge(null);
            return;
          }

          const closestEdge = extractClosestEdge(self.data);

          const sourceIndex = source.data['index'];
          if (typeof sourceIndex !== 'number') {
            return;
          }

          const sourceGroupIndex = source.data['groupIndex'] as number;

          const isItemBeforeSource =
            index === sourceIndex - 1 &&
            instructionGroupIndex === sourceGroupIndex;
          const isItemAfterSource =
            index === sourceIndex + 1 &&
            instructionGroupIndex === sourceGroupIndex;

          const isDropIndicatorHidden =
            (isItemBeforeSource && closestEdge === 'bottom') ||
            (isItemAfterSource && closestEdge === 'top');

          if (isDropIndicatorHidden) {
            setClosestEdge(null);
            return;
          }

          setClosestEdge(closestEdge);
        },
        onDragLeave() {
          setClosestEdge(null);
        },
        onDrop() {
          setClosestEdge(null);
        },
      }),
    );
  }, [index, instructionGroupIndex, instruction]);

  return (
    <>
      <div
        ref={ref}
        style={{
          position: 'relative',
        }}
      >
        <Box
          sx={{
            opacity: dragging ? 0.4 : 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 0.5,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <IconButton
                color="default"
                ref={dragHandleRef}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                sx={{
                  cursor: 'grab',
                }}
                size="small"
              >
                <DragIndicatorRoundedIcon fontSize="small" />
              </IconButton>
              <FormLabel
                htmlFor={`instructionGroups.${instructionGroupIndex}.instructions.${index}.text`}
              >
                Step {index + 1}
              </FormLabel>
            </Box>
            <IconButton
              onClick={() => {
                removeInstruction(index);
              }}
              size="small"
            >
              <DeleteRoundedIcon fontSize="inherit" />
            </IconButton>
          </Box>
          <TextFieldElement
            id={`instructionGroups.${instructionGroupIndex}.instructions.${index}.text`}
            name={`instructionGroups.${instructionGroupIndex}.instructions.${index}.text`}
            control={control}
            multiline
            required
            fullWidth
            minRows={2}
          />
        </Box>
        {closestEdge && <DropIndicator edge={closestEdge} gap="24px" />}
      </div>
      {previewContainer
        ? createPortal(
            <DragPreview text={`Step ${index + 1}`} />,
            previewContainer,
          )
        : null}
    </>
  );
}
