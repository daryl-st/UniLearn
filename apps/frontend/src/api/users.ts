import { api, ApiError } from "./client";

export type SafeUserRow = {
    id: string;
    name: string;
    email: string;
    role: string;
    isVerified?: boolean;
    mustChangePassword?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type CreateUserResponse = {
    user: SafeUserRow;
    temporaryPassword: string;
};

export const UsersAPI = {
    list: async () => {
        try {
            const response = await api.get<SafeUserRow[]>("users");
            if (!Array.isArray(response)) {
                throw new Error("Invalid response format!");
            }
            return response;
        } catch (err) {
            if (err instanceof ApiError) throw err;
            throw new Error("Fetching users failed!");
        }
    },

    create: async (body: {
        name: string;
        email: string;
        role: "INSTRUCTOR" | "STUDENT";
        courseIds?: string[];
    }) => {
        try {
            return await api.post<CreateUserResponse>("users", body);
        } catch (err) {
            if (err instanceof ApiError) throw err;
            throw new Error("Creating user failed!");
        }
    },

    update: async (id: string, body: {
        name: string;
        email: string;
        role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
    }) => {
        try {
            const response = await api.put<{ user: SafeUserRow }>(`users/${id}`, body);
            return response.user;
        } catch (err) {
            if (err instanceof ApiError) throw err;
            throw new Error("Updating user failed!");
        }
    },

    remove: async (id: string) => {
        try {
            await api.delete<void>(`users/${id}`);
        } catch (err) {
            if (err instanceof ApiError) throw err;
            throw new Error("Deleting user failed!");
        }
    },
};
