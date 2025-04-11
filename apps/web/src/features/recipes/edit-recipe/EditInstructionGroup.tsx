import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import {
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import {
  alpha,
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import {
  TextFieldElement,
  useFieldArray,
  useFormContext,
} from 'react-hook-form-mui';
import type { RecipeFormInputs } from './CreateRecipePage';
import { EditInstruction } from './EditInstruction';

interface Props {
  index: number;
  minimal?: boolean;
  onRemove: () => void;
}

export function EditInstructionGroup({
  index: instructionGroupIndex,
  minimal,
  onRemove,
}: Props) {
  const { control } = useFormContext<RecipeFormInputs>();
  const {
    fields: instructions,
    append: appendInstruction,
    remove: removeInstruction,
    move: moveInstruction,
    insert: insertInstruction,
  } = useFieldArray({
    control,
    name: `instructionGroups.${instructionGroupIndex}.instructions`,
  });

  useEffect(() => {
    return monitorForElements({
      onDrop(dropResult) {
        const source = dropResult.source;
        const sourceType = source.data['type'] as string | undefined;

        const target = dropResult.location.current.dropTargets[0];

        if (!target) {
          return;
        }

        const targetType = target.data['type'] as string | undefined;

        if (sourceType === 'instruction' && targetType === 'instruction') {
          console.log('DND: reorder instructions');

          const sourceIndex = source.data['index'] as number;
          const targetIndex = target.data['index'] as number;

          const sourceGroupIndex = source.data['groupIndex'] as number;
          const targetGroupIndex = target.data['groupIndex'] as number;

          if (
            sourceGroupIndex === targetGroupIndex &&
            sourceGroupIndex === instructionGroupIndex
          ) {
            console.log('DND: reorder instructions within the same group');

            const closestEdgeOfTarget = extractClosestEdge(target.data);

            const finishIndex = getReorderDestinationIndex({
              startIndex: sourceIndex,
              closestEdgeOfTarget,
              indexOfTarget: targetIndex,
              axis: 'vertical',
            });

            moveInstruction(sourceIndex, finishIndex);
          } else if (
            sourceGroupIndex !== targetGroupIndex &&
            sourceGroupIndex === instructionGroupIndex
          ) {
            console.log('DND: move instruction to another group (remove)');

            removeInstruction(sourceIndex);
          } else if (
            sourceGroupIndex !== targetGroupIndex &&
            targetGroupIndex === instructionGroupIndex
          ) {
            console.log('DND: insert instruction from another group');

            const closestEdgeOfTarget = extractClosestEdge(target.data);

            const finishIndex =
              closestEdgeOfTarget === 'bottom' ? targetIndex + 1 : targetIndex;

            insertInstruction(
              finishIndex,
              source.data[
                'instruction'
              ] as RecipeFormInputs['instructionGroups'][0]['instructions'][0],
            );
          }
        } else if (
          sourceType === 'instruction' &&
          targetType === 'empty_instruction_group'
        ) {
          console.log('DND: move instruction to empty group');

          const sourceIndex = source.data['index'] as number;
          const sourceGroupIndex = source.data['groupIndex'] as number;

          const targetGroupIndex = target.data[
            'instructionGroupIndex'
          ] as number;

          if (sourceGroupIndex === instructionGroupIndex) {
            removeInstruction(sourceIndex);
          }

          if (targetGroupIndex === instructionGroupIndex) {
            appendInstruction(
              source.data[
                'instruction'
              ] as RecipeFormInputs['instructionGroups'][0]['instructions'][0],
            );
          }
        }
      },
      canMonitor: ({ source }) =>
        ['instruction', 'empty_instruction_group'].includes(
          source.data['type'] as string,
        ),
    });
  }, [
    appendInstruction,
    instructionGroupIndex,
    insertInstruction,
    moveInstruction,
    removeInstruction,
  ]);

  return (
    <Card sx={{ p: 2 }}>
      {!minimal && (
        <Stack
          direction={'row'}
          alignItems={'center'}
          spacing={2}
          sx={{
            mb: 4,
          }}
        >
          <TextFieldElement
            name={`instructionGroups.${instructionGroupIndex}.name`}
            label="Title"
            placeholder="ex. Cake, Frosting"
            control={control}
            required
            fullWidth
            variant="filled"
          />
          <IconButton onClick={onRemove}>
            <DeleteRoundedIcon />
          </IconButton>
        </Stack>
      )}
      <Stack direction={'column'} spacing={3} sx={{ mb: 2, maxWidth: '750px' }}>
        {instructions.map((instruction, instructionIndex) => (
          <EditInstruction
            key={instruction.id}
            instructionGroupIndex={instructionGroupIndex}
            removeInstruction={removeInstruction}
            index={instructionIndex}
          />
        ))}
        {instructions.length === 0 && (
          <EmptyInstructionGroupDroppable
            instructionGroupIndex={instructionGroupIndex}
          />
        )}
      </Stack>
      <Button
        variant="outlined"
        size="small"
        startIcon={<AddRoundedIcon />}
        onClick={() => {
          appendInstruction({ text: '' });
        }}
      >
        Add step
      </Button>
    </Card>
  );
}

interface DroppableProps {
  instructionGroupIndex: number;
}

function EmptyInstructionGroupDroppable({
  instructionGroupIndex,
}: DroppableProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    return dropTargetForElements({
      element: el,
      getData: () => ({
        type: 'empty_instruction_group',
        instructionGroupIndex,
      }),
      onDragEnter: () => {
        setIsDraggedOver(true);
      },
      onDragLeave: () => {
        setIsDraggedOver(false);
      },
      onDrop: () => {
        setIsDraggedOver(false);
      },
      canDrop({ source }) {
        return source.data['type'] === 'instruction';
      },
    });
  }, [instructionGroupIndex]);

  return (
    <div ref={ref}>
      <Box
        sx={{
          p: 1,
          display: 'flex',
          borderStyle: 'dashed',
          borderWidth: '2px',
          borderRadius: 1,
          borderColor: (theme) =>
            isDraggedOver
              ? theme.vars.palette.primary.main
              : theme.vars.palette.divider,
          backgroundColor: (theme) =>
            isDraggedOver
              ? alpha(theme.palette.primary.main, 0.2)
              : theme.vars.palette.background.default,
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          transitionProperty: 'border-color, background-color',
          transitionTimingFunction: 'cubic-bezier(0.15, 1.0, 0.3, 1.0)',
          transitionDuration: '350ms',
        }}
      >
        <AddRoundedIcon
          sx={{
            color: (theme) =>
              isDraggedOver
                ? theme.vars.palette.primary.main
                : theme.vars.palette.text.secondary,
            transitionProperty: 'color',
            transitionTimingFunction: 'cubic-bezier(0.15, 1.0, 0.3, 1.0)',
            transitionDuration: '350ms',
          }}
        />
        <Typography
          sx={{
            color: (theme) =>
              isDraggedOver
                ? theme.vars.palette.primary.main
                : theme.vars.palette.text.secondary,
            transitionProperty: 'color',
            transitionTimingFunction: 'cubic-bezier(0.15, 1.0, 0.3, 1.0)',
            transitionDuration: '350ms',
          }}
          variant="body2"
        >
          Drop instructions here
        </Typography>
      </Box>
    </div>
  );
}
