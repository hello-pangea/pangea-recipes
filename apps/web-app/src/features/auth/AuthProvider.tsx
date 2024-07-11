import {
  getSignedInUser,
  signInUser,
  signOutUser,
  type User,
} from '@open-zero/features';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface AuthContext {
  isAuthenticated: boolean;
  signIn: (data: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  user: User | null;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContext | null>(null);

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
