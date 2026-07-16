"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/portal";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push(next);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#141413] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-starfield bg-starfield-twinkle opacity-60" aria-hidden />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold">
              <span className="text-[#C9A84C]">Forever</span>
              <span className="text-white">Forward</span>
            </h1>
          </Link>
          <p className="text-white/60 mt-2">Member sign in</p>
        </div>

        <div className="bg-[#1f1f1e] rounded-2xl p-8 border border-[#333] shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={submit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-[#141413] border border-[#333] text-white placeholder:text-white/40 focus:border-[#C9A84C] focus:outline-none"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-[#141413] border border-[#333] text-white placeholder:text-white/40 focus:border-[#C9A84C] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] py-3 font-semibold text-[#1A1A1A] disabled:opacity-60"
            >
              <LogIn className="h-5 w-5" />
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <p className="mt-6 text-center text-white/50 text-sm">
            New here?{" "}
            <Link href="/portal/signup" className="text-[#C9A84C] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
        <p className="text-center mt-6">
          <Link href="/" className="text-white/40 hover:text-white text-sm">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function MemberLoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
