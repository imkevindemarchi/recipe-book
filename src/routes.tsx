import { ReactNode } from "react";

// Pages
import { Home, Login, NotFound, Recipe, Recipes, Saved } from "./pages";
import {
  AdminCategories,
  AdminCategory,
  AdminDashboard,
  AdminIngredient,
  AdminIngredients,
  AdminRecipe,
  AdminRecipes,
} from "./pages/admin";

export type TRoute = {
  path: string;
  name: string;
  element: ReactNode;
  isHidden?: boolean;
};

export const ROUTES: TRoute[] = [
  {
    path: "/log-in",
    name: "login",
    element: <Login />,
    isHidden: true,
  },
  {
    path: "*",
    name: "not-found",
    element: <NotFound />,
    isHidden: true,
  },
  {
    path: "/",
    name: "home",
    element: <Home />,
    isHidden: true,
  },
  {
    path: "/categories/:categoryId",
    name: "categories",
    element: <></>,
    isHidden: true,
  },
  {
    path: "/recipes",
    name: "recipes",
    element: <Recipes />,
  },
  {
    path: "/saved",
    name: "saved",
    element: <Saved />,
  },
  {
    path: "/recipes/:recipeId",
    name: "recipes",
    element: <Recipe />,
    isHidden: true,
  },
];

export const ADMIN_ROUTES: TRoute[] = [
  {
    path: "/admin",
    name: "dashboard",
    element: <AdminDashboard />,
    isHidden: true,
  },
  {
    path: "/admin/recipes",
    name: "recipes",
    element: <AdminRecipes />,
  },
  {
    path: "/admin/recipes/new",
    name: "recipes",
    element: <AdminRecipe />,
    isHidden: true,
  },
  {
    path: "/admin/recipes/edit/:recipeId",
    name: "recipes",
    element: <AdminRecipe />,
    isHidden: true,
  },
  {
    path: "/admin/ingredients",
    name: "ingredients",
    element: <AdminIngredients />,
  },
  {
    path: "/admin/ingredients/new",
    name: "ingredient",
    element: <AdminIngredient />,
    isHidden: true,
  },
  {
    path: "/admin/ingredients/edit/:ingredientId",
    name: "ingredient",
    element: <AdminIngredient />,
    isHidden: true,
  },
  {
    path: "/admin/categories",
    name: "categories",
    element: <AdminCategories />,
  },
  {
    path: "/admin/categories/new",
    name: "category",
    element: <AdminCategory />,
    isHidden: true,
  },
  {
    path: "/admin/categories/edit/:categoryId",
    name: "category",
    element: <AdminCategory />,
    isHidden: true,
  },
];
