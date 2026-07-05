"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 60_000; // 1 minute

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const router = useRouter();

  const isLocked = lockedUntil && Date.now() < lockedUntil;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      const remaining = Math.ceil(((lockedUntil || 0) - Date.now()) / 1000);
      setError(`Terlalu banyak percobaan. Coba lagi dalam ${remaining} detik.`);
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_DURATION);
        setError(`Akun terkunci selama 60 detik karena ${MAX_ATTEMPTS}x gagal login.`);
        setTimeout(() => {
          setLockedUntil(null);
          setAttempts(0);
        }, LOCKOUT_DURATION);
      } else {
        setError(`${error.message} (${MAX_ATTEMPTS - newAttempts} percobaan tersisa)`);
      }
      setLoading(false);
    } else {
      router.push("/id/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="neo-card p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black">🔐 Login</h1>
            <p className="text-sm text-neo-border/60 mt-2">
              Masuk ke dashboard admin
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-neo-border rounded-lg bg-background font-medium text-sm focus:outline-none focus:ring-2 focus:ring-neo-yellow"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-neo-border rounded-lg bg-background font-medium text-sm focus:outline-none focus:ring-2 focus:ring-neo-yellow"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="neo-card bg-neo-red/20 p-3 text-sm font-medium text-red-700 border-neo-red">
                ❌ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !!isLocked}
              className="neo-btn bg-neo-green w-full py-3 text-base text-center disabled:opacity-50"
            >
              {isLocked ? "🔒 Terkunci" : loading ? "Loading..." : "Masuk →"}
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <a
            href="/"
            className="text-sm font-bold text-neo-border/60 hover:text-neo-border"
          >
            ← Kembali ke website
          </a>
        </div>
      </div>
    </div>
  );
}
