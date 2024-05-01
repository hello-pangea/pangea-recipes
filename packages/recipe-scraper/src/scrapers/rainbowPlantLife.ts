import type { Page } from 'playwright';
import { BaseScraper } from '../utils/baseScraper.js';
import { getTextArrayFromPage } from '../utils/getTextArrayFromPage.js';
import { getTextFromPage } from '../utils/getTextFromPage.js';

export class RainbowPlantLife extends BaseScraper {
  hosts = ['rainbowplantlife.com'];

  override getName(page: Page) {
    return getTextFromPage(page, '.entry-title');
  }

  override getDescription(page: Page) {
    return getTextFromPage(page, '.wprm-recipe-summary');
  }

  override getInstructions(page: Page) {
    return getTextArrayFromPage(
      page,
      '.wprm-recipe-instructions > .wprm-recipe-instruction',
    );
  }

  override async getIngredients(page: Page) {
    const locator = page.locator(
      '.wprm-recipe-ingredients > .wprm-recipe-ingredient',
    );

    const nodes = await locator.all();

    const ingredients = await Promise.all(
      nodes.map(async (node) => {
        const name = await node
          .locator('.wprm-recipe-ingredient-name')
          .first()
          .innerText();
        const unit = await node
          .locator('.wprm-recipe-ingredient-unit')
          .first()
          .innerText({
            timeout: 50,
          })
          .catch(() => undefined);
        const amount = await node
          .locator('.wprm-recipe-ingredient-amount')
          .first()
          .innerText({
            timeout: 50,
          })
          .then((text) => {
            const normalizedAmount = text.normalize('NFKD');

            if (normalizedAmount.includes('/')) {
              const split = normalizedAmount.split('/');
              if (!split[0] || !split[1]) {
                return undefined;
              }

              const convertedAmount =
                parseInt(split[0], 10) / parseInt(split[1], 10);

              return convertedAmount;
            } else if (normalizedAmount.includes('⁄')) {
              const split = normalizedAmount.split('⁄');
              if (!split[0] || !split[1]) {
                return undefined;
              }

              const convertedAmount =
                parseInt(split[0], 10) / parseInt(split[1], 10);

              return convertedAmount;
            } else {
              return text;
            }
          })
          .catch(() => undefined);

        if (!unit || !amount) return name;

        return {
          unit: unit,
          amount: Number(amount),
          name,
        };
      }),
    );

    return ingredients;
  }
}
