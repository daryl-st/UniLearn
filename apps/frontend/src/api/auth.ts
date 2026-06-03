import { ApiError, api } from "./client";

interface LoginCredentials {
    email: string;
    password: string;
}

export type AuthUserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: AuthUserRole;
    mustChangePassword?: boolean;
}

interface LoginAuthResponse {
    accessToken: string;
    user: AuthUser;
}

interface RegisterAuthResponse {
    message: string;
    accessToken: string;
    user: AuthUser;
}

function validationMessageFromApi(err: ApiError): string {
    const data = err.data as { details?: { message?: string }[]; message?: string } | undefined;
    const detail = data?.details?.[0]?.message;
    if (detail) return detail;
    if (data?.message) return data.message;
    return err.message;
}

export const authAPI = {
    login: async (credentials: LoginCredentials) => {
        try {
            const response = await api.post<LoginAuthResponse>("auth/login", credentials, {
                skipAuthRefresh: true,
            });

            if (response.accessToken) {
                api.setAuthToken(response.accessToken);
                localStorage.setItem("auth-token", response.accessToken);
            }

            return response;
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status === 401) throw new Error("Invalid email or password");
                throw err;
            }
            throw new Error("Login failed. Please try again");
        }
    },

    register: async (userData: unknown): Promise<RegisterAuthResponse> => {
        try {
            const response = await api.post<RegisterAuthResponse>("auth/register", userData, {
                skipAuthRefresh: true,
            });

            if (response.accessToken) {
                api.setAuthToken(response.accessToken);
                localStorage.setItem("auth-token", response.accessToken);
            }

            return response;
        } catch (err) {
            if (err instanceof ApiError) {
                throw new Error(validationMessageFromApi(err));
            }
            throw new Error("Registration failed. Try again later.");
        }
    },

    refresh: () => api.refreshSession(),

    logout: async () => {
        try {
            await api.post<undefined>("auth/logout", undefined, { skipAuthRefresh: true });
        } finally {
            api.setAuthToken(null);
            localStorage.removeItem("auth-token");
        }
    },

    getCurrentUser: async () => {
        return api.get<{ user: AuthUser }>("auth/me");
    },

    changePassword: async (password: string): Promise<{ message: string }> => {
        try {
            return await api.post<{ message: string }>("auth/change-password", { password });
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new Error("Failed to change password");
        }
    },
};

const storedToken = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;
if (storedToken) {
    api.setAuthToken(storedToken);
}
