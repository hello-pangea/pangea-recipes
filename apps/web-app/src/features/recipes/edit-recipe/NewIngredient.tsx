import { DragPreview } from '#src/components/DragPreview';
import { DropIndicator } from '#src/components/DropIndicator';
import { focusNextInput } from '#src/lib/focusNextInput';
import { getNumberFromInput } from '#src/lib/getNumberFromInput';
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
import {
  Autocomplete,
  Box,
  createFilterOptions,
  Grid2,
  IconButton,
  TextField,
} from '@mui/material';
import { useCanonicalIngredients } from '@open-zero/features/canonical-ingredients';
import { unitRecord, units } from '@open-zero/features/units';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Controller, type UseFieldArrayRemove } from 'react-hook-form';
import {
  AutocompleteElement,
  TextFieldElement,
  useFormContext,
  useWatch,
} from 'react-hook-form-mui';
import type { RecipeFormInputs } from './CreateRecipePage';
import { IngredientNotesButton } from './IngredientNotesButton';

interface Props {
  ingredientGroupIndex: number;
  index: number;
  removeIngredient: UseFieldArrayRemove;
}

export function NewIngredient({
  index,
  ingredientGroupIndex,
  removeIngredient,
}: Props) {
  const { control } = useFormContext<RecipeFormInputs>();
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
  const canonicalIngredientsQuery = useCanonicalIngredients();

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
              onKeyDown={(event) => {
                focusNextInput(
                  event,
                  `input[name="ingredientGroups.${ingredientGroupIndex}.ingredients.${index}.unit"]`,
                );
              }}
              rules={{
                validate: (value: number | string | null) => {
                  const parsedValue = getNumberFromInput(value);

                  if (parsedValue === null || isNaN(parsedValue)) {
                    return 'Invalid number';
                  }

                  return true;
                },
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
                openOnFocus: true,
                sx: {
                  width: { xs: undefined, sm: 115 },
                },
                filterOptions: createFilterOptions({
                  stringify: (option) =>
                    option
                      ? `${unitRecord[option].name} ${unitRecord[option].pluralName} ${unitRecord[option].abbreviation}`
                      : '',
                }),
                getOptionLabel: (option) =>
                  option
                    ? (unitRecord[option].displayName ??
                      unitRecord[option].abbreviation ??
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
              name={`ingredientGroups.${ingredientGroupIndex}.ingredients.${index}.name`}
              rules={{
                required: 'Required',
              }}
              render={({
                field: { onChange, value, ref, onBlur, disabled },
              }) => (
                <Autocomplete
                  freeSolo
                  autoSelect
                  autoHighlight
                  selectOnFocus
                  handleHomeEndKeys
                  fullWidth
                  value={value}
                  disableClearable
                  size="small"
                  options={
                    canonicalIngredientsQuery.data?.canonicalIngredients.map(
                      (ci) => ci.name,
                    ) ?? []
                  }
                  getOptionLabel={(option) => {
                    return (
                      canonicalIngredientsQuery.data?.canonicalIngredients.find(
                        (ci) => ci.name === option,
                      )?.name ?? option
                    );
                  }}
                  onChange={(_event, newValue) => {
                    onChange(newValue);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      placeholder="Food *"
                      inputRef={ref}
                    />
                  )}
                  renderOption={(props, option) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const { key, ...optionProps } = props;

                    const canonicalIngredient =
                      canonicalIngredientsQuery.data?.canonicalIngredients.find(
                        (ci) => ci.name === option,
                      );

                    return (
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      <li key={key} {...optionProps}>
                        {canonicalIngredient?.icon ? (
                          <img
                            width={16}
                            height={16}
                            src={canonicalIngredient.icon.url}
                            style={{ marginRight: 8 }}
                          />
                        ) : (
                          <Box sx={{ width: 16, mr: 1 }} />
                        )}
                        {canonicalIngredient?.name}
                      </li>
                    );
                  }}
                  onBlur={onBlur}
                  disabled={disabled}
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
            <DragPreview text={ingredient.name || 'Ingredient'} />,
            previewContainer,
          )
        : null}
    </>
  );
}
