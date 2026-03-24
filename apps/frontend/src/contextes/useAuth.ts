import { useContext } from "react";
import { AuthContext } from "@/contextes/auth-context";
import type { AuthContextValue } from "@/contextes/auth-context";

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

