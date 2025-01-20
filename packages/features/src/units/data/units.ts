export interface UnitOption {
  name: string;
  pluralName: string;
  abbreviation?: string;
  displayName?: string;
}

export const defaultUnitOptions: UnitOption[] = [
  // Metric weight
  {
    name: 'milligram',
    pluralName: 'milligrams',
    abbreviation: 'mg',
  },
  {
    name: 'gram',
    pluralName: 'grams',
    abbreviation: 'g',
  },
  {
    name: 'kilogram',
    pluralName: 'kilograms',
    abbreviation: 'kg',
  },
  // Imperial weight
  {
    name: 'ounce',
    pluralName: 'ounces',
    abbreviation: 'oz',
  },
  {
    name: 'pound',
    pluralName: 'pounds',
    abbreviation: 'lb',
  },
  // Metric volume
  {
    name: 'mililiter',
    pluralName: 'mililiters',
    abbreviation: 'ml',
  },
  {
    name: 'centiliter',
    pluralName: 'centiliters',
    abbreviation: 'cl',
  },
  {
    name: 'deciliter',
    pluralName: 'deciliters',
    abbreviation: 'dl',
  },
  {
    name: 'liter',
    pluralName: 'liters',
    abbreviation: 'l',
  },
  // Imperial volume
  {
    name: 'teaspoon',
    pluralName: 'teaspoons',
    abbreviation: 'tsp',
  },
  {
    name: 'tablespoon',
    pluralName: 'tablespoons',
    abbreviation: 'tbsp',
  },
  {
    name: 'cup',
    pluralName: 'cups',
    abbreviation: 'c',
    displayName: 'cup',
  },
  {
    name: 'fluid ounce',
    pluralName: 'fluid ounces',
    abbreviation: 'fl oz',
  },
  {
    name: 'pint',
    pluralName: 'pints',
    abbreviation: 'pt',
  },
  {
    name: 'quart',
    pluralName: 'quarts',
    abbreviation: 'qt',
  },
  {
    name: 'gallon',
    pluralName: 'gallons',
    abbreviation: 'gal',
  },
];
