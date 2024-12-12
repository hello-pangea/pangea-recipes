/**
 * Converts any string that is empty or only spaces to `null`, otherwise returns the string
 */
export function emptyStringToNull(
  value: string | undefined | null,
): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue === '' ? null : trimmedValue;
}

/**
 * Converts any string that is empty or only spaces to `undefined`, otherwise returns the string
 */
export function emptyStringToUndefined(
  value: string | undefined | null,
): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue === '' ? undefined : trimmedValue;
}
