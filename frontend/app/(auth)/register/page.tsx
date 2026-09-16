"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  registerUser,
} from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError(
        "Full name is required."
      );
      return;
    }

    if (!email.trim()) {
      setError(
        "Email is required."
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const data =
        await registerUser(
          fullName,
          email,
          password
        );

      /*
       * If email confirmation is enabled,
       * session may be null.
       */
      if (!data.session) {
        setSuccess(
          "Registration successful. Please check your email to confirm your account."
        );

        return;
      }

      router.replace(
        "/dashboard"
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Create account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Register for City Care Hospital Management.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Ali Hassan"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="ali@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Minimum 8 characters"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              value={
                confirmPassword
              }
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Repeat password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white disabled:opacity-60"
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>

        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}

          <Link
            href="/login"
            className="font-medium text-blue-600"
          >
            Login
          </Link>
        </div>

      </div>

    </main>
  );
}