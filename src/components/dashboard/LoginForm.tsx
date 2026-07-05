"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "register";

export default function LoginForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const supabase = createClient();

    if (mode === "register") {
      if (password !== confirmPassword) {
        setError("Password tidak sama!");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError("Password minimal 6 karakter");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setSuccess("✅ Akun berhasil dibuat! Cek email untuk verifikasi, atau langsung login.");
        setMode("login");
        setLoading(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.push("/id/dashboard");
        router.refresh();
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="neo-card p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black">
              {mode === "login" ? "🔐 Login" : "📝 Register"}
            </h1>
            <p className="text-sm text-neo-border/60 mt-2">
              {mode === "login"
                ? "Masuk ke dashboard admin"
                : "Buat akun baru untuk dashboard"}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
              className={`neo-btn flex-1 py-2 text-sm text-center ${mode === "login" ? "bg-neo-yellow" : "bg-surface"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
              className={`neo-btn flex-1 py-2 text-sm text-center ${mode === "register" ? "bg-neo-yellow" : "bg-surface"}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {mode === "register" && (
              <div>
                <label htmlFor="confirm" className="block text-sm font-bold mb-1">
                  Konfirmasi Password
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-neo-border rounded-lg bg-background font-medium text-sm focus:outline-none focus:ring-2 focus:ring-neo-yellow"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {error && (
              <div className="neo-card bg-neo-red/20 p-3 text-sm font-medium text-red-700 border-neo-red">
                ❌ {error}
              </div>
            )}

            {success && (
              <div className="neo-card bg-neo-green/20 p-3 text-sm font-medium text-green-700 border-neo-green">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="neo-btn bg-neo-green w-full py-3 text-base text-center disabled:opacity-50"
            >
              {loading
                ? "Loading..."
                : mode === "login"
                ? "Masuk →"
                : "Daftar →"}
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
