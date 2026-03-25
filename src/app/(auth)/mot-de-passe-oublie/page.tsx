"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Erreur serveur");
      }

      // Toujours afficher succes (securite : ne pas reveler si l'email existe)
      setSuccess(true);
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
          Mot de passe oublie
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Saisissez votre adresse e-mail pour recevoir un nouveau mot de passe.
        </p>
      </div>

      {/* Form card */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        {success ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="h-6 w-6 text-green-400" aria-hidden="true" />
            </div>
            <p className="text-sm text-gray-300">
              Si cette adresse e-mail est associee a un compte, un nouveau mot de
              passe vous a ete envoye. Verifiez votre boite de reception (et vos
              spams).
            </p>
            <Link
              href="/connexion"
              className="btn-primary mt-4 inline-flex items-center gap-2 px-6 py-2.5"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Retour a la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
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
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Adresse e-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-gray-500 transition-all focus:border-brand-red/50 focus:outline-none focus:ring-2 focus:ring-brand-red/30"
                placeholder="votre@email.com"
              />
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
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Envoyer
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Back to login */}
      {!success && (
        <div className="text-center">
          <Link
            href="/connexion"
            className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-300"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            Retour a la connexion
          </Link>
        </div>
      )}
    </div>
  );
}
