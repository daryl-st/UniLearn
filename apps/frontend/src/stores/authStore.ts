import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI, type AuthUserRole } from "@/api/auth";
import { api } from "@/api/client";

export interface AuthStoreUser {
    id: string;
    email: string;
    name: string;
    role: AuthUserRole;
}

function normalizeRole(r: string | undefined): AuthUserRole {
    const x = (r ?? "STUDENT").toUpperCase();
    if (x === "ADMIN" || x === "INSTRUCTOR" || x === "STUDENT") return x;
    return "STUDENT";
}

function userFromAuthResponse(u: { id: string; email: string; name: string; role: string }): AuthStoreUser {
    return {
        id: u.id,
        email: u.email,
        name: u.name,
        role: normalizeRole(u.role),
    };
}

interface AuthState {
    user: AuthStoreUser | null;
    isLoading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>() (
    persist(
        (set, get) => ({
            user: null,
            isLoading: true,
            error: null,

            // TODO: proper error handling -- partially done
            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authAPI.login({ email, password });
                    set({ user: userFromAuthResponse(response.user), isLoading: false });
                } catch (err: any) {
                    set({
                        error: err.message || 'Login Failed!',
                        isLoading: false,
                    });
                    throw err;
                }
            },

            // TODO: proper error handling -- partially done
            register: async (userData: any) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authAPI.register(userData);
                    set({ user: userFromAuthResponse(response.user), isLoading: false });
                } catch (err: any) {
                    set({
                        error: err.message || 'Registration Failed!',
                        isLoading: false,
                    });
                    throw err;
                }
            },

            logout: async () => {
                await authAPI.logout();
                set({ user: null, error: null });
            },

            checkAuth: async () => {
                const token = localStorage.getItem('auth-token');
                if (!token) {
                    set({ user: null, isLoading: false });
                    return;
                }

                try {
                    const response = await authAPI.getCurrentUser();
                    const u = response.user;
                    set({ user: userFromAuthResponse(u), isLoading: false });
                } catch (err) {
                    localStorage.removeItem('auth-token');
                    api.setAuthToken(null);
                    set({ user: null, isLoading: false });
                }
            },
            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user }),
        }
    )
);