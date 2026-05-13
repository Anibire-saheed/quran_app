"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    async function handleCallback() {
      if (!code) return;

      try {
        const response = await axios.post("/api/auth/token", { code });

        const { access_token, user } = response.data;
        if (access_token) {
          localStorage.setItem("qf_access_token", access_token);
          if (user) {
            localStorage.setItem("qf_user", JSON.stringify(user));
          }
          window.location.href = "/welcome";
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        router.push("/login?error=callback_failed");
      }
    }

    handleCallback();
  }, [code, router]);

  return null;
}

export default function CallbackPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="font-black tracking-widest uppercase text-sm animate-pulse">Completing Authentication...</p>
      <Suspense>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
