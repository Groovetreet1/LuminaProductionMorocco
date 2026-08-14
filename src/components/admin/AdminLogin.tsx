"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Flame, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const t = useTranslations();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(t("admin.wrong"));
        setLoading(false);
      }
    } catch {
      setError(t("admin.wrong"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" dir="ltr">
      <div className="w-full max-w-sm border border-line rounded-3xl p-8 bg-card/50">
        <div className="flex flex-col items-center gap-3 mb-8">
          <span className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-light to-gold flex items-center justify-center">
            <Flame className="w-7 h-7 text-background" />
          </span>
          <h1 className="font-display text-2xl text-cream">{t("admin.loginTitle")}</h1>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            className="field"
            placeholder={t("admin.username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <input
            type="password"
            className="field"
            placeholder={t("admin.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("admin.login")}
          </button>
        </form>
      </div>
    </div>
  );
}
