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
import { Autocomplete, Box, Grid2, IconButton, TextField } from '@mui/material';
import { unitRecord, units, useFoods } from '@open-zero/features';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AutocompleteElement,
  Controller,
  TextFieldElement,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form-mui';
import type { FoodOption, RecipeFormInputs } from './CreateRecipePage';
import { IngredientNotesButton } from './IngredientNotesButton';

interface Props {
  ingredientGroupIndex: number;
  index: number;
}

export function NewIngredient({ index, ingredientGroupIndex }: Props) {
  const { control } = useFormContext<RecipeFormInputs>();
  const { append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: `ingredientGroups.${ingredientGroupIndex}.ingredients`,
  });
  const ref = useRef<null | HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLButtonElement>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [previewContainer, setPreviewContainer] = useState<HTMLElement | null>(
    null,
  );
  const ingredient = useWatch({
    control,
    name: `ingredientGroups.${ingredientGroupIndex}.ingredients.${index}`,
  });
  const foodsQuery = useFoods();

  useEffect(() => {
    const element = ref.current;
    const dragHandle = dragHandleRef.current;

    if (!element || !dragHandle) {
      return;
    }

    const data = {
      type: 'ingredient',
      index: index,
      groupIndex: ingredientGroupIndex,
      ingredient,
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
          return source.data['type'] === 'ingredient';
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
            ingredientGroupIndex === sourceGroupIndex;
          const isItemAfterSource =
            index === sourceIndex + 1 &&
            ingredientGroupIndex === sourceGroupIndex;

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
          const closestEdge = extractClosestEdge(self.data);

          const sourceIndex = source.data['index'];
          if (typeof sourceIndex !== 'number') {
            return;
          }

          const sourceGroupIndex = source.data['groupIndex'] as number;

          const isItemBeforeSource =
            index === sourceIndex - 1 &&
            ingredientGroupIndex === sourceGroupIndex;
          const isItemAfterSource =
            index === sourceIndex + 1 &&
            ingredientGroupIndex === sourceGroupIndex;

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
  }, [index, ingredientGroupIndex, ingredient]);

  const foodOptions: FoodOption[] =
    foodsQuery.data?.foods.map((f) => {
      return {
        name: f.name,
        id: f.id,
        iconUrl: f.icon?.url,
      };
    }) ?? [];

  return (
    <>
      <div
        ref={ref}
        style={{
          position: 'relative',
        }}
      >
        <Grid2
          container
          spacing={1}
          sx={{
            opacity: dragging ? 0.4 : 1,
          }}
        >
          <Grid2 size="auto">
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
          </Grid2>
          <Grid2
            size={{
              xs: 6,
              sm: 'auto',
            }}
          >
            <TextFieldElement
              placeholder="Amount"
              name={`ingredientGroups.${ingredientGroupIndex}.ingredients.${index}.amount`}
              id={`ingredientGroups.${ingredientGroupIndex}.ingredients.${index}.amount`}
              inputMode="decimal"
              control={control}
              size="small"
              fullWidth
              sx={{
                width: { xs: undefined, sm: 115 },
              }}
            />
          </Grid2>
          <Grid2
            size={{
              xs: 6,
              sm: 'auto',
            }}
          >
            <AutocompleteElement
              name={`ingredientGroups.${ingredientGroupIndex}.ingredients.${index}.unit`}
              options={units}
              control={control}
              matchId
              autocompleteProps={{
                fullWidth: true,
                size: 'small',
                autoHighlight: true,
                disableClearable: true,
                sx: {
                  width: { xs: undefined, sm: 115 },
                },
                getOptionLabel: (option) =>
                  option
                    ? (unitRecord[option].abbreviation ??
                      unitRecord[option].name)
                    : '',
                renderOption: (props, option) => {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  const { key, ...optionProps } = props;

                  return (
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    <li key={key} {...optionProps}>
                      {option ? unitRecord[option].name : ''}
                    </li>
                  );
                },
              }}
              textFieldProps={{
                placeholder: 'Unit',
              }}
            />
          </Grid2>
          <Grid2
            size={{
              xs: 'grow',
            }}
          >
            <Controller
              control={control}
              name={`ingredientGroups.${ingredientGroupIndex}.ingredients.${index}.food`}
              rules={{
                required: 'Required',
              }}
              render={({ field: { ref, onChange, ...field } }) => (
                <Autocomplete
                  {...field}
                  freeSolo
                  fullWidth
                  selectOnFocus
                  handleHomeEndKeys
                  autoHighlight
                  autoSelect
                  size="small"
                  options={foodOptions}
                  getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    if (typeof option === 'string') {
                      return option;
                    }
                    // Add "xxx" option created dynamically
                    if (option.inputValue) {
                      return option.inputValue;
                    }
                    // Regular option
                    return option.name;
                  }}
                  getOptionKey={(option) =>
                    typeof option === 'string'
                      ? option
                      : (option.id ?? option.name)
                  }
                  onChange={(_event, newValue) => {
                    if (typeof newValue === 'string') {
                      onChange({
                        name: newValue,
                      });
                    } else if (newValue?.inputValue) {
                      // Create a new value from the user input
                      onChange({
                        name: newValue.inputValue,
                      });
                    } else {
                      onChange(newValue);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      appendIngredient({
                        food: {
                          name: '',
                        },
                        unit: null,
                        amount: null,
                        notes: null,
                      });

                      // run this code in 50ms
                      setTimeout(() => {
                        document
                          .getElementById(
                            `ingredientGroups.${ingredientGroupIndex}.ingredients.${index + 1}.amount`,
                          )
                          ?.focus();
                      }, 50);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputRef={ref}
                      required
                      placeholder="Food *"
                    />
                  )}
                  renderOption={(props, option) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const { key, ...optionProps } = props;

                    return (
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      <li key={key} {...optionProps}>
                        {option.iconUrl ? (
                          <img
                            width={16}
                            height={16}
                            src={option.iconUrl}
                            style={{ marginRight: 8 }}
                          />
                        ) : (
                          <Box sx={{ width: 16, mr: 1 }} />
                        )}
                        {option.name}
                      </li>
                    );
                  }}
                />
              )}
            />
          </Grid2>
          <Grid2
            size={{
              xs: 'auto',
            }}
            display="flex"
            alignItems="center"
          >
            <IngredientNotesButton
              ingredientGroupIndex={ingredientGroupIndex}
              ingredientIndex={index}
            />
            <IconButton
              onClick={() => {
                removeIngredient(index);
              }}
            >
              <DeleteRoundedIcon />
            </IconButton>
          </Grid2>
        </Grid2>
        {closestEdge && <DropIndicator edge={closestEdge} gap="16px" />}
      </div>
      {previewContainer
        ? createPortal(
            <DragPreview text={ingredient.food.name || 'Ingredient'} />,
            previewContainer,
          )
        : null}
    </>
  );
}
