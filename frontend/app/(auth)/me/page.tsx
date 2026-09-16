"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  role?: string;
  full_name?: string;
};

export default function CurrentUserPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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

        setUser(user);

        // Anonymous guest
        if (user.is_anonymous) {
          setLoading(false);
          return;
        }

        // Get profile information including role
        const { data: profileData, error: profileError } =
          await supabase
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
          setProfile(profileData);
        }
      } finally {
        setLoading(false);
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
            <span className="font-medium">User ID:</span>

            <p className="text-gray-600">
              {user.id}
            </p>
          </div>

          <div>
            <span className="font-medium">Email:</span>

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