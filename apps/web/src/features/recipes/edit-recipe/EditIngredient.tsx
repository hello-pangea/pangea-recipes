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
  alpha,
  Autocomplete,
  Box,
  Button,
  CardActionArea,
  createFilterOptions,
  Dialog,
  DialogActions,
  DialogContent,
  Grid2,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { numberToFraction } from '@open-zero/features';
import { useCanonicalIngredients } from '@open-zero/features/canonical-ingredients';
import { defaultUnitOptions } from '@open-zero/features/units';
import { useSignedInUser } from '@open-zero/features/users';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Controller, type UseFieldArrayRemove } from 'react-hook-form';
import {
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

export function EditIngredient({
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));

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
        onDragLeave() {
          setClosestEdge(null);
        },
        onDrop() {
          setClosestEdge(null);
        },
      }),
    );
  }, [index, ingredientGroupIndex, ingredient]);

  const parsedQuantity = getNumberFromInput(ingredient.quantity);

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
            display: 'flex',
            alignItems: 'center',
            gap: isSmall ? 0 : 1,
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
          {isSmall ? (
            <CardActionArea
              onClick={() => {
                setDialogOpen(true);
              }}
              sx={{
                flex: 1,
              }}
            >
              <Box
                sx={{
                  borderRadius: 1,
                  border: 1,
                  borderColor: (theme) =>
                    alpha(theme.palette.text.primary, 0.23),
                  px: '14px',
                  py: '8.5px',
                }}
              >
                <Typography
                  sx={{
                    color: (theme) =>
                      ingredient.name
                        ? theme.palette.text.primary
                        : theme.palette.text.secondary,
                  }}
                >
                  {ingredient.name
                    ? `${parsedQuantity ? numberToFraction(parsedQuantity) : ''}${ingredient.unit ? ` ${ingredient.unit} ` : ''}${ingredient.name}`
                    : 'Ingredient'}
                </Typography>
              </Box>
            </CardActionArea>
          ) : (
            <EditIngredientContent
              index={index}
              ingredientGroupIndex={ingredientGroupIndex}
              removeIngredient={removeIngredient}
            />
          )}
        </Box>
        {closestEdge && <DropIndicator edge={closestEdge} gap="16px" />}
      </div>
      {previewContainer
        ? createPortal(
            <DragPreview text={ingredient.name || 'Ingredient'} />,
            previewContainer,
          )
        : null}
      {isSmall && (
        <Dialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
          }}
        >
          <DialogContent>
            <EditIngredientContent
              index={index}
              ingredientGroupIndex={ingredientGroupIndex}
              removeIngredient={removeIngredient}
            />
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'space-between',
            }}
          >
            <Button
              startIcon={<DeleteRoundedIcon />}
              onClick={() => {
                removeIngredient(index);
              }}
              color="error"
            >
              Delete
            </Button>
            <Button
              onClick={() => {
                setDialogOpen(false);
              }}
              variant="contained"
            >
              Done
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export function EditIngredientContent({
  index,
  ingredientGroupIndex,
  removeIngredient,
}: Props) {
  const { control } = useFormContext<RecipeFormInputs>();
  const { data: user } = useSignedInUser();
  const { data: canonicalIngredients } = useCanonicalIngredients();
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Grid2
      container
      spacing={{
        xs: 3,
        sm: 1,
      }}
      flex={1}
    >
      <Grid2
        size={{
          xs: 12,
          sm: 'auto',
        }}
      >
        <TextFieldElement
          label={isSmall ? 'Amount' : undefined}
          placeholder="Amount"
          name={`ingredientGroups.${ingredientGroupIndex}.ingredients.${index}.quantity`}
          id={`ingredientGroups.${ingredientGroupIndex}.ingredients.${index}.quantity`}
          inputMode="decimal"
          control={control}
          size={isSmall ? undefined : 'small'}
          fullWidth
          sx={{
            width: { xs: undefined, sm: 95 },
          }}
          onKeyDown={(event) => {
            focusNextInput(
              event,
              `input[name="ingredientGroups.${ingredientGroupIndex}.ingredients.${index}.unit"]`,
            );
          }}
          rules={{
            validate: (value: number | string | null) => {
              if (value === null || value === '') {
                return true;
              }

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
          xs: 12,
          sm: 'auto',
        }}
      >
        <Controller
          control={control}
          name={`ingredientGroups.${ingredientGroupIndex}.ingredients.${index}.unit`}
          render={({ field: { onChange, value, ref, onBlur, disabled } }) => (
            <Autocomplete
              freeSolo
              autoSelect
              selectOnFocus
              handleHomeEndKeys
              fullWidth
              value={value}
              size={isSmall ? undefined : 'small'}
              options={defaultUnitOptions.filter(
                (option) => option.system === user?.unitsPreference,
              )}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }

                return option.name;
              }}
              onChange={(_event, newValue) => {
                onChange(newValue);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
              filterOptions={createFilterOptions({
                stringify: (option) =>
                  `${option.name} ${option.pluralName} ${option.abbreviation}`,
              })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Unit"
                  label={isSmall ? 'Unit' : undefined}
                  inputRef={ref}
                />
              )}
              renderOption={(props, option) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, react/prop-types
                const { key, ...optionProps } = props;

                const unitOption = defaultUnitOptions.find(
                  (u) => u.name === option.name,
                );

                return (
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  <li key={key} {...optionProps}>
                    {unitOption?.name}
                  </li>
                );
              }}
              sx={{
                width: { xs: undefined, sm: 150 },
              }}
              onBlur={onBlur}
              disabled={disabled}
            />
          )}
        />
      </Grid2>
      <Grid2
        size={{
          xs: 12,
          sm: 'grow',
        }}
      >
        <Controller
          control={control}
          name={`ingredientGroups.${ingredientGroupIndex}.ingredients.${index}.name`}
          rules={{
            required: 'Required',
          }}
          render={({ field: { onChange, value, ref, onBlur, disabled } }) => (
            <Autocomplete
              freeSolo
              autoSelect
              autoHighlight
              selectOnFocus
              handleHomeEndKeys
              fullWidth
              value={value}
              disableClearable
              size={isSmall ? undefined : 'small'}
              options={canonicalIngredients?.map((ci) => ci.name) ?? []}
              getOptionLabel={(option) => {
                return (
                  canonicalIngredients?.find((ci) => ci.name === option)
                    ?.name ?? option
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
                  placeholder="Ingredient *"
                  label={isSmall ? 'Ingredient' : undefined}
                  inputRef={ref}
                />
              )}
              renderOption={(props, option) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, react/prop-types
                const { key, ...optionProps } = props;

                const canonicalIngredient = canonicalIngredients?.find(
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
      {isSmall && (
        <Grid2 size={12}>
          <TextFieldElement
            label={'Notes'}
            name={`ingredientGroups.${ingredientGroupIndex}.ingredients.${index}.notes`}
            id={`ingredientGroups.${ingredientGroupIndex}.ingredients.${index}.notes`}
            control={control}
            fullWidth
            multiline
          />
        </Grid2>
      )}
      {!isSmall && (
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
      )}
    </Grid2>
  );
}
