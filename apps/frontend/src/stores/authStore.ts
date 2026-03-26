import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "@/api/auth";
import { api } from "@/api/client";

interface User {
    id: string;
    email: string;
    name: string;
} 

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
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
                    set({ user: response.user, isLoading: false });
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
                    set({ user: response.user, isLoading: false });
                } catch (err: any) {
                    set({
                        error: err.message || 'Registration Failed!',
                        isLoading: false,
                    });
                    throw err;
                }
            },

            logout: () => {
                authAPI.logout();
                set({ user: null, error: null});
            },

            checkAuth: async () => {
                const token = localStorage.getItem('auth-token');
                if (!token) {
                    set({ user: null, isLoading: false });
                    return;
                }

                try {
                    const response = await authAPI.getCurrentUser();
                    set({ user: response.user, isLoading: false });
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