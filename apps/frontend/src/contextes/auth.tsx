import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { AuthSession, AuthUser } from "@/types/auth";
import * as authApi from "@/api/auth";
import {
  AuthContext,
  type AuthContextValue,
  type RegisterStudentInput,
  type SignInInput,
} from "@/contextes/auth-context";

const USER_KEY = "unilearn-auth-user";
const TOKEN_KEY = "unilearn-access-token";

function readUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function writeUser(user: AuthUser | null): void {
  if (typeof window === "undefined") return;
  if (!user) window.localStorage.removeItem(USER_KEY);
  else window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function writeToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (!token) window.localStorage.removeItem(TOKEN_KEY);
  else window.localStorage.setItem(TOKEN_KEY, token);
}

function commitSession(setUser: (u: AuthUser | null) => void, session: AuthSession): AuthUser {
  setUser(session.user);
  writeUser(session.user);
  writeToken(session.accessToken);
  return session.user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readUser());

  const signIn = useCallback(async ({ email, password }: SignInInput): Promise<AuthUser> => {
    const session = await authApi.login(email, password);
    return commitSession(setUser, session);
  }, []);

  const registerStudent = useCallback(
    async ({ fullName, email, password }: RegisterStudentInput): Promise<AuthUser> => {
      await authApi.registerStudent(fullName, email, password);
      const session = await authApi.login(email, password);
      return commitSession(setUser, session);
    },
    [],
  );

  const signOut = useCallback((): void => {
    setUser(null);
    writeUser(null);
    writeToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signIn,
      registerStudent,
      signOut,
    }),
    [registerStudent, signIn, signOut, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
