"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function GuestPage() {
  const router = useRouter();

  const [error, setError] = useState("");

  useEffect(() => {
    const continueAsGuest = async () => {
      const {
        data,
        error,
      } = await supabase.auth.signInAnonymously();

      if (error) {
        setError(error.message);
        return;
      }

      console.log("Anonymous user:", data.user);

      router.replace("/dashboard");
      router.refresh();
    };

    continueAsGuest();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Guest login failed
          </h2>

          <p className="mt-2 text-gray-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">
        Starting guest session...
      </p>
    </div>
  );
}