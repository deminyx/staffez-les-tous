"use client";

import { useState, useTransition } from "react";
import { X, UserPlus, Copy, Check } from "lucide-react";

import { createMember } from "@/app/admin/actions";

interface CreateMemberModalProps {
  onCreated?: () => void;
}

export const CreateMemberModal = ({ onCreated }: CreateMemberModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    username: string;
    temporaryPassword: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createMember(formData);
      if (!res.success) {
        setError(res.error ?? "Erreur inconnue.");
      } else {
        setResult({
          username: res.username!,
          temporaryPassword: res.temporaryPassword!,
        });
        onCreated?.();
      }
    });
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(
      `Identifiant : ${result.username}\nMot de passe temporaire : ${result.temporaryPassword}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
    setResult(null);
    setCopied(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-primary gap-2">
        <UserPlus className="h-4 w-4" aria-hidden="true" />
        Nouveau membre
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-member-title"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2
                id="create-member-title"
                className="font-display text-lg font-bold text-brand-black"
              >
                Creer un membre
              </h2>
              <button
                onClick={handleClose}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {result ? (
              /* Success state — show credentials */
              <div className="mt-4 space-y-4">
                <p className="text-sm text-green-700">
                  Le membre <strong>{result.username}</strong> a ete cree avec succes.
                </p>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm">
                  <p>
                    <span className="text-gray-500">Identifiant : </span>
                    <strong>{result.username}</strong>
                  </p>
                  <p className="mt-1">
                    <span className="text-gray-500">Mot de passe temporaire : </span>
                    <strong>{result.temporaryPassword}</strong>
                  </p>
                </div>
                <p className="text-xs text-amber-600">
                  Notez ces informations — le mot de passe ne sera plus affiche apres la fermeture.
                </p>
                <div className="flex justify-end gap-3">
                  <button onClick={handleCopy} className="btn-secondary gap-2">
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copied ? "Copie !" : "Copier"}
                  </button>
                  <button onClick={handleClose} className="btn-primary">
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              /* Form state */
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {error && (
                  <p role="alert" className="text-sm text-red-600">
                    {error}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="cm-firstName"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Prenom *
                    </label>
                    <input
                      id="cm-firstName"
                      name="firstName"
                      type="text"
                      required
                      maxLength={100}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cm-lastName"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Nom *
                    </label>
                    <input
                      id="cm-lastName"
                      name="lastName"
                      type="text"
                      required
                      maxLength={100}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cm-email"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Adresse e-mail *
                  </label>
                  <input
                    id="cm-email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cm-phone"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Telephone
                  </label>
                  <input
                    id="cm-phone"
                    name="phone"
                    type="tel"
                    maxLength={20}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                  />
                </div>

                <p className="text-xs text-gray-500">
                  L&apos;identifiant et le mot de passe temporaire seront generes automatiquement.
                </p>

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={handleClose} className="btn-secondary">
                    Annuler
                  </button>
                  <button type="submit" disabled={isPending} className="btn-primary">
                    {isPending ? "Creation..." : "Creer le membre"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
