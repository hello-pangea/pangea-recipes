import { isSxArray } from '#src/utils/isSxArray';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Box,
  Grid,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import type { Recipe } from '@open-zero/features/recipes';
import { Fragment } from 'react/jsx-runtime';

interface Props {
  nutrition: Exclude<Recipe['nutrition'], undefined>;
  showApproximateWarning?: boolean;
  sx?: SxProps<Theme>;
}

export function Nutrition({
  nutrition,
  showApproximateWarning,
  sx = [],
}: Props) {
  const nutritionKeysToDisplay = (
    Object.keys(nutrition) as (keyof Exclude<Recipe['nutrition'], undefined>)[]
  )
    .filter((key) => nutrition[key] !== null)
    .sort(
      (a, b) =>
        preferredNutritionOrder.indexOf(a) - preferredNutritionOrder.indexOf(b),
    );

  if (!nutritionKeysToDisplay.length) {
    return null;
  }

  return (
    <Box
      sx={[
        {
          backgroundColor: (theme) => theme.vars.palette.background.paper,
          borderRadius: 2,
          overflow: 'hidden',
        },
        ...(isSxArray(sx) ? sx : [sx]),
      ]}
    >
      <Accordion elevation={0} disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMoreRoundedIcon />}
          sx={{
            p: { xs: 2, sm: 3 },
            '& .MuiAccordionSummary-content': { m: 0 },
          }}
        >
          <Typography component="span" variant="h2">
            Nutrition <Typography component={'span'}>(per serving)</Typography>
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 }, pt: 0 }}
        >
          {showApproximateWarning && (
            <Typography variant="caption" sx={{ mb: 2 }}>
              *Nutrition information from imports is approximate and might have
              errors.
            </Typography>
          )}
          <Box
            sx={{
              border: 1,
              borderColor: (theme) => theme.vars.palette.divider,
              borderRadius: 1,
              maxWidth: 500,
            }}
          >
            <Grid container>
              {nutritionKeysToDisplay.map((key, index) => (
                <Fragment key={key}>
                  <Grid
                    size={6}
                    sx={{
                      backgroundColor: (theme) =>
                        index % 2 !== 0
                          ? alpha(theme.palette.text.primary, 0.05)
                          : undefined,
                      borderRight: 1,
                      borderBottom:
                        index === nutritionKeysToDisplay.length - 1
                          ? undefined
                          : 1,
                      borderColor: (theme) => theme.vars.palette.divider,
                      display: 'flex',
                      alignItems: 'center',
                      py: 0.5,
                      px: 1,
                    }}
                  >
                    <Typography>{nutriotionRecord[key].label}</Typography>
                  </Grid>
                  <Grid
                    size={6}
                    sx={{
                      backgroundColor: (theme) =>
                        index % 2 !== 0
                          ? alpha(theme.palette.text.primary, 0.05)
                          : undefined,
                      borderBottom:
                        index === nutritionKeysToDisplay.length - 1
                          ? undefined
                          : 1,
                      borderColor: (theme) => theme.vars.palette.divider,
                      display: 'flex',
                      alignItems: 'center',
                      py: 0.5,
                      px: 1,
                    }}
                  >
                    <Typography>
                      <Typography
                        component={'span'}
                        sx={{ fontWeight: 'bold' }}
                      >
                        {nutrition[key]}{' '}
                      </Typography>
                      {nutriotionRecord[key].unit}
                    </Typography>
                  </Grid>
                </Fragment>
              ))}
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

const preferredNutritionOrder: (keyof Exclude<
  Recipe['nutrition'],
  undefined
>)[] = [
  'calories',
  'totalFatG',
  'unsaturatedFatG',
  'saturatedFatG',
  'transFatG',
  'carbsG',
  'proteinG',
  'sodiumMg',
  'sugarG',
  'fiberG',
  'ironMg',
  'calciumMg',
  'potassiumMg',
  'cholesterolMg',
];

const nutriotionRecord: Record<
  keyof Exclude<Recipe['nutrition'], undefined>,
  {
    label: string;
    unit?: string;
  }
> = {
  calories: {
    label: 'Calories',
    unit: 'kcal',
  },
  totalFatG: {
    label: 'Total fat',
    unit: 'g',
  },
  unsaturatedFatG: {
    label: 'Unsaturated fat',
    unit: 'g',
  },
  saturatedFatG: {
    label: 'Saturated fat',
    unit: 'g',
  },
  transFatG: {
    label: 'Trans fat',
    unit: 'g',
  },
  carbsG: {
    label: 'Carbs',
    unit: 'g',
  },
  proteinG: {
    label: 'Protein',
    unit: 'g',
  },
  fiberG: {
    label: 'Fiber',
    unit: 'g',
  },
  sugarG: {
    label: 'Sugar',
    unit: 'g',
  },
  sodiumMg: {
    label: 'Sodium',
    unit: 'mg',
  },
  ironMg: {
    label: 'Iron',
    unit: 'mg',
  },
  calciumMg: {
    label: 'Calcium',
    unit: 'mg',
  },
  potassiumMg: {
    label: 'Potassium',
    unit: 'mg',
  },
  cholesterolMg: {
    label: 'Cholesterol',
    unit: 'mg',
  },
};
