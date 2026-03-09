import { createContext, useMemo, useState, type ReactNode } from "react";
import type { AuthSession, AuthUser } from "@/auth/types";
import { authApi } from "@/auth/api";

type SignInInput = {
  email: string;
  password: string;
};

type RegisterStudentInput = {
  fullName: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (input: SignInInput) => Promise<AuthUser>;
  registerStudent: (input: RegisterStudentInput) => Promise<AuthUser>;
  signOut: () => void;
};

const STORAGE_KEY = "unilearn-auth-user";
const TOKEN_STORAGE_KEY = "unilearn-access-token";

const readStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

const saveStoredUser = (user: AuthUser | null): void => {
  if (typeof window === "undefined") {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

const saveStoredToken = (token: string | null): void => {
  if (typeof window === "undefined") {
    return;
  }

  if (!token) {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  const commitSession = (session: AuthSession): AuthUser => {
    setUser(session.user);
    saveStoredUser(session.user);
    saveStoredToken(session.accessToken);
    return session.user;
  };

  const signIn = async ({ email, password }: SignInInput): Promise<AuthUser> => {
    const session = await authApi.login({ email, password });

    return commitSession(session);
  };

  const registerStudent = async ({ fullName, email, password }: RegisterStudentInput): Promise<AuthUser> => {
    await authApi.registerStudent({ fullName, email, password });
    const session = await authApi.login({ email, password });

    return commitSession(session);
  };

  const signOut = (): void => {
    setUser(null);
    saveStoredUser(null);
    saveStoredToken(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signIn,
      registerStudent,
      signOut,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
