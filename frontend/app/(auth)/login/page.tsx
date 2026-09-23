"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { apiRequest } from "@/lib/api";

import type {
  AuthUserResponse,
} from "@/types/user";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    checkingSession,
    setCheckingSession,
  ] = useState(true);

  const redirectByRole = (
    role: string
  ) => {
    if (role === "admin") {
      router.replace("/admin");
      return;
    }

    router.replace("/dashboard");
  };

  useEffect(() => {
    const checkSession =
      async () => {
        try {
          const {
            data: { session },
          } =
            await supabase.auth.getSession();

          if (!session) {
            setCheckingSession(false);
            return;
          }

          localStorage.setItem(
            "access_token",
            session.access_token
          );

          if (
            session.refresh_token
          ) {
            localStorage.setItem(
              "refresh_token",
              session.refresh_token
            );
          }

          const me =
            await apiRequest<AuthUserResponse>(
              "/api/auth/me"
            );

          localStorage.setItem(
            "role",
            me.user.role
          );

          redirectByRole(
            me.user.role
          );
        } catch (error) {
          console.error(
            "Session check failed:",
            error
          );

          localStorage.removeItem(
            "access_token"
          );

          localStorage.removeItem(
            "refresh_token"
          );

          localStorage.removeItem(
            "role"
          );

          await supabase.auth.signOut();

          setCheckingSession(false);
        }
      };

    checkSession();
  }, [router]);

  const handleLogin = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (
      !email.trim() ||
      !password
    ) {
      setError(
        "Email and password are required."
      );

      return;
    }

    try {
      setLoading(true);

      const {
        data,
        error,
      } =
        await supabase.auth.signInWithPassword(
          {
            email:
              email.trim(),

            password,
          }
        );

      if (error) {
        setError(
          error.message
        );

        return;
      }

      if (!data.session) {
        setError(
          "Unable to create login session."
        );

        return;
      }

      localStorage.setItem(
        "access_token",
        data.session.access_token
      );

      if (
        data.session.refresh_token
      ) {
        localStorage.setItem(
          "refresh_token",
          data.session.refresh_token
        );
      }

      const me =
        await apiRequest<AuthUserResponse>(
          "/api/auth/me"
        );

      if (!me.user) {
        setError(
          "Unable to load user profile."
        );

        return;
      }

      if (!me.user.role) {
        setError(
          "User role could not be determined."
        );

        return;
      }

      localStorage.setItem(
        "role",
        me.user.role
      );

      redirectByRole(
        me.user.role
      );

      router.refresh();
    } catch (err) {
      console.error(
        "Login error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">
          Checking session...
        </p>
      </div>
    );
  }

  return (
    <main className="flex h-[calc(80vh-64px)] items-center justify-center overflow-hidden px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            City Care Hospital
          </h1>

          <p className="mt-2 text-slate-500">
            Sign in to Hospital Management System
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              placeholder="admin@citycare.com"
              autoComplete="email"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Enter password"
              autoComplete="current-password"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}

          <button
            type="button"
            onClick={() =>
              router.push(
                "/register"
              )
            }
            className="font-medium text-blue-600 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </main>
  );
}