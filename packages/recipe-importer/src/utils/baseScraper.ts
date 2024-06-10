import type { ImportedIngredient, ImportedRecipe } from '@open-zero/features';
import type { Page } from 'playwright';
import playwright from 'playwright';

export abstract class BaseScraper {
  abstract hosts: string[];

  async getPage(url: string) {
    const browser = await playwright.chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url);

    return page;
  }

  async scrape(url: string): Promise<ImportedRecipe> {
    console.log('Scraping url: ', url);

    const page = await this.getPage(url);

    const name = await this.getName(page);
    const description = await this.getDescription(page);
    const ingredients = await this.getIngredients(page);
    const instructionGroups = await this.getInstructionGroups(page);

    const scrapedRecipe: ImportedRecipe = {
      name,
      description,
      ingredients,
      instructionGroups,
    };

    return scrapedRecipe;
  }

  async getName(_page: Page): Promise<string | undefined> {
    return Promise.resolve(undefined);
  }

  async getDescription(_page: Page): Promise<string | undefined> {
    return Promise.resolve(undefined);
  }

  async getInstructionGroups(_page: Page): Promise<
    | {
        title: string | undefined;
        instructions: string[];
      }[]
    | undefined
  > {
    return Promise.resolve(undefined);
  }

  async getIngredients(_page: Page): Promise<ImportedIngredient[] | undefined> {
    return Promise.resolve(undefined);
  }
}
