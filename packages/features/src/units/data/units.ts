export interface UnitOption {
  name: string;
  pluralName: string;
  abbreviation?: string;
  displayName?: string;
  system?: 'metric' | 'imperial';
}

export const defaultUnitOptions: UnitOption[] = [
  // Imperial volume
  {
    name: 'teaspoon',
    pluralName: 'teaspoons',
    abbreviation: 'tsp',
    system: 'imperial',
  },
  {
    name: 'tablespoon',
    pluralName: 'tablespoons',
    abbreviation: 'tbsp',
    system: 'imperial',
  },
  {
    name: 'cup',
    pluralName: 'cups',
    abbreviation: 'c',
    displayName: 'cup',
    system: 'imperial',
  },
  {
    name: 'fluid ounce',
    pluralName: 'fluid ounces',
    abbreviation: 'fl oz',
    system: 'imperial',
  },
  {
    name: 'pint',
    pluralName: 'pints',
    abbreviation: 'pt',
    system: 'imperial',
  },
  {
    name: 'quart',
    pluralName: 'quarts',
    abbreviation: 'qt',
    system: 'imperial',
  },
  {
    name: 'gallon',
    pluralName: 'gallons',
    abbreviation: 'gal',
    system: 'imperial',
  },
  // Metric volume
  {
    name: 'mililiter',
    pluralName: 'mililiters',
    abbreviation: 'ml',
    system: 'metric',
  },
  {
    name: 'centiliter',
    pluralName: 'centiliters',
    abbreviation: 'cl',
    system: 'metric',
  },
  {
    name: 'deciliter',
    pluralName: 'deciliters',
    abbreviation: 'dl',
    system: 'metric',
  },
  {
    name: 'liter',
    pluralName: 'liters',
    abbreviation: 'l',
    system: 'metric',
  },
  // Metric weight
  {
    name: 'milligram',
    pluralName: 'milligrams',
    abbreviation: 'mg',
    system: 'metric',
  },
  {
    name: 'gram',
    pluralName: 'grams',
    abbreviation: 'g',
    system: 'metric',
  },
  {
    name: 'kilogram',
    pluralName: 'kilograms',
    abbreviation: 'kg',
    system: 'metric',
  },
  // Imperial weight
  {
    name: 'ounce',
    pluralName: 'ounces',
    abbreviation: 'oz',
    system: 'imperial',
  },
  {
    name: 'pound',
    pluralName: 'pounds',
    abbreviation: 'lb',
    system: 'imperial',
  },
];
