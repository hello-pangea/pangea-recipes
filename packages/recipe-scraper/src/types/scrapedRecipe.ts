export interface ScrapedRecipe {
  name?: string;
  description?: string;
  instructions?: string[];
  ingredients?: (string | Ingredient)[];
}

export interface Ingredient {
  unit?: string;
  amount?: number;
  name: string;
}
