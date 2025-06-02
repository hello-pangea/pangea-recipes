import { positiveNumberOrNullSchema } from '#src/utils/zod/positiveNumberOrNullSchema';
import { z } from 'zod/v4';

/**
 * Input can be a string representing a number or a fraction in the form of '1/2'.
 */
export function getNumberFromInput(
  input: string | number | null | undefined,
): number | null {
  const zodRes = z.safeParse(positiveNumberOrNullSchema, input);

  if (!zodRes.success) {
    return null;
  }

  return zodRes.data;
}
