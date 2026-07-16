"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signUpMember } from "@/lib/actions/member-auth";
import type { MemberKind } from "@/types/database";

export default function MemberSignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [kind, setKind] = useState<MemberKind>("father");
  const [guardianName, setGuardianName] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isYouth = kind === "youth";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signUpMember({
      email,
      password,
      fullName,
      kind,
      guardianName: isYouth ? guardianName : undefined,
      guardianEmail: isYouth ? guardianEmail : undefined,
    });
    if (!res.success) {
      setError(res.error ?? "Could not create account");
      setLoading(false);
      return;
    }
    // Sign in with the same credentials.
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      router.push("/portal/login");
      return;
    }
    router.push("/portal");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#141413] flex items-center justify-center p-4 py-12">
      <div className="absolute inset-0 bg-starfield bg-starfield-twinkle opacity-60" aria-hidden />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold">
              <span className="text-[#C9A84C]">Forever</span>
              <span className="text-white">Forward</span>
            </h1>
          </Link>
          <p className="text-white/60 mt-2">Create your member account</p>
        </div>

        <div className="bg-[#1f1f1e] rounded-2xl p-8 border border-[#333] shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={submit} className="space-y-4">
            <Field label="Your name">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="input-dark"
              />
            </Field>
            <Field label="I am a…">
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as MemberKind)}
                className="input-dark"
              >
                <option value="father">Father</option>
                <option value="youth">Youth / student</option>
                <option value="guardian">Parent / guardian</option>
                <option value="other">Other</option>
              </select>
            </Field>
            {isYouth && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Parent/guardian name">
                  <input
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="input-dark"
                  />
                </Field>
                <Field label="Guardian email">
                  <input
                    type="email"
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                    className="input-dark"
                  />
                </Field>
              </div>
            )}
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-dark"
              />
            </Field>
            <Field label="Password (8+ characters)">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="input-dark"
              />
            </Field>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] py-3 font-semibold text-[#1A1A1A] disabled:opacity-60"
            >
              <UserPlus className="h-5 w-5" />
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-center text-white/50 text-sm">
            Already have an account?{" "}
            <Link href="/portal/login" className="text-[#C9A84C] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        .input-dark {
          width: 100%;
          padding: 0.6rem 0.75rem;
          border-radius: 0.5rem;
          background: #141413;
          border: 1px solid #333;
          color: white;
          outline: none;
        }
        .input-dark:focus { border-color: #C9A84C; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
