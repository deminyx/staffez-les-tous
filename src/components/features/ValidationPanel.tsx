"use client";

import { useState, useTransition } from "react";

import { validatePublication } from "@/app/admin/actions";

interface ValidationPanelProps {
  publicationId: string;
}

export const ValidationPanel = ({ publicationId }: ValidationPanelProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const handleAction = (action: "APPROUVEE" | "REJETEE") => {
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.set("publicationId", publicationId);
    formData.set("action", action);
    formData.set("comment", comment);

    startTransition(async () => {
      const result = await validatePublication(formData);
      if (!result.success) {
        setError(result.error ?? "Erreur inconnue.");
      } else {
        setSuccess(
          action === "APPROUVEE" ? "Publication approuvee et publiee." : "Publication rejetee.",
        );
      }
    });
  };

  return (
    <div className="card border-amber-200 bg-amber-50 p-4">
      <h3 className="font-display text-sm font-bold text-amber-800">Validation requise</h3>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-2 text-sm text-green-700">{success}</p>}

      <div className="mt-3">
        <label
          htmlFor="validation-comment"
          className="mb-1 block text-sm font-medium text-amber-700"
        >
          Commentaire (optionnel)
        </label>
        <textarea
          id="validation-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          placeholder="Raison du rejet ou commentaire..."
        />
      </div>

      <div className="mt-3 flex gap-3">
        <button
          onClick={() => handleAction("APPROUVEE")}
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
        >
          {isPending ? "..." : "Approuver"}
        </button>
        <button
          onClick={() => handleAction("REJETEE")}
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          {isPending ? "..." : "Rejeter"}
        </button>
      </div>
    </div>
  );
};
