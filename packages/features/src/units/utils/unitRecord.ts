import type { Unit } from '../types/unit.js';

export interface UnitDetails {
  name: string;
  pluralName: string;
}

export const unitRecord: Record<Unit, UnitDetails> = {
  gram: {
    name: 'gram',
    pluralName: 'grams',
  },
  kilogram: {
    name: 'kilogram',
    pluralName: 'kilograms',
  },
  ounce: {
    name: 'ounce',
    pluralName: 'ounces',
  },
  pound: {
    name: 'pound',
    pluralName: 'pounds',
  },
  teaspoon: {
    name: 'teaspoon',
    pluralName: 'teaspoons',
  },
  tablespoon: {
    name: 'tablespoon',
    pluralName: 'tablespoons',
  },
  cup: {
    name: 'cup',
    pluralName: 'cups',
  },
  fluidOunce: {
    name: 'fluid ounce',
    pluralName: 'fluid ounces',
  },
  mililiter: {
    name: 'mililiter',
    pluralName: 'mililiters',
  },
  centiliter: {
    name: 'centiliter',
    pluralName: 'centiliters',
  },
  deciliter: {
    name: 'deciliter',
    pluralName: 'deciliters',
  },
  liter: {
    name: 'liter',
    pluralName: 'liters',
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
