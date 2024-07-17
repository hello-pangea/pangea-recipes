import type { Prisma } from '@prisma/client';

export function numberToFraction(
  value: number | string | Prisma.Decimal,
): string {
  const valueNumber = Number(value);

  if (Number.isInteger(valueNumber)) {
    return valueNumber.toString();
  }

  const tolerance = 1 / 16;
  let numerator = 1;
  let denominator = 1;
  let minDifference = Math.abs(valueNumber - numerator / denominator);

  for (let denom = 2; denom <= 16; denom++) {
    const numer = Math.round(valueNumber * denom);
    const difference = Math.abs(valueNumber - numer / denom);
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

  return `${numerator.toString()}/${denominator.toString()}`;
}
