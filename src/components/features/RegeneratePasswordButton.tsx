"use client";

import { useState, useTransition } from "react";
import { KeyRound, Copy, Check } from "lucide-react";

import { regeneratePassword } from "@/app/admin/actions";

interface RegeneratePasswordButtonProps {
  userId: string;
  userName: string;
}

export const RegeneratePasswordButton = ({ userId, userName }: RegeneratePasswordButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleClick = () => {
    setConfirmed(true);
  };

  const handleConfirm = () => {
    setError(null);
    setNewPassword(null);
    const formData = new FormData();
    formData.set("userId", userId);

    startTransition(async () => {
      const res = await regeneratePassword(formData);
      if (!res.success) {
        setError(res.error ?? "Erreur inconnue.");
      } else {
        setNewPassword(res.temporaryPassword!);
      }
      setConfirmed(false);
    });
  };

  const handleCopy = async () => {
    if (!newPassword) return;
    await navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex flex-col items-end gap-1">
      {error && <p className="text-xs text-red-600">{error}</p>}

      {newPassword ? (
        <div className="flex items-center gap-2">
          <code className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">{newPassword}</code>
          <button
            onClick={handleCopy}
            className="rounded p-1 text-gray-400 hover:text-brand-black"
            aria-label="Copier le mot de passe"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      ) : confirmed ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-700">Confirmer la regeneration ?</span>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="rounded-lg bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "..." : "Oui"}
          </button>
          <button
            onClick={() => setConfirmed(false)}
            className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
          >
            Non
          </button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-brand-black"
          aria-label={`Regenerer le mot de passe de ${userName}`}
          title="Regenerer le mot de passe"
        >
          <KeyRound className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
