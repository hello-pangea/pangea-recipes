import type { User } from '@open-zero/features/users';
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

/**
 * Throws an error if used in an unauthenticated route
 * Guarentees the user is authenticated
 */
export function useAuthRequired() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  if (!context.user) {
    throw new Error(
      'useAuth must be used where a user is guarenteed to be authenticated',
    );
  }

  return context as AuthContext & { user: User };
}
