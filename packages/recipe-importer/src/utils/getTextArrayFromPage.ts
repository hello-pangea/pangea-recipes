import type { Page } from 'playwright-chromium';

export async function getTextArrayFromPage(page: Page, selector: string) {
  const locator = page.locator(selector);

  const nodes = await locator.all();

  const instructions = await Promise.all(
    nodes.map((node) => {
      return node.innerText();
    }),
  );

  return instructions;
}
