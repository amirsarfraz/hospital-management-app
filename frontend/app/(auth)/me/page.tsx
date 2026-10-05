"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { CurrentUserState } from "@/types/user";

export default function CurrentUserPage() {
  const router = useRouter();

  const [state, setState] =
    useState<CurrentUserState>({
      user: null,
      profile: null,
      loading: true,
    });

  const {
    user,
    profile,
    loading,
  } = state;

  const updateState = <
    K extends keyof CurrentUserState
  >(
    field: K,
    value: CurrentUserState[K]
  ) => {
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          router.replace("/login");
          return;
        }

        updateState("user", user);

        // Anonymous guest
        if (user.is_anonymous) {
          updateState("loading", false);
          return;
        }

        // Get profile information including role
        const {
          data: profileData,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error(
            "Profile error:",
            profileError.message
          );
        } else {
          updateState(
            "profile",
            profileData
          );
        }
      } finally {
        updateState(
          "loading",
          false
        );
      }
    };

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading user...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white border rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6">
          Current User
        </h1>

        <div className="space-y-4">
          <div>
            <span className="font-medium">
              User ID:
            </span>

            <p className="text-gray-600">
              {user.id}
            </p>
          </div>

          <div>
            <span className="font-medium">
              Email:
            </span>

            <p className="text-gray-600">
              {user.email || "Guest user"}
            </p>
          </div>

          <div>
            <span className="font-medium">
              Account Type:
            </span>

            <p className="text-gray-600">
              {user.is_anonymous
                ? "Guest"
                : "Registered User"}
            </p>
          </div>

          {!user.is_anonymous && (
            <div>
              <span className="font-medium">
                Role:
              </span>

              <p className="text-gray-600">
                {profile?.role || "user"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}