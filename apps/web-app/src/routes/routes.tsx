import { AccountPage } from '#src/features/account/AccountPage';
import { RegisterPage } from '#src/features/auth/RegisterPage';
import { SignInPage } from '#src/features/auth/SignInPage';
import { IngredientsPage } from '#src/features/ingredients/IngredientsPage';
import { NewIngredientPage } from '#src/features/ingredients/NewIngredientPage';
import { Layout } from '#src/features/layout/Layout';
import { RecipeBooksPage } from '#src/features/recipe-books/RecipeBooksPage';
import { RecipeCreatePage } from '#src/features/recipes/RecipeCreatePage';
import { RecipeEditPage } from '#src/features/recipes/RecipeEditPage';
import { RecipePage } from '#src/features/recipes/RecipePage';
import { RecipesPage } from '#src/features/recipes/RecipesPage';
import { Navigate, createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/sign-up',
    element: <RegisterPage />,
  },
  {
    path: '/sign-in',
    element: <SignInPage />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/recipes" />,
      },
      {
        path: '/recipes',
        element: <RecipesPage />,
      },
      {
        path: '/recipes/new',
        element: <RecipeCreatePage />,
      },
      {
        path: '/recipes/:recipeId',
        element: <RecipePage />,
      },
      {
        path: '/recipes/:recipeId/edit',
        element: <RecipeEditPage />,
      },
      {
        path: '/ingredients',
        element: <IngredientsPage />,
      },
      {
        path: '/ingredients/new',
        element: <NewIngredientPage />,
      },
      {
        path: '/recipe-books',
        element: <RecipeBooksPage />,
      },
      {
        path: '/account',
        element: <AccountPage />,
      },
    ],
  },
]);
