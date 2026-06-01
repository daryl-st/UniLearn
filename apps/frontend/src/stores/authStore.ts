import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI, type AuthUserRole } from "@/api/auth";
import { api } from "@/api/client";

export interface AuthStoreUser {
    id: string;
    email: string;
    name: string;
    role: AuthUserRole;
    mustChangePassword?: boolean;
}

function normalizeRole(r: string | undefined): AuthUserRole {
    const x = (r ?? "STUDENT").toUpperCase();
    if (x === "ADMIN" || x === "INSTRUCTOR" || x === "STUDENT") return x;
    return "STUDENT";
}

function userFromAuthResponse(u: { id: string; email: string; name: string; role: string; mustChangePassword?: boolean }): AuthStoreUser {
    return {
        id: u.id,
        email: u.email,
        name: u.name,
        role: normalizeRole(u.role),
        mustChangePassword: u.mustChangePassword,
    };
}

interface AuthState {
    user: AuthStoreUser | null;
    isLoading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<{ verificationSent: boolean; message?: string; devVerificationUrl?: string }>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    clearError: () => void;
    changePassword: (password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>() (
    persist(
        (set) => ({
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
                    if ("accessToken" in response && response.accessToken) {
                        set({ user: userFromAuthResponse(response.user), isLoading: false });
                        return { verificationSent: false };
                    }
                    if ("message" in response) {
                        set({ isLoading: false });
                        return {
                            verificationSent: true,
                            message: response.message ?? "Verification email sent. Please check your inbox.",
                            devVerificationUrl: response.devVerificationUrl,
                        };
                    }
                    set({ isLoading: false });
                    return { verificationSent: true, message: "Registration completed." };
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
            changePassword: async (password: string) => {
                set({ isLoading: true, error: null });
                try {
                    await authAPI.changePassword(password);
                    const response = await authAPI.getCurrentUser();
                    set({
                        user: userFromAuthResponse(response.user),
                        isLoading: false,
                    });
                } catch (err: any) {
                    set({
                        error: err.message || 'Failed to change password!',
                        isLoading: false,
                    });
                    throw err;
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user }),
        }
    )
);