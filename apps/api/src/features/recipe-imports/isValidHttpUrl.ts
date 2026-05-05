export function isValidHttpUrl(urlString: string) {
  let url;

  try {
    url = new URL(urlString);
    // oxlint-disable-next-line no-unused-vars
  } catch (_error) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}
