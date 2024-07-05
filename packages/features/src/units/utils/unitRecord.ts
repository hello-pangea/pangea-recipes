import type { Unit } from '../types/unit.js';

export interface UnitDetails {
  name: string;
  pluralName: string;
  abbreviation?: string;
}

export const unitRecord: Record<Unit, UnitDetails> = {
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
  },
  fluidOunce: {
    name: 'fluid ounce',
    pluralName: 'fluid ounces',
    abbreviation: 'fl oz',
  },
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
