// Types
import { TCategory } from "./category.type";
import { TIngredient } from "./ingredient.type";

export type TRecipe = {
  id: string | null;
  name: string;
  time: string;
  isFavourite: boolean;
  people: number;
  createdDate: Date;
  category: TCategory;
  procedure: string[] | null;
  ingredients: TIngredient[] | null;
};
