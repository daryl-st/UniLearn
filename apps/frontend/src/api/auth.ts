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
    email?: string;
    devVerificationUrl?: string;
}

interface RegisterCompleteAuthResponse {
    accessToken: string;
    user: AuthUser;
    userProfile: unknown;
}

export type RegisterResponse = RegisterAuthResponse | RegisterCompleteAuthResponse;

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
                if (err.status === 403) throw new Error(err.message || "Please verify your email before logging in.");
                throw err;
            }
            throw new Error("Login failed. Please try again");
        }
    },

    register: async (userData: unknown): Promise<RegisterResponse> => {
        try {
            const response = await api.post<RegisterResponse>("auth/register", userData, {
                skipAuthRefresh: true,
            });

            if ("accessToken" in response && response.accessToken) {
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

    verifyEmail: async (token: string): Promise<{ message: string }> => {
        try {
            return await api.get<{ message: string }>("auth/verify-email", {
                params: { token },
                skipAuthRefresh: true,
            });
        } catch (err) {
            if (err instanceof ApiError) {
                throw new Error(err.message);
            }
            throw new Error("Email verification failed.");
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

    forgotPassword: async (email: string): Promise<{ message: string }> => {
        try {
            return await api.post<{ message: string }>("auth/forgot-password", { email }, { skipAuthRefresh: true });
        } catch (err) {
            if (err instanceof ApiError) {
                throw new Error(err.message || "Failed to send reset link");
            }
            throw new Error("Failed to send reset link");
        }
    },

    resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
        try {
            return await api.post<{ message: string }>("auth/reset-password", { token, password }, { skipAuthRefresh: true });
        } catch (err) {
            if (err instanceof ApiError) {
                throw new Error(err.message || "Failed to reset password");
            }
            throw new Error("Failed to reset password");
        }
    },
};

const storedToken = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;
if (storedToken) {
    api.setAuthToken(storedToken);
}
