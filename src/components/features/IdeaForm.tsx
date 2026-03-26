"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";

import { submitIdea } from "@/app/espace-membre/vie-associative/actions";

export const IdeaForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await submitIdea(formData);

    if (result.success) {
      setSuccess(true);
      setIsOpen(false);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error ?? "Erreur");
    }

    setIsSubmitting(false);
  };

  return (
    <div>
      {success && (
        <div className="mb-4 rounded-lg bg-green-500/10 p-3 text-sm text-green-400">
          Idee soumise avec succes ! Elle sera visible apres validation par un administrateur.
        </div>
      )}

      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-red-vivid"
        >
          <Lightbulb className="h-4 w-4" />
          Proposer une idee
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-white/10 bg-surface-dark p-6"
        >
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">
            Proposer une idee
          </h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="idea-title" className="mb-1 block text-sm text-gray-300">
                Titre (max 100 caracteres)
              </label>
              <input
                id="idea-title"
                name="title"
                type="text"
                maxLength={100}
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-gray-600 focus:border-brand-red focus:outline-none"
                placeholder="Votre idee en quelques mots..."
              />
            </div>

            <div>
              <label htmlFor="idea-desc" className="mb-1 block text-sm text-gray-300">
                Description (max 500 caracteres)
              </label>
              <textarea
                id="idea-desc"
                name="description"
                maxLength={500}
                rows={3}
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-gray-600 focus:border-brand-red focus:outline-none"
                placeholder="Decrivez votre idee plus en detail..."
              />
            </div>
          </div>

          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-red-vivid disabled:opacity-50"
            >
              {isSubmitting ? "Envoi..." : "Soumettre"}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-white/5 px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/10"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
