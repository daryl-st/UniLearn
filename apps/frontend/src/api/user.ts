import { ApiError, api } from "./client";
import type { Role } from "@unilearn/shared-types";

export interface UserRow {
    id: string;
    name: string;
    email: string;
    role: Role;
    status?: string;
    lastAccess?: string;
    avatar?: string;
}

export const UserAPI = {
    getUsers: async (): Promise<UserRow[]> => {
        try {
            return await api.get<UserRow[]>("users");
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new Error("Failed to fetch users");
        }
    },

    createUser: async (data: {
        email: string;
        name: string;
        role: Role;
        courseIds?: string[];
    }): Promise<{ user: UserRow; temporaryPassword?: string }> => {
        try {
            return await api.post<{ user: UserRow; temporaryPassword?: string }>("users", data);
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new Error("Failed to create user");
        }
    }
};
