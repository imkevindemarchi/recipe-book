// Pages
import {
    AdminDashboard,
    AdminCategories,
    AdminCateogory,
    AdminRecipes,
    AdminRecipe,
    AdminIngredients,
    AdminIngredient,
} from "./pages/admin";
import {
    LogIn,
    StyleGuide,
    Home,
    Recipes,
    Category,
    Recipe,
    Favourites,
} from "./pages";

export const ROUTES = [
    { path: "/", name: "Home", isHidden: true, element: <Home /> },
    { path: "/recipes", name: "Ricette", element: <Recipes /> },
    { path: "/favourites", name: "Preferiti", element: <Favourites /> },
    { path: "/categories/:id", isHidden: true, element: <Category /> },
    { path: "/recipes/:id", isHidden: true, element: <Recipe /> },
    {
        path: "/style-guide",
        name: "Style Guide",
        isHidden: true,
        element: <StyleGuide />,
    },
    { path: "/log-in", name: "Log In", isHidden: true, element: <LogIn /> },
];

export const ADMIN_ROUTES = [
    {
        path: "/admin",
        name: "Dashboard",
        isHidden: true,
        element: <AdminDashboard />,
    },
    {
        path: "/admin/categories",
        name: "Categorie",
        element: <AdminCategories />,
    },
    {
        path: "/admin/categories/new",
        element: <AdminCateogory />,
        isHidden: true,
    },
    {
        path: "/admin/categories/:id",
        element: <AdminCateogory />,
        isHidden: true,
    },
    {
        path: "/admin/ingredients",
        name: "Ingredienti",
        element: <AdminIngredients />,
    },
    {
        path: "/admin/ingredients/new",
        element: <AdminIngredient />,
        isHidden: true,
    },
    {
        path: "/admin/ingredients/:id",
        element: <AdminIngredient />,
        isHidden: true,
    },
    {
        path: "/admin/recipes",
        name: "Ricette",
        element: <AdminRecipes />,
    },
    {
        path: "/admin/recipes/new",
        element: <AdminRecipe />,
        isHidden: true,
    },
    {
        path: "/admin/recipes/:id",
        element: <AdminRecipe />,
        isHidden: true,
    },
];
