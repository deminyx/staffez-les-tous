"use client";

import { useState } from "react";
import { MapPin, Calendar, Users } from "lucide-react";

import { toggleSortieInscription } from "@/app/espace-membre/vie-associative/actions";
import { cn } from "@/lib/utils";

interface SortieCardProps {
  id: string;
  title: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  maxVolunteers: number | null;
  inscriptionOpen: boolean;
  inscriptionCount: number;
  isInscrit: boolean;
}

export const SortieCard = ({
  id,
  title,
  description,
  startDate,
  endDate,
  location,
  maxVolunteers,
  inscriptionOpen,
  inscriptionCount,
  isInscrit: initialIsInscrit,
}: SortieCardProps) => {
  const [isInscrit, setIsInscrit] = useState(initialIsInscrit);
  const [count, setCount] = useState(inscriptionCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("eventId", id);

    const result = await toggleSortieInscription(formData);

    if (result.success) {
      if (isInscrit) {
        setCount((c) => c - 1);
      } else {
        setCount((c) => c + 1);
      }
      setIsInscrit(!isInscrit);
    } else {
      setError(result.error ?? "Erreur");
    }

    setIsLoading(false);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  const isFull = maxVolunteers !== null && count >= maxVolunteers;

  return (
    <div className="card p-6">
      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-brand-black">
        {title}
      </h3>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
        {startDate && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(startDate)}
            {endDate && ` — ${formatDate(endDate)}`}
          </span>
        )}
        {location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {location}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          {count}
          {maxVolunteers ? ` / ${maxVolunteers}` : ""} inscrit{count > 1 ? "s" : ""}
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">{description}</p>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      {inscriptionOpen && (
        <button
          onClick={handleToggle}
          disabled={isLoading || (!isInscrit && isFull)}
          className={cn(
            "mt-4 rounded-lg px-4 py-2 text-sm font-bold transition-all",
            isInscrit
              ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
              : isFull
                ? "cursor-not-allowed bg-gray-50 text-gray-400"
                : "bg-brand-red text-white hover:bg-brand-red-vivid",
            isLoading && "opacity-50",
          )}
        >
          {isLoading ? "..." : isInscrit ? "Se desinscrire" : isFull ? "Complet" : "S'inscrire"}
        </button>
      )}
    </div>
  );
};
