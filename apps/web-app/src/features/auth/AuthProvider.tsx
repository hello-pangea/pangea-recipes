import {
  getSignedInUser,
  signInUser,
  signOutUser,
  type User,
} from '@open-zero/features';
import { createContext, useCallback, useEffect, useState } from 'react';

export interface AuthContext {
  isAuthenticated: boolean;
  signIn: (data: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  user: User | null;
  isLoaded: boolean;
}

export const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const isAuthenticated = !!user;

  const signOut = useCallback(async () => {
    await signOutUser();

    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  const signIn = useCallback(
    async (data: { email: string; password: string }) => {
      await signInUser(data).then((res) => {
        setUser(res.user);
      });
    },
    [],
  );

  useEffect(() => {
    getSignedInUser()
      .then((res) => {
        setUser(res.user);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        signIn,
        signOut,
        isLoaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
