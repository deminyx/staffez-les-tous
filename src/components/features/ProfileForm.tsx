"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";

import { updateProfile } from "@/app/espace-membre/actions";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
  phone: string;
  bio: string;
  allergies: string;
}

export const ProfileForm = ({ phone, bio, allergies }: ProfileFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    setMessage(null);

    try {
      const result = await updateProfile(formData);

      if (result.success) {
        setMessage({ type: "success", text: "Profil mis a jour avec succes." });
      } else {
        setMessage({ type: "error", text: result.error ?? "Une erreur est survenue." });
      }
    } catch {
      setMessage({ type: "error", text: "Une erreur est survenue. Veuillez reessayer." });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form action={handleSubmit} className="card space-y-6 p-6">
      <h2 className="font-display text-lg font-bold text-brand-black">
        Informations modifiables
      </h2>

      {/* Telephone */}
      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
          Telephone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={phone}
          placeholder="06 12 34 56 78"
          maxLength={20}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-brand-black placeholder-gray-400 transition-colors focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
        />
        <p className="mt-1 text-xs text-gray-400">
          Visible uniquement par les coordinateurs
        </p>
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="mb-1.5 block text-sm font-medium text-gray-700">
          Biographie
        </label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={bio}
          placeholder="Presentez-vous en quelques mots..."
          maxLength={500}
          rows={4}
          className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-brand-black placeholder-gray-400 transition-colors focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
        />
        <p className="mt-1 text-xs text-gray-400">
          500 caracteres maximum
        </p>
      </div>

      {/* Allergies */}
      <div>
        <label htmlFor="allergies" className="mb-1.5 block text-sm font-medium text-gray-700">
          Allergies / Regime alimentaire
        </label>
        <textarea
          id="allergies"
          name="allergies"
          defaultValue={allergies}
          placeholder="Mentionnez vos allergies ou restrictions alimentaires..."
          maxLength={500}
          rows={3}
          className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-brand-black placeholder-gray-400 transition-colors focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
        />
        <p className="mt-1 text-xs text-gray-400">
          Important pour l&apos;organisation des repas lors des evenements
        </p>
      </div>

      {/* Message de feedback */}
      {message && (
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-3 text-sm",
            message.type === "success"
              ? "border border-green-200 bg-green-50 text-green-700"
              : "border border-red-200 bg-red-50 text-red-700",
          )}
          role="alert"
        >
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          {message.text}
        </div>
      )}

      {/* Bouton */}
      <div className="flex justify-end border-t border-gray-100 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" aria-hidden="true" />
              Enregistrer
            </>
          )}
        </button>
      </div>
    </form>
  );
};
