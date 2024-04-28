import type { Prisma } from '@prisma/client';

function gcd(a: number, b: number): number {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
}

export function numberToFraction(
  value: number | string | Prisma.Decimal,
): string {
  let valueNumber = Number(value);

  if (Number.isInteger(valueNumber)) {
    return valueNumber.toString();
  }

  const tolerance = 0.0001;
  let denominator = 1;

  while (Math.abs(valueNumber - Math.round(valueNumber)) > tolerance) {
    valueNumber *= 2;
    denominator *= 2;
  }

  const numerator = Math.round(valueNumber);
  const divisor = gcd(numerator, denominator);

  return `${String(numerator / divisor)}/${String(denominator / divisor)}`;
}
