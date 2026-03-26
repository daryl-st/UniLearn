// import type { AuthSession, AuthUser, BackendRole, Role } from "@/types/auth";
import { ApiError, api } from "./client";

// TODO: needs to be imported from shared types
interface LoginCredentails {
  email: string,
  password: string;
}

interface AuthResponse {
  token: string,
  user: {
    id: string,
    email: string,
    name: string,
  };
}

export const authAPI = {
  login: async (credentials: LoginCredentails) => {
    try {
      const response = await api.post<AuthResponse>('auth/login', credentials); // make it auth/login and polish everyroute to have similar structure

      // Store token and set it in the API client
      if (response.token) {
        api.setAuthToken(response.token);
        // for now let's store in local storage
        localStorage.setItem('auth_token', response.token);
      }

      return response;
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status == 401) throw new Error('Invalid email or password');
        throw err;
      }
      throw new Error('Login failed. Please try again');
    }
  },

  register: async (userData: any) => {
    try {
      const response = await api.post<AuthResponse>('auth/register', userData);

      if (response.token) {
        api.setAuthToken(response.token);
        // let's store in local storage
        localStorage.setItem('auth_token', response.token);
      }

      return response
    } catch (err) {
      throw new Error('Registration failed. Try again later.');
    }
  },

  logout: () => {
    api.setAuthToken(null);
    localStorage.removeItem('auth-token');
  },

  getCurrentUser: async () => {
    return api.get<{ user: any }>('/auth/me');
  }
}

// initialize auth state from stored token
const storedToken = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
if (storedToken) {
  api.setAuthToken(storedToken);
}


// type Json = Record<string, unknown>;

// const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "");

// class AuthError extends Error {
//   status: number;
//   constructor(message: string, status: number) {
//     super(message);
//     this.name = "AuthError";
//     this.status = status;
//   }
// }

// async function request<T>(path: string, body: Json): Promise<T> {
//   const res = await fetch(`${API_BASE_URL}${path}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", Accept: "application/json" },
//     body: JSON.stringify(body),
//     credentials: "include",
//   });

//   if (!res.ok) {
//     let msg = "Request failed";
//     try {
//       const data = (await res.json()) as { message?: unknown; error?: unknown };
//       msg = (typeof data.message === "string" && data.message.trim()) ? data.message : (typeof data.error === "string" && data.error.trim()) ? data.error : msg;
//     } catch {
//       // ignore
//     }
//     throw new AuthError(msg, res.status);
//   }

//   return (await res.json()) as T;
// }

// type BackendUser = {
//   id: string;
//   email: string;
//   role?: string;
//   firstName?: string | null;
//   lastName?: string | null;
//   username?: string | null;
// };

// type LoginResponse = {
//   user: BackendUser;
//   accessToken: string;
// };

// const normalizeRole = (role: string | undefined): Role => {
//   const normalized = (role ?? "").toUpperCase() as BackendRole;
//   if (normalized === "INSTRUCTOR") return "TEACHER";
//   if (normalized === "ADMIN") return "ADMIN";
//   return "STUDENT";
// };

// const displayNameFor = (u: Pick<BackendUser, "firstName" | "lastName" | "username" | "email">): string => {
//   const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
//   if (fullName) return fullName;
//   if (u.username && u.username.trim()) return u.username.trim();
//   return u.email.split("@")[0] || "User";
// };

// const toAuthUser = (u: BackendUser): AuthUser => ({
//   id: u.id,
//   email: u.email,
//   role: normalizeRole(u.role),
//   displayName: displayNameFor(u),
// });

// const splitFullName = (fullName: string): { firstName: string; lastName: string } => {
//   const trimmed = fullName.trim();
//   if (!trimmed) return { firstName: "Student", lastName: "User" };
//   const parts = trimmed.split(/\s+/);
//   if (parts.length === 1) return { firstName: parts[0], lastName: "User" };
//   return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
// };

// export async function login(email: string, password: string): Promise<AuthSession> {
//   const payload = await request<LoginResponse>("/auth/login", { email: email.trim(), password });
//   return { user: toAuthUser(payload.user), accessToken: payload.accessToken ?? null };
// }

// export async function registerStudent(fullName: string, email: string, password: string): Promise<void> {
//   const { firstName, lastName } = splitFullName(fullName);
//   const username = email.split("@")[0] || `${firstName}.${lastName}`.toLowerCase();

//   await request("/auth/register", {
//     email: email.trim(),
//     password,
//     role: "STUDENT",
//     firstName,
//     lastName,
//     username,
//   });
// }

