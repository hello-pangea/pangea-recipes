import { AccountPage } from '#src/features/account/AccountPage';
import { LogInPage } from '#src/features/auth/LogInPage';
import { SignUpPage } from '#src/features/auth/SignUpPage';
import { FoodsPage } from '#src/features/foods/FoodsPage';
import { NewFoodPage } from '#src/features/foods/NewFoodPage';
import { Layout } from '#src/features/layout/Layout';
import { RecipeBooksPage } from '#src/features/recipe-books/RecipeBooksPage';
import { CreateRecipePage } from '#src/features/recipes/CreateRecipePage';
import { EditRecipePage } from '#src/features/recipes/EditRecipePage';
import { RecipePage } from '#src/features/recipes/RecipePage';
import { RecipesPage } from '#src/features/recipes/RecipesPage';
import { Navigate, createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/sign-up',
    element: <SignUpPage />,
  },
  {
    path: '/log-in',
    element: <LogInPage />,
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
        element: <CreateRecipePage />,
      },
      {
        path: '/recipes/:recipeId',
        element: <RecipePage />,
      },
      {
        path: '/recipes/:recipeId/edit',
        element: <EditRecipePage />,
      },
      {
        path: '/foods',
        element: <FoodsPage />,
      },
      {
        path: '/foods/new',
        element: <NewFoodPage />,
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
