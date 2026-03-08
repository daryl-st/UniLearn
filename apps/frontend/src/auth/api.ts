import type { AuthSession, AuthUser, BackendRole, Role } from "@/auth/types";

type LoginInput = {
  email: string;
  password: string;
};

type RegisterStudentInput = {
  fullName: string;
  email: string;
  password: string;
};

type LoginResponse = {
  user?: {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    role?: string;
  };
  accessToken?: string;
  message?: string;
};

type RegisterResponse = {
  user?: {
    id?: string;
  };
  message?: string;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "");

export class AuthApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

const normalizeRole = (role: string | undefined): Role => {
  const normalized = (role ?? "").toUpperCase() as BackendRole;

  if (normalized === "INSTRUCTOR") {
    return "TEACHER";
  }

  if (normalized === "ADMIN") {
    return "ADMIN";
  }

  return "STUDENT";
};

const toDisplayName = (input: { firstName?: string; lastName?: string; username?: string; email?: string }): string => {
  const fullName = `${input.firstName ?? ""} ${input.lastName ?? ""}`.trim();

  if (fullName) {
    return fullName;
  }

  if (input.username && input.username.trim()) {
    return input.username.trim();
  }

  if (input.email) {
    return input.email.split("@")[0] || "User";
  }

  return "User";
};

const buildError = async (res: Response): Promise<AuthApiError> => {
  let message = "Request failed";

  try {
    const data = (await res.json()) as { message?: string };
    if (data.message && data.message.trim()) {
      message = data.message;
    }
  } catch {
    // Ignore parsing errors and use fallback message.
  }

  return new AuthApiError(message, res.status);
};

const buildSessionFromLogin = (payload: LoginResponse): AuthSession => {
  const user = payload.user;

  if (!user?.id || !user.email) {
    throw new AuthApiError("Invalid login response from server", 500);
  }

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    role: normalizeRole(user.role),
    displayName: toDisplayName({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
    }),
  };

  return {
    user: authUser,
    accessToken: payload.accessToken ?? null,
  };
};

const splitFullName = (fullName: string): { firstName: string; lastName: string } => {
  const trimmed = fullName.trim();

  if (!trimmed) {
    return { firstName: "Student", lastName: "User" };
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "User" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
};

export const authApi = {
  async login(input: LoginInput): Promise<AuthSession> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email.trim(),
        passwordHash: input.password,
      }),
    });

    if (!response.ok) {
      throw await buildError(response);
    }

    const data = (await response.json()) as LoginResponse;
    return buildSessionFromLogin(data);
  },

  async registerStudent(input: RegisterStudentInput): Promise<void> {
    const { firstName, lastName } = splitFullName(input.fullName);
    const username = input.email.split("@")[0] || `${firstName}.${lastName}`.toLowerCase();

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email.trim(),
        passwordHash: input.password,
        firstName,
        lastName,
        username,
        role: "STUDENT",
        createdAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw await buildError(response);
    }

    const data = (await response.json()) as RegisterResponse;
    if (!data.user?.id) {
      throw new AuthApiError("Invalid registration response from server", 500);
    }
  },
};
