"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { createPoll } from "@/app/admin/boutique-vie-asso-actions";

export const PollForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("options", JSON.stringify(options.filter((o) => o.trim())));

    const result = await createPoll(formData);

    if (result.success) {
      setSuccess(true);
      setIsOpen(false);
      setOptions(["", ""]);
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
          Sondage cree avec succes !
        </div>
      )}

      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-red-vivid"
        >
          + Nouveau sondage
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-white/10 bg-surface-dark p-6"
        >
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">
            Nouveau sondage
          </h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="poll-question" className="mb-1 block text-sm text-gray-300">
                Question
              </label>
              <input
                id="poll-question"
                name="question"
                type="text"
                required
                maxLength={500}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-brand-red focus:outline-none"
                placeholder="Quelle question souhaitez-vous poser ?"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">Options (2 a 6)</label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index] = e.target.value;
                        setOptions(newOptions);
                      }}
                      placeholder={`Option ${index + 1}`}
                      maxLength={200}
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-red focus:outline-none"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setOptions(options.filter((_, i) => i !== index))}
                        className="text-gray-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {options.length < 6 && (
                <button
                  type="button"
                  onClick={() => setOptions([...options, ""])}
                  className="mt-2 flex items-center gap-1 text-xs text-brand-red hover:underline"
                >
                  <Plus className="h-3 w-3" /> Ajouter une option
                </button>
              )}
            </div>

            <div>
              <label htmlFor="poll-closes" className="mb-1 block text-sm text-gray-300">
                Date de cloture
              </label>
              <input
                id="poll-closes"
                name="closesAt"
                type="datetime-local"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-brand-red focus:outline-none"
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
              {isSubmitting ? "Creation..." : "Creer le sondage"}
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
