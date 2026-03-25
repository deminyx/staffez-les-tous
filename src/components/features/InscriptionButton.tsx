"use client";

import { useState } from "react";
import { UserPlus, X, Loader2, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

import { createInscription, cancelInscription } from "@/app/espace-membre/actions";
import { cn } from "@/lib/utils";

import type { InscriptionStatus } from "@prisma/client";

interface InscriptionButtonProps {
  eventId: string;
  inscriptionOpen: boolean;
  isFull: boolean;
  existingInscription: {
    id: string;
    status: InscriptionStatus;
  } | null;
}

export const InscriptionButton = ({
  eventId,
  inscriptionOpen,
  isFull,
  existingInscription,
}: InscriptionButtonProps) => {
  const [isPending, setIsPending] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleInscription = async (formData: FormData) => {
    setIsPending(true);
    setMessage(null);

    try {
      const result = await createInscription(formData);

      if (result.success) {
        setMessage({ type: "success", text: "Inscription envoyee avec succes !" });
        setShowNotes(false);
      } else {
        setMessage({ type: "error", text: result.error ?? "Une erreur est survenue." });
      }
    } catch {
      setMessage({ type: "error", text: "Une erreur est survenue. Veuillez reessayer." });
    } finally {
      setIsPending(false);
    }
  };

  const handleCancel = async (formData: FormData) => {
    setIsPending(true);
    setMessage(null);

    try {
      const result = await cancelInscription(formData);

      if (result.success) {
        setMessage({ type: "success", text: "Inscription annulee." });
      } else {
        setMessage({ type: "error", text: result.error ?? "Une erreur est survenue." });
      }
    } catch {
      setMessage({ type: "error", text: "Une erreur est survenue. Veuillez reessayer." });
    } finally {
      setIsPending(false);
    }
  };

  // Deja inscrit
  if (existingInscription && !message) {
    return (
      <div className="card space-y-4 p-6">
        {/* Status display */}
        {existingInscription.status === "EN_ATTENTE" && (
          <>
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm">
              <Clock className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
              <span className="font-medium text-amber-700">Inscription en attente</span>
            </div>
            <p className="text-xs text-gray-500">
              Votre inscription sera examinee par un coordinateur.
            </p>
            <form action={handleCancel}>
              <input type="hidden" name="inscriptionId" value={existingInscription.id} />
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <X className="h-4 w-4" aria-hidden="true" />
                )}
                Annuler mon inscription
              </button>
            </form>
          </>
        )}

        {existingInscription.status === "VALIDEE" && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm">
            <CheckCircle className="h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
            <span className="font-medium text-green-700">Inscription validee</span>
          </div>
        )}

        {existingInscription.status === "REFUSEE" && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm">
            <XCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            <span className="font-medium text-red-700">Inscription refusee</span>
          </div>
        )}
      </div>
    );
  }

  // Non inscrit
  return (
    <div className="card space-y-4 p-6">
      {/* Feedback message */}
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

      {/* Inscription form or disabled state */}
      {!inscriptionOpen && (
        <div className="rounded-lg bg-gray-50 px-4 py-3 text-center text-sm text-gray-500">
          Les inscriptions sont fermees pour cet evenement.
        </div>
      )}

      {inscriptionOpen && isFull && (
        <div className="rounded-lg bg-gray-50 px-4 py-3 text-center text-sm text-gray-500">
          Cet evenement est complet.
        </div>
      )}

      {inscriptionOpen && !isFull && !message && (
        <>
          {showNotes ? (
            <form action={handleInscription} className="space-y-4">
              <input type="hidden" name="eventId" value={eventId} />

              <div>
                <label
                  htmlFor="notes"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Notes (optionnel)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Disponibilites, preferences de poste..."
                  maxLength={500}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-brand-black placeholder-gray-400 transition-colors focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNotes(false)}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-red px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <UserPlus className="h-4 w-4" aria-hidden="true" />
                  )}
                  Confirmer
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowNotes(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-red px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700"
            >
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              S&apos;inscrire a cet evenement
            </button>
          )}
        </>
      )}
    </div>
  );
};
