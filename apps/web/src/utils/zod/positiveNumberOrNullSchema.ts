import { z } from 'zod/v4';

// ".5" or "12" etc.
const numericString = /^(?:\d*\.\d+|\d+)$/;

// "3/4", "10/2"
const fractionString = /^\d+\/\d+$/;

/**
 * positiveNumberOrNullSchema
 *
 * Accepts  : string | number | null
 * Resolves : number | null
 *
 *   null / "" / "   "     → null
 *   ".5" / "1/2" / 7      → positive number
 *   negatives / 0 / junk  → ZodError "Must be a positive number"
 */
export const positiveNumberOrNullSchema = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((value, ctx) => {
    /* Null passes straight through */
    if (value === null || value === undefined) {
      return null;
    }

    /* Numbers: enforce positivity */
    if (typeof value === 'number') {
      if (value > 0) {
        return value;
      }
      ctx.addIssue({ code: 'custom', message: 'Must be a positive number' });
      return z.NEVER;
    }

    /* Strings: trim then analyse */
    const str = value.trim();
    if (str === '') {
      return null;
    }

    /* Integer / decimal */
    if (numericString.test(str)) {
      const num = Number(str);
      if (num > 0) {
        return num;
      }
    }

    /* Fraction */
    if (fractionString.test(str)) {
      const [numStr, denStr] = str.split('/');
      const num = Number(numStr);
      const den = Number(denStr);
      if (den !== 0) {
        const result = num / den;
        if (result > 0) {
          return result;
        }
      }
    }

    /* Anything else (or <= 0) is invalid */
    ctx.addIssue({ code: 'custom', message: 'Must be a positive number' });
    return z.NEVER;
  })
  .nullable();
