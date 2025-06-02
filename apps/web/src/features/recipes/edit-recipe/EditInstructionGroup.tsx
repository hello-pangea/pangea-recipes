import { withForm } from '#src/hooks/form';
import type { FormPropsWrapper } from '#src/types/FormPropsWrapper';
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
import { useStore } from '@tanstack/react-form';
import { useEffect, useRef, useState } from 'react';
import { EditInstruction } from './EditInstruction';
import { recipeFormOptions, type RecipeFormInputs } from './recipeForm';

interface Props {
  index: number;
}

export const EditInstructionGroup = withForm({
  ...recipeFormOptions,
  props: {} as FormPropsWrapper<Props>,
  render: function Render({ form, index: instructionGroupIndex }) {
    const instructions = useStore(
      form.store,
      (state) =>
        state.values.instructionGroups.at(instructionGroupIndex)
          ?.instructions ?? [],
    );
    const minimal = useStore(
      form.store,
      (state) => state.values.instructionGroups.length <= 1,
    );

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

              form.moveFieldValues(
                `instructionGroups[${instructionGroupIndex}].instructions`,
                sourceIndex,
                finishIndex,
              );
            } else if (
              sourceGroupIndex !== targetGroupIndex &&
              sourceGroupIndex === instructionGroupIndex
            ) {
              console.log('DND: move instruction to another group (remove)');

              void form.removeFieldValue(
                `instructionGroups[${instructionGroupIndex}].instructions`,
                sourceIndex,
              );
            } else if (
              sourceGroupIndex !== targetGroupIndex &&
              targetGroupIndex === instructionGroupIndex
            ) {
              console.log('DND: insert instruction from another group');

              const closestEdgeOfTarget = extractClosestEdge(target.data);

              const finishIndex =
                closestEdgeOfTarget === 'bottom'
                  ? targetIndex + 1
                  : targetIndex;

              void form.insertFieldValue(
                `instructionGroups[${instructionGroupIndex}].instructions`,
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
              void form.removeFieldValue(
                `instructionGroups[${instructionGroupIndex}].instructions`,
                sourceIndex,
              );
            }

            if (targetGroupIndex === instructionGroupIndex) {
              form.pushFieldValue(
                `instructionGroups[${instructionGroupIndex}].instructions`,
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
    }, [instructionGroupIndex, form]);

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
            <form.AppField
              name={`instructionGroups[${instructionGroupIndex}].name`}
              children={(subField) => (
                <subField.TextField
                  label="Title"
                  placeholder="ex. Cake, Frosting"
                  required
                  fullWidth
                  variant="filled"
                />
              )}
            />
            <IconButton
              onClick={() => {
                void form.removeFieldValue(
                  'instructionGroups',
                  instructionGroupIndex,
                );
              }}
            >
              <DeleteRoundedIcon />
            </IconButton>
          </Stack>
        )}
        <Stack
          direction={'column'}
          spacing={3}
          sx={{ mb: 2, maxWidth: '750px' }}
        >
          {instructions.map((_instruction, instructionIndex) => (
            <EditInstruction
              form={form}
              key={instructionIndex}
              instructionGroupIndex={instructionGroupIndex}
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
            form.pushFieldValue(
              `instructionGroups[${instructionGroupIndex}].instructions`,
              {
                text: '',
              },
            );
          }}
        >
          Add step
        </Button>
      </Card>
    );
  },
});

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
