import { Type, type Static } from '@sinclair/typebox';

export type Unit = Static<typeof unitSchema>;
export const unitSchema = Type.Union([
  Type.Null(),
  // Metric weight
  Type.Literal('milligram'),
  Type.Literal('gram'),
  Type.Literal('kilogram'),
  // Imperial weight
  Type.Literal('ounce'),
  Type.Literal('pound'),
  // Metric volume
  Type.Literal('mililiter'),
  Type.Literal('centiliter'),
  Type.Literal('deciliter'),
  Type.Literal('liter'),
  // Imperial volume
  Type.Literal('teaspoon'),
  Type.Literal('tablespoon'),
  Type.Literal('cup'),
  Type.Literal('fluidOunce'),
  Type.Literal('pint'),
  Type.Literal('quart'),
  Type.Literal('gallon'),
  // Misc
  Type.Literal('slice'),
  Type.Literal('piece'),
  Type.Literal('clove'),
  Type.Literal('stick'),
  Type.Literal('drop'),
  Type.Literal('dash'),
  Type.Literal('whole'),
  Type.Literal('bottle'),
  Type.Literal('can'),
  Type.Literal('packet'),
  Type.Literal('pinch'),
  Type.Literal('bunch'),
]);
