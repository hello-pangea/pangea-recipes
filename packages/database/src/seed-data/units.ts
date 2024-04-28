import { Prisma } from '../index.js';

export const units: Prisma.UnitCreateInput[] = [
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
    name: 'fluid ounce',
    pluralName: 'fluid ounces',
    abbreviation: 'fl oz',
  },
  {
    name: 'cup',
    pluralName: 'cups',
    abbreviation: 'c',
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
    name: 'milliliter',
    pluralName: 'milliliters',
    abbreviation: 'ml',
  },
  {
    name: 'liter',
    pluralName: 'liters',
    abbreviation: 'l',
  },
  {
    name: 'deciliter',
    pluralName: 'deciliters',
    abbreviation: 'dl',
  },
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
];
