import type { Page } from 'playwright';
import playwright from 'playwright';
import type { Ingredient, ScrapedRecipe } from '../types/scrapedRecipe.js';

export abstract class BaseScraper {
  abstract hosts: string[];

  async getPage(url: string) {
    const browser = await playwright.chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url);

    return page;
  }

  async scrape(url: string): Promise<ScrapedRecipe> {
    console.log('Scraping URL: ', url);

    const page = await this.getPage(url);

    const name = await this.getName(page);
    const description = await this.getDescription(page);
    const ingredients = await this.getIngredients(page);
    const instructions = await this.getInstructions(page);

    const scrapedRecipe: ScrapedRecipe = {
      name,
      description,
      ingredients,
      instructions,
    };

    return scrapedRecipe;
  }

  async getName(_page: Page): Promise<string | undefined> {
    return Promise.resolve(undefined);
  }

  async getDescription(_page: Page): Promise<string | undefined> {
    return Promise.resolve(undefined);
  }

  async getInstructions(_page: Page): Promise<string[] | undefined> {
    return Promise.resolve(undefined);
  }

  async getIngredients(
    _page: Page,
  ): Promise<(string | Ingredient)[] | undefined> {
    return Promise.resolve(undefined);
  }
}
