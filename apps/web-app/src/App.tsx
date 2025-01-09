import { RouterProvider } from '@tanstack/react-router';
import { router } from './main';

export function App() {
  return <RouterProvider router={router} defaultPreload="intent" />;
}
