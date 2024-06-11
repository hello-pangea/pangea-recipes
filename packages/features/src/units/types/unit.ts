import { Type, type Static } from '@sinclair/typebox';

export type Unit = Static<typeof unitSchema>;
export const unitSchema = Type.Union([
  Type.Literal('gram'),
  Type.Literal('kilogram'),
  Type.Literal('ounce'),
  Type.Literal('pound'),
  Type.Literal('teaspoon'),
  Type.Literal('tablespoon'),
  Type.Literal('cup'),
  Type.Literal('fluidOunce'),
  Type.Literal('mililiter'),
  Type.Literal('centiliter'),
  Type.Literal('deciliter'),
  Type.Literal('liter'),
  Type.Literal('bottle'),
  Type.Literal('can'),
  Type.Literal('packet'),
  Type.Literal('pinch'),
  Type.Literal('bunch'),
]);
