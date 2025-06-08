import { withForm } from '#src/hooks/form';
import type { FormPropsWrapper } from '#src/types/FormPropsWrapper';
import { isSxArray } from '#src/utils/isSxArray';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Box,
  Grid,
  InputAdornment,
  InputBase,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import { Fragment } from 'react/jsx-runtime';
import { recipeFormOptions, type RecipeFormInputs } from './recipeForm';

interface Props {
  sx?: SxProps<Theme>;
}

export const EditNutrition = withForm({
  ...recipeFormOptions,
  props: {} as FormPropsWrapper<Props>,
  render: function Render({ form, sx = [] }) {
    return (
      <Box
        sx={[
          {
            backgroundColor: (theme) => theme.vars.palette.background.paper,
            borderRadius: 1,
          },
          ...(isSxArray(sx) ? sx : [sx]),
        ]}
      >
        <Accordion elevation={0} disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
            <Typography component="span" variant="h2">
              Nutrition
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="caption" sx={{ mb: 2 }}>
              *Nutrition information from imports is approximate and might have
              errors.
            </Typography>
            <Box
              sx={{
                border: 1,
                borderColor: (theme) => theme.vars.palette.divider,
                borderRadius: 1,
                maxWidth: 500,
              }}
            >
              <Grid container>
                {nutritionLines.map(({ label, name, unit }, index) => (
                  <Fragment key={name}>
                    <Grid
                      size={6}
                      sx={{
                        backgroundColor: (theme) =>
                          index % 2 !== 0
                            ? alpha(theme.palette.text.primary, 0.05)
                            : undefined,
                        borderRight: 1,
                        borderBottom:
                          index === nutritionLines.length - 1 ? undefined : 1,
                        borderColor: (theme) => theme.vars.palette.divider,
                        display: 'flex',
                        alignItems: 'center',
                        py: 0.5,
                        px: 1,
                      }}
                    >
                      <Typography>{label}</Typography>
                    </Grid>
                    <Grid
                      size={6}
                      sx={{
                        backgroundColor: (theme) =>
                          index % 2 !== 0
                            ? alpha(theme.palette.text.primary, 0.05)
                            : undefined,
                        borderBottom:
                          index === nutritionLines.length - 1 ? undefined : 1,
                        borderColor: (theme) => theme.vars.palette.divider,
                      }}
                    >
                      <form.Field
                        name={`nutrition.${name}`}
                        children={({ state, handleChange, handleBlur }) => {
                          return (
                            <InputBase
                              placeholder="-"
                              fullWidth
                              type="number"
                              sx={{
                                px: 1,
                              }}
                              endAdornment={
                                unit && (
                                  <InputAdornment position="end">
                                    {unit}
                                  </InputAdornment>
                                )
                              }
                              value={state.value ?? ''}
                              onChange={(e) => {
                                handleChange(e.target.value);
                              }}
                              onBlur={handleBlur}
                            />
                          );
                        }}
                      />
                    </Grid>
                  </Fragment>
                ))}
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  },
});

const nutritionLines: {
  label: string;
  name: keyof Exclude<RecipeFormInputs['nutrition'], undefined>;
  unit?: string;
}[] = [
  {
    label: 'Calories',
    name: 'calories',
    unit: 'kcal',
  },
  {
    label: 'Total fat',
    name: 'totalFatG',
    unit: 'g',
  },
  {
    label: 'Unsaturated fat',
    name: 'unsaturatedFatG',
    unit: 'g',
  },
  {
    label: 'Saturated fat',
    name: 'saturatedFatG',
    unit: 'g',
  },
  {
    label: 'Trans fat',
    name: 'transFatG',
    unit: 'g',
  },
  {
    label: 'Carbs',
    name: 'carbsG',
    unit: 'g',
  },
  {
    label: 'Protein',
    name: 'proteinG',
    unit: 'g',
  },
  {
    label: 'Fiber',
    name: 'fiberG',
    unit: 'g',
  },
  {
    label: 'Sugar',
    name: 'sugarG',
    unit: 'g',
  },
  {
    label: 'Sodium',
    name: 'sodiumMg',
    unit: 'mg',
  },
  {
    label: 'Iron',
    name: 'ironMg',
    unit: 'mg',
  },
  {
    label: 'Calcium',
    name: 'calciumMg',
    unit: 'mg',
  },
  {
    label: 'Potassium',
    name: 'potassiumMg',
    unit: 'mg',
  },
  {
    label: 'Cholesterol',
    name: 'cholesterolMg',
    unit: 'mg',
  },
];
