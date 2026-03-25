"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

export default function ConnexionPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username: username.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Identifiant ou mot de passe incorrect.");
      } else {
        router.push("/espace-membre");
        router.refresh();
      }
    } catch {
      setError("Une erreur est survenue. Veuillez reessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo / Brand */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-brand-red/40 bg-brand-red/10">
          <span className="font-display text-3xl font-black text-brand-red">S</span>
        </div>
        <h1 className="font-display text-2xl font-black uppercase text-white">
          Connexion
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Espace reserve aux adherents de l&apos;association
        </p>
      </div>

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
      >
        {error && (
          <div
            className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="username"
            className="mb-1.5 block text-sm font-medium text-gray-300"
          >
            Identifiant
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            autoFocus
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-gray-500 transition-all focus:border-brand-red/50 focus:outline-none focus:ring-2 focus:ring-brand-red/30"
            placeholder="Ex : jdupont"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-gray-300"
          >
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 pr-10 text-sm text-white placeholder-gray-500 transition-all focus:border-brand-red/50 focus:outline-none focus:ring-2 focus:ring-brand-red/30"
              placeholder="Votre mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex w-full items-center justify-center gap-2 py-3 text-base"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Se connecter
            </>
          )}
        </button>

        <div className="text-center">
          <Link
            href="/mot-de-passe-oublie"
            className="text-sm text-gray-400 transition-colors hover:text-brand-red"
          >
            Mot de passe oublie ?
          </Link>
        </div>
      </form>

      {/* Back to site */}
      <div className="text-center">
        <Link
          href="/"
          className="text-sm text-gray-500 transition-colors hover:text-gray-300"
        >
          Retour au site
        </Link>
      </div>
    </div>
  );
}
