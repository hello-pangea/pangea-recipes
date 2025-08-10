import { DragPreview } from '#src/components/DragPreview';
import { DropIndicator } from '#src/components/DropIndicator';
import { withForm } from '#src/hooks/form';
import type { FormPropsWrapper } from '#src/types/FormPropsWrapper';
import { focusNextInput } from '#src/utils/focusNextInput';
import { getNumberFromInput } from '#src/utils/getNumberFromInput';
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
  Grid,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { numberToFraction } from '@repo/features';
import { listCanonicalIngredientsQueryOptions } from '@repo/features/canonical-ingredients';
import { defaultUnitOptions } from '@repo/features/units';
import { useSignedInUser } from '@repo/features/users';
import { useStore } from '@tanstack/react-form';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IngredientNotesButton } from './IngredientNotesButton';
import { recipeFormOptions } from './recipeForm';

interface Props {
  ingredientGroupIndex: number;
  index: number;
}

export const EditIngredient = withForm({
  ...recipeFormOptions,
  props: {} as FormPropsWrapper<Props>,
  render: function Render({ form, ingredientGroupIndex, index }) {
    const ref = useRef<null | HTMLDivElement>(null);
    const dragHandleRef = useRef<HTMLButtonElement>(null);
    const [dragging, setDragging] = useState<boolean>(false);
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
    const [previewContainer, setPreviewContainer] =
      useState<HTMLElement | null>(null);
    const ingredient = useStore(form.store, (state) =>
      state.values.ingredientGroups
        .at(ingredientGroupIndex)
        ?.ingredients.at(index),
    );
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

    const parsedQuantity = getNumberFromInput(ingredient?.quantity);

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
                        ingredient?.name
                          ? theme.vars.palette.text.primary
                          : theme.vars.palette.text.secondary,
                    }}
                  >
                    {ingredient?.name
                      ? `${parsedQuantity !== null ? numberToFraction(parsedQuantity) : ''}${ingredient.unit ? ` ${ingredient.unit} ` : ''}${ingredient.name}`
                      : 'Ingredient'}
                  </Typography>
                </Box>
              </CardActionArea>
            ) : (
              <EditIngredientContent
                form={form}
                index={index}
                ingredientGroupIndex={ingredientGroupIndex}
              />
            )}
          </Box>
          {closestEdge && <DropIndicator edge={closestEdge} gap="16px" />}
        </div>
        {previewContainer
          ? createPortal(
              <DragPreview text={ingredient?.name || 'Ingredient'} />,
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
                form={form}
                index={index}
                ingredientGroupIndex={ingredientGroupIndex}
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
                  void form.removeFieldValue(
                    `ingredientGroups[${ingredientGroupIndex}].ingredients`,
                    index,
                  );
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
  },
});

export const EditIngredientContent = withForm({
  ...recipeFormOptions,
  props: {} as FormPropsWrapper<Props>,
  render: function Render({ form, ingredientGroupIndex, index }) {
    const { data: user } = useSignedInUser();
    const { data: canonicalIngredients } = useQuery(
      listCanonicalIngredientsQueryOptions(),
    );
    const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return (
      <Grid
        container
        spacing={{
          xs: 3,
          sm: 1,
        }}
        flex={1}
      >
        <Grid
          size={{
            xs: 12,
            sm: 'auto',
          }}
        >
          <form.AppField
            name={`ingredientGroups[${ingredientGroupIndex}].ingredients[${index}].quantity`}
            children={(field) => (
              <field.TextField
                label={isSmall ? 'Amount' : undefined}
                placeholder="Amount"
                id={`ingredientGroups.${ingredientGroupIndex}.ingredients.${index}.quantity`}
                inputMode="decimal"
                size={isSmall ? undefined : 'small'}
                fullWidth
                sx={{
                  width: { xs: undefined, sm: 95 },
                }}
                onKeyDown={(event) => {
                  focusNextInput(
                    event,
                    `input[name="ingredientGroups[${ingredientGroupIndex}].ingredients[${index}].unit"]`,
                  );
                }}
              />
            )}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 'auto',
          }}
        >
          <form.Field
            name={`ingredientGroups[${ingredientGroupIndex}].ingredients[${index}].unit`}
            children={({ state, handleChange, handleBlur }) => {
              return (
                <Autocomplete
                  freeSolo
                  autoSelect
                  selectOnFocus
                  handleHomeEndKeys
                  fullWidth
                  value={state.value}
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
                    handleChange(newValue as string);
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
                    />
                  )}
                  renderOption={(props, option) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
                  onBlur={handleBlur}
                />
              );
            }}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 'grow',
          }}
        >
          <form.Field
            name={`ingredientGroups[${ingredientGroupIndex}].ingredients[${index}].name`}
            children={({ state, handleChange, handleBlur }) => {
              return (
                <Autocomplete
                  freeSolo
                  autoSelect
                  autoHighlight
                  selectOnFocus
                  handleHomeEndKeys
                  fullWidth
                  value={state.value}
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
                    handleChange(newValue);
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
                    />
                  )}
                  renderOption={(props, option) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
                  onBlur={handleBlur}
                />
              );
            }}
          />
        </Grid>
        {isSmall && (
          <Grid size={12}>
            <form.AppField
              name={`ingredientGroups[${ingredientGroupIndex}].ingredients[${index}].notes`}
              children={(field) => (
                <field.TextField
                  label={'Notes'}
                  id={`ingredientGroups.${ingredientGroupIndex}.ingredients.${index}.notes`}
                  fullWidth
                  multiline
                />
              )}
            />
          </Grid>
        )}
        {!isSmall && (
          <Grid
            size={{
              xs: 'auto',
            }}
            display="flex"
            alignItems="center"
          >
            <IngredientNotesButton
              form={form}
              ingredientGroupIndex={ingredientGroupIndex}
              ingredientIndex={index}
            />
            <IconButton
              onClick={() => {
                void form.removeFieldValue(
                  `ingredientGroups[${ingredientGroupIndex}].ingredients`,
                  index,
                );
              }}
            >
              <DeleteRoundedIcon />
            </IconButton>
          </Grid>
        )}
      </Grid>
    );
  },
});
