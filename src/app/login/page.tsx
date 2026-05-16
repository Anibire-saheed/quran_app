"use client";

import { ArrowRight, BookOpen, Headphones, Target, Users, Sparkles } from "lucide-react";
import Image from "next/image";
import { generateCodeVerifier, generateCodeChallenge, generateRandomString } from "@/utils/pkce";

export default function SignInPage() {
  const handleOAuthLogin = async () => {
    const oauthBase =
      process.env.NEXT_PUBLIC_QF_OAUTH_BASE_URL ||
      "https://prelive-oauth2.quran.foundation";
    const clientId = process.env.NEXT_PUBLIC_QF_CLIENT_ID || "";
    const redirectUri = process.env.NEXT_PUBLIC_QF_OAUTH_REDIRECT_URI || `${window.location.origin}/callback`;

    // PKCE and OIDC security params
    const codeVerifier = await generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateRandomString(16);
    const nonce = generateRandomString(16);

    // Store for callback
    localStorage.setItem("qf_auth_state", state);
    localStorage.setItem("qf_auth_nonce", nonce);
    localStorage.setItem("qf_auth_verifier", codeVerifier);
    localStorage.setItem("qf_auth_redirect_uri", redirectUri);

    const url = new URL(`${oauthBase}/oauth2/auth`);
    url.searchParams.append("client_id", clientId);
    url.searchParams.append("redirect_uri", redirectUri);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("scope", "openid profile email offline_access user collection");
    url.searchParams.append("state", state);
    url.searchParams.append("nonce", nonce);
    url.searchParams.append("code_challenge", codeChallenge);
    url.searchParams.append("code_challenge_method", "S256");

    window.location.href = url.toString();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-[1100px] min-h-[700px] rounded-[48px] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-white/10">

        {/* ── Left: Login form ── */}
        <div className="flex-1 bg-[#0a1628] p-8 lg:p-20 flex flex-col items-center justify-center text-center">
          <div className="mb-12">
            <div className="w-16 h-16 islamic-gradient rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-900/50 mx-auto mb-6">
              <span className="text-white font-black italic text-2xl">Q</span>
            </div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-white/40 font-medium">Continue your spiritual journey</p>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <button
              type="button"
              onClick={handleOAuthLogin}
              className="w-full islamic-gradient text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:opacity-90 transition-all active:scale-95 shadow-2xl shadow-emerald-900/30 flex items-center justify-center gap-3"
            >
              Sign in with Quran Foundation
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="pt-6 flex items-center gap-4">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">or continue with</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: BookOpen, label: "Read" },
                { icon: Headphones, label: "Listen" },
                { icon: Sparkles, label: "Reflect" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={handleOAuthLogin}
                  className="flex flex-col items-center justify-center gap-1.5 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <Icon className="w-5 h-5 text-brand-emerald-light" />
                  <span className="text-[10px] font-bold text-white/40">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-12 text-xs text-white/20 font-semibold leading-relaxed">
            Secured by Quran Foundation OAuth 2.0
          </p>
        </div>

        {/* ── Right: Image panel ── */}
        <div className="hidden lg:block w-[48%] relative">
          <div className="w-full h-full relative">
            <Image
              src="/mosque-bg.png"
              alt="Mosque"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 48vw, 0px"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/30 to-black/80" />

            {/* Stats card */}
            <div className="absolute top-10 right-10 bg-black/60 backdrop-blur-xl p-5 rounded-3xl border border-white/10 max-w-[240px]">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: BookOpen, value: "114", label: "Surahs" },
                  { icon: Headphones, value: "100+", label: "Reciters" },
                  { icon: Target, value: "50+", label: "Translations" },
                  { icon: Users, value: "25K+", label: "Readers" },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="text-center">
                    <Icon className="w-4 h-4 text-brand-emerald-light mx-auto mb-1" />
                    <p className="text-white font-black text-lg leading-none">{value}</p>
                    <p className="text-white/40 text-[10px] font-semibold mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom copy */}
            <div className="absolute bottom-14 left-12 right-12 text-white">
              <p className="arabic-text text-3xl text-amber-300/90 mb-4 font-medium">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </p>
              <h2 className="text-3xl font-black mb-2 leading-tight">
                Read. Listen. Reflect.
              </h2>
              <p className="text-white/50 text-sm font-medium leading-relaxed">
                A premium Quran experience designed for the modern Muslim.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
