"use client";
import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

export function LoginForm({ client }: { client: SupabaseClient }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) setError("Those details didn't work. Check your email and password.");
    setBusy(false); // on success the dashboard reacts to the new session
  }

  const input = "mt-1 block w-full rounded-md border-2 border-moss/60 bg-cream px-3 py-2.5 text-base focus:border-forest";
  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-4 rounded-lg border-2 border-moss/50 bg-cream p-6">
      <h2 className="text-2xl">Sign in</h2>
      <div>
        <label htmlFor="login-email" className="font-medium text-forest">Email</label>
        <input id="login-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
      </div>
      <div>
        <label htmlFor="login-password" className="font-medium text-forest">Password</label>
        <input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
      </div>
      {error && <p role="alert" className="text-midnight underline decoration-rose">{error}</p>}
      <button type="submit" disabled={busy} className="min-h-12 w-full rounded-full border-2 border-forest bg-forest font-semibold text-cream disabled:opacity-60">
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
