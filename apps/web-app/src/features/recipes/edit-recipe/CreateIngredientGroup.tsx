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
import { NewIngredient } from './NewIngredient';
interface Props {
  index: number;
  minimal?: boolean;
  onRemove: () => void;
}

export function CreateIngredientGroup({
  index: ingredientGroupIndex,
  minimal,
  onRemove,
}: Props) {
  const { control } = useFormContext<RecipeFormInputs>();
  const {
    fields: ingredients,
    append: appendIngredient,
    remove: removeIngredient,
    move: moveIngredient,
    insert: insertIngredient,
  } = useFieldArray({
    control,
    name: `ingredientGroups.${ingredientGroupIndex}.ingredients`,
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

        if (sourceType === 'ingredient' && targetType === 'ingredient') {
          console.log('DND: reorder ingredients');

          const sourceIndex = source.data['index'] as number;
          const targetIndex = target.data['index'] as number;

          const sourceGroupIndex = source.data['groupIndex'] as number;
          const targetGroupIndex = target.data['groupIndex'] as number;

          if (
            sourceGroupIndex === targetGroupIndex &&
            sourceGroupIndex === ingredientGroupIndex
          ) {
            console.log('DND: reorder ingredients within the same group');

            const closestEdgeOfTarget = extractClosestEdge(target.data);

            const finishIndex = getReorderDestinationIndex({
              startIndex: sourceIndex,
              closestEdgeOfTarget,
              indexOfTarget: targetIndex,
              axis: 'vertical',
            });

            moveIngredient(sourceIndex, finishIndex);
          } else if (
            sourceGroupIndex !== targetGroupIndex &&
            sourceGroupIndex === ingredientGroupIndex
          ) {
            console.log('DND: move ingredient to another group (remove)');

            removeIngredient(sourceIndex);
          } else if (
            sourceGroupIndex !== targetGroupIndex &&
            targetGroupIndex === ingredientGroupIndex
          ) {
            console.log('DND: insert ingredient from another group');

            const closestEdgeOfTarget = extractClosestEdge(target.data);

            const finishIndex =
              closestEdgeOfTarget === 'bottom' ? targetIndex + 1 : targetIndex;

            insertIngredient(
              finishIndex,
              source.data[
                'ingredient'
              ] as RecipeFormInputs['ingredientGroups'][0]['ingredients'][0],
            );
          }
        } else if (
          sourceType === 'ingredient' &&
          targetType === 'empty_ingredient_group'
        ) {
          console.log('DND: move ingredient to empty group');

          const sourceIndex = source.data['index'] as number;
          const sourceGroupIndex = source.data['groupIndex'] as number;

          const targetGroupIndex = target.data[
            'ingredientGroupIndex'
          ] as number;

          if (sourceGroupIndex === ingredientGroupIndex) {
            removeIngredient(sourceIndex);
          }

          if (targetGroupIndex === ingredientGroupIndex) {
            appendIngredient(
              source.data[
                'ingredient'
              ] as RecipeFormInputs['ingredientGroups'][0]['ingredients'][0],
            );
          }
        }
      },
      canMonitor: ({ source }) =>
        ['ingredient', 'empty_ingredient_group'].includes(
          source.data['type'] as string,
        ),
    });
  }, [
    appendIngredient,
    ingredientGroupIndex,
    insertIngredient,
    moveIngredient,
    removeIngredient,
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
            name={`ingredientGroups.${ingredientGroupIndex}.name`}
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
      <Stack
        direction={'column'}
        spacing={2}
        useFlexGap
        sx={{ mb: 2, maxWidth: '750px' }}
      >
        {ingredients.map((ingredient, ingredientIndex) => (
          <NewIngredient
            ingredientGroupIndex={ingredientGroupIndex}
            index={ingredientIndex}
            key={ingredient.id}
            removeIngredient={removeIngredient}
          />
        ))}
        {ingredients.length === 0 && (
          <EmptyIngredientGroupDroppable
            ingredientGroupIndex={ingredientGroupIndex}
          />
        )}
      </Stack>
      <Button
        variant="outlined"
        size="small"
        startIcon={<AddRoundedIcon />}
        onClick={() => {
          appendIngredient({
            name: '',
            unit: null,
            amount: null,
            notes: null,
          });
        }}
      >
        Add ingredient
      </Button>
    </Card>
  );
}

interface DroppableProps {
  ingredientGroupIndex: number;
}

function EmptyIngredientGroupDroppable({
  ingredientGroupIndex,
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
      getData: () => ({ type: 'empty_ingredient_group', ingredientGroupIndex }),
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
        return source.data['type'] === 'ingredient';
      },
    });
  }, [ingredientGroupIndex]);

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
            isDraggedOver ? theme.palette.primary.main : theme.palette.divider,
          backgroundColor: (theme) =>
            isDraggedOver
              ? alpha(theme.palette.primary.main, 0.2)
              : theme.palette.background.default,
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
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            transitionProperty: 'color',
            transitionTimingFunction: 'cubic-bezier(0.15, 1.0, 0.3, 1.0)',
            transitionDuration: '350ms',
          }}
        />
        <Typography
          sx={{
            color: (theme) =>
              isDraggedOver
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            transitionProperty: 'color',
            transitionTimingFunction: 'cubic-bezier(0.15, 1.0, 0.3, 1.0)',
            transitionDuration: '350ms',
          }}
          variant="body2"
        >
          Drop ingredients here
        </Typography>
      </Box>
    </div>
  );
}
