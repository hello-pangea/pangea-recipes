/** Returns true if string is null, undefined, or only whitespace */
export function isBlank(string?: string | null) {
  return !string || /^\s*$/.test(string);
}
