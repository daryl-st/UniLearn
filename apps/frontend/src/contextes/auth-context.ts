import { createContext } from "react";
import type { AuthUser } from "@/types/auth";

export type SignInInput = { email: string; password: string };
export type RegisterStudentInput = { fullName: string; email: string; password: string };

export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (input: SignInInput) => Promise<AuthUser>;
  registerStudent: (input: RegisterStudentInput) => Promise<AuthUser>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

