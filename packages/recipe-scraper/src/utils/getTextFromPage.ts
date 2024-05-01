import type { Page } from 'playwright';

export function getTextFromPage(page: Page, selector: string) {
  const locator = page.locator(selector);

  const node = locator.first();

  return node.innerText();
}
