import type { Decimal } from 'decimal.js';

/**
 * Converts a non-integer number to a fraction with a denominator between 1 and 16.
 */
export function numberToFraction(value: number | string | Decimal): string {
  const valueNumber = Number(value);

  if (Number.isInteger(valueNumber)) {
    return valueNumber.toString();
  }

  const integerPart = Math.floor(valueNumber);
  const fractionalPart = valueNumber - integerPart;

  const tolerance = 1 / 16;
  let numerator = 1;
  let denominator = 1;
  let minDifference = Math.abs(fractionalPart - numerator / denominator);

  for (let denom = 2; denom <= 16; denom++) {
    const numer = Math.round(fractionalPart * denom);
    const difference = Math.abs(fractionalPart - numer / denom);
    if (difference < minDifference && difference <= tolerance) {
      numerator = numer;
      denominator = denom;
      minDifference = difference;
    }
  }

  // Simplify the fraction
  const gcd = (a: number, b: number): number => {
    if (!b) {
      return a;
    }
    return gcd(b, a % b);
  };

  const greatestCommonDivisor = gcd(numerator, denominator);
  numerator /= greatestCommonDivisor;
  denominator /= greatestCommonDivisor;

  const fractionString = `${numerator.toString()}/${denominator.toString()}`;

  if (integerPart === 0) {
    return fractionString;
  }

  return `${integerPart.toString()} ${fractionString}`;
}
