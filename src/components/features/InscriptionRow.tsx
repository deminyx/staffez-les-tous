"use client";

import { useState, useTransition } from "react";
import { Check, X, Clock } from "lucide-react";

import { updateInscriptionStatus } from "@/app/admin/actions";

interface InscriptionData {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  status: string;
  position: string | null;
  schedule: string | null;
  notes: string | null;
  createdAt: string;
}

interface InscriptionRowProps {
  inscription: InscriptionData;
}

const STATUS_BADGE: Record<string, string> = {
  EN_ATTENTE: "bg-amber-100 text-amber-700",
  VALIDEE: "bg-green-100 text-green-700",
  REFUSEE: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<string, string> = {
  EN_ATTENTE: "En attente",
  VALIDEE: "Validee",
  REFUSEE: "Refusee",
};

export const InscriptionRow = ({ inscription }: InscriptionRowProps) => {
  const [isPending, startTransition] = useTransition();
  const [position, setPosition] = useState(inscription.position ?? "");
  const [schedule, setSchedule] = useState(inscription.schedule ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = (status: "EN_ATTENTE" | "VALIDEE" | "REFUSEE") => {
    setError(null);
    const formData = new FormData();
    formData.set("inscriptionId", inscription.id);
    formData.set("status", status);
    formData.set("position", position);
    formData.set("schedule", schedule);

    startTransition(async () => {
      const result = await updateInscriptionStatus(formData);
      if (!result.success) {
        setError(result.error ?? "Erreur inconnue.");
      }
    });
  };

  const handleSaveAssignment = () => {
    handleStatusChange(inscription.status as "EN_ATTENTE" | "VALIDEE" | "REFUSEE");
  };

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50">
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-brand-black">
            {inscription.firstName} {inscription.lastName}
          </p>
          <p className="text-xs text-gray-400">@{inscription.username}</p>
        </div>
      </td>
      <td className="hidden px-4 py-3 text-sm text-gray-600 md:table-cell">
        {new Date(inscription.createdAt).toLocaleDateString("fr-FR")}
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[inscription.status] ?? ""}`}
        >
          {STATUS_LABEL[inscription.status] ?? inscription.status}
        </span>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </td>
      <td className="hidden px-4 py-3 lg:table-cell">
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          onBlur={handleSaveAssignment}
          placeholder="Poste..."
          className="w-full rounded border border-gray-200 px-2 py-1 text-xs focus:border-brand-red focus:outline-none"
        />
      </td>
      <td className="hidden px-4 py-3 lg:table-cell">
        <input
          type="text"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          onBlur={handleSaveAssignment}
          placeholder="Horaires..."
          className="w-full rounded border border-gray-200 px-2 py-1 text-xs focus:border-brand-red focus:outline-none"
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => handleStatusChange("VALIDEE")}
            disabled={isPending || inscription.status === "VALIDEE"}
            className="rounded-lg p-1.5 text-green-600 hover:bg-green-50 disabled:opacity-30"
            aria-label={`Valider l'inscription de ${inscription.firstName}`}
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleStatusChange("REFUSEE")}
            disabled={isPending || inscription.status === "REFUSEE"}
            className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-30"
            aria-label={`Refuser l'inscription de ${inscription.firstName}`}
          >
            <X className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleStatusChange("EN_ATTENTE")}
            disabled={isPending || inscription.status === "EN_ATTENTE"}
            className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50 disabled:opacity-30"
            aria-label={`Mettre en attente l'inscription de ${inscription.firstName}`}
          >
            <Clock className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
