import { apiRequest } from "@/lib/api";
import type { AuthUserResponse, User } from "@/types/user";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  message?: string;

  session: {
    access_token: string;
    refresh_token?: string;
  };

  user?: User;
}

export interface RegisterResponse {
  message: string;
  user?: User;
}

export const authService = {
  // =====================================================
  // LOGIN
  // =====================================================

  async login(payload: LoginPayload): Promise<LoginResponse> {
    const data = await apiRequest<LoginResponse>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    if (data.session?.access_token) {
      localStorage.setItem(
        "access_token",
        data.session.access_token
      );
    }

    if (data.session?.refresh_token) {
      localStorage.setItem(
        "refresh_token",
        data.session.refresh_token
      );
    }

    return data;
  },

  // =====================================================
  // REGISTER
  // =====================================================

  async register(
    payload: RegisterPayload
  ): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  // =====================================================
  // GET CURRENT USER
  // =====================================================

  async getMe(): Promise<User> {
    const data =
      await apiRequest<AuthUserResponse>(
        "/api/auth/me"
      );

    return data.user;
  },

  // =====================================================
  // CHECK IF LOGGED IN
  // =====================================================

  isAuthenticated(): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    return Boolean(
      localStorage.getItem("access_token")
    );
  },

  // =====================================================
  // GET TOKEN
  // =====================================================

  getToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem(
      "access_token"
    );
  },

  // =====================================================
  // LOGOUT
  // =====================================================

  async logout(): Promise<void> {
    try {
      await apiRequest("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error(
        "Backend logout failed:",
        error
      );
    } finally {
      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "refresh_token"
      );
    }
  },
};