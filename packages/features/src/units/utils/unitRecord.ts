import type { Unit } from '../types/unit.js';

export interface UnitDetails {
  name: string;
  pluralName: string;
  abbreviation?: string;
  displayName?: string;
}

export const unitRecord: Record<Exclude<Unit, null>, UnitDetails> = {
  // Metric weight
  milligram: {
    name: 'milligram',
    pluralName: 'milligrams',
    abbreviation: 'mg',
  },
  gram: {
    name: 'gram',
    pluralName: 'grams',
    abbreviation: 'g',
  },
  kilogram: {
    name: 'kilogram',
    pluralName: 'kilograms',
    abbreviation: 'kg',
  },
  // Imperial weight
  ounce: {
    name: 'ounce',
    pluralName: 'ounces',
    abbreviation: 'oz',
  },
  pound: {
    name: 'pound',
    pluralName: 'pounds',
    abbreviation: 'lb',
  },
  // Metric volume
  mililiter: {
    name: 'mililiter',
    pluralName: 'mililiters',
    abbreviation: 'ml',
  },
  centiliter: {
    name: 'centiliter',
    pluralName: 'centiliters',
    abbreviation: 'cl',
  },
  deciliter: {
    name: 'deciliter',
    pluralName: 'deciliters',
    abbreviation: 'dl',
  },
  liter: {
    name: 'liter',
    pluralName: 'liters',
    abbreviation: 'l',
  },
  // Imperial volume
  teaspoon: {
    name: 'teaspoon',
    pluralName: 'teaspoons',
    abbreviation: 'tsp',
  },
  tablespoon: {
    name: 'tablespoon',
    pluralName: 'tablespoons',
    abbreviation: 'tbsp',
  },
  cup: {
    name: 'cup',
    pluralName: 'cups',
    abbreviation: 'c',
    displayName: 'cup',
  },
  fluidOunce: {
    name: 'fluid ounce',
    pluralName: 'fluid ounces',
    abbreviation: 'fl oz',
  },
  pint: {
    name: 'pint',
    pluralName: 'pints',
    abbreviation: 'pt',
  },
  quart: {
    name: 'quart',
    pluralName: 'quarts',
    abbreviation: 'qt',
  },
  gallon: {
    name: 'gallon',
    pluralName: 'gallons',
    abbreviation: 'gal',
  },
  // Misc
  whole: {
    name: 'whole',
    pluralName: 'whole',
  },
  slice: {
    name: 'slice',
    pluralName: 'slices',
  },
  piece: {
    name: 'piece',
    pluralName: 'pieces',
  },
  clove: {
    name: 'clove',
    pluralName: 'cloves',
  },
  stick: {
    name: 'stick',
    pluralName: 'sticks',
  },
  drop: {
    name: 'drop',
    pluralName: 'drops',
  },
  dash: {
    name: 'dash',
    pluralName: 'dashes',
  },
  bottle: {
    name: 'bottle',
    pluralName: 'bottles',
  },
  can: {
    name: 'can',
    pluralName: 'cans',
  },
  packet: {
    name: 'packet',
    pluralName: 'packets',
  },
  pinch: {
    name: 'pinch',
    pluralName: 'pinches',
  },
  bunch: {
    name: 'bunch',
    pluralName: 'bunches',
  },
};

export const units = Object.keys(unitRecord) as Unit[];
