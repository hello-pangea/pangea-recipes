/**
 * Input can be a string representing a number or a fraction in the form of '1/2'.
 */
export function getNumberFromInput(
  input: string | number | null | undefined,
): number | null {
  if (input === null) {
    return null;
  }

  if (typeof input === 'number' || input === undefined) {
    return input ?? null;
  }

  const inputWithNoWhitespace = input.replace(/\s/g, '');

  if (inputWithNoWhitespace === '') {
    return null;
  }

  if (inputWithNoWhitespace.includes('/')) {
    const fraction = input.split('/');
    const numerator = fraction.at(0);
    const denominator = fraction.at(1);
    if (fraction.length === 2 && numerator && denominator) {
      return parseFloat(numerator) / parseFloat(denominator);
    } else {
      return null;
    }
  }

  return parseFloat(input);
}
