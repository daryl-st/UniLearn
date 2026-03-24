export type Role = "STUDENT" | "TEACHER" | "ADMIN";

export type BackendRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
  displayName: string;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string | null;
};
