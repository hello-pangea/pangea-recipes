import { Type, type StaticDecode, type TObject } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

// GitHub issue describing .env parsing with TypeBox
// https://github.com/sinclairzx81/typebox/issues/626#issuecomment-1760933435

export function parseEnv<T extends TObject>(
  schema: T,
  value: unknown,
): StaticDecode<T> {
  // check value is valid, throw if invalid
  if (!Value.Check(schema, value)) {
    console.error(
      `\nError parsing environment variables\nCheck your .env file\n`,
    );

    const errors = [...Value.Errors(schema, value)].map((e) => ({
      path: e.path,
      message: e.message,
      value: e.value,
    }));

    console.error(...errors);

    console.log('\n\n');

    // exit the process
    throw new Error('Invalid environment variables');
  }

  // cast value in to mapped schematic, optionally remove additional properties.
  const casted = Value.Cast({ ...schema, additionalProperties: false }, value);

  // run the decode on the casted value
  return Value.Decode(schema, casted);
}

export const NumericString = Type.Transform(
  Type.String({
    pattern: '^[+-]?([0-9]*[.])?[0-9]+$' /* ensure numeric string */,
  }),
)
  .Decode((value) => parseFloat(value))
  .Encode((value) => value.toString());
