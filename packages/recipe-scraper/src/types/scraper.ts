import { type Page } from 'playwright';

export interface Scraper {
  hosts: string[];
  scrape: (page: Page) => Promise<{
    name: string;
    description: string;
    ingredients: (
      | string
      | {
          unit: string;
          amount: number;
          name: string;
        }
    )[];
    instructions: string[];
  }>;
}
