"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createEvent, updateEvent } from "@/app/admin/actions";

interface EventData {
  id: string;
  title: string;
  slug: string;
  description: string;
  missions: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  type: string;
  status: string;
  coverImage: string | null;
  maxVolunteers: number | null;
  inscriptionOpen: boolean;
}

interface EventFormProps {
  mode: "create" | "edit";
  event?: EventData;
}

/**
 * Genere un slug a partir d'un titre.
 */
function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const EventForm = ({ mode, event }: EventFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(event?.title ?? "");
  const [slug, setSlug] = useState(event?.slug ?? "");
  const [autoSlug, setAutoSlug] = useState(mode === "create");

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (autoSlug) {
      setSlug(slugify(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setAutoSlug(false);
    setSlug(value);
  };

  const handleSubmit = (formData: FormData) => {
    setError(null);

    // Add fields not directly in the form
    formData.set("slug", slug);
    formData.set("title", title);

    // Handle inscriptionOpen checkbox
    if (!formData.get("inscriptionOpen")) {
      formData.set("inscriptionOpen", "false");
    }

    startTransition(async () => {
      const action = mode === "create" ? createEvent : updateEvent;
      const result = await action(formData);
      if (!result.success) {
        setError(result.error ?? "Erreur inconnue.");
      } else {
        router.push("/admin/evenements");
      }
    });
  };

  return (
    <div className="card p-6">
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <form action={handleSubmit} className="space-y-6">
        {mode === "edit" && event && <input type="hidden" name="eventId" value={event.id} />}

        {/* Title + Slug */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
              Titre *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>
          <div>
            <label htmlFor="slug" className="mb-1 block text-sm font-medium text-gray-700">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={event?.description ?? ""}
            required
            rows={5}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
        </div>

        {/* Missions */}
        <div>
          <label htmlFor="missions" className="mb-1 block text-sm font-medium text-gray-700">
            Missions
          </label>
          <textarea
            id="missions"
            name="missions"
            defaultValue={event?.missions ?? ""}
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
        </div>

        {/* Location + Cover image */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="location" className="mb-1 block text-sm font-medium text-gray-700">
              Lieu
            </label>
            <input
              type="text"
              id="location"
              name="location"
              defaultValue={event?.location ?? ""}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>
          <div>
            <label htmlFor="coverImage" className="mb-1 block text-sm font-medium text-gray-700">
              Image de couverture (URL)
            </label>
            <input
              type="text"
              id="coverImage"
              name="coverImage"
              defaultValue={event?.coverImage ?? ""}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="startDate" className="mb-1 block text-sm font-medium text-gray-700">
              Date de debut
            </label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              defaultValue={event?.startDate?.slice(0, 16) ?? ""}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="mb-1 block text-sm font-medium text-gray-700">
              Date de fin
            </label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              defaultValue={event?.endDate?.slice(0, 16) ?? ""}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>
        </div>

        {/* Type + Status + Max volunteers */}
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="type" className="mb-1 block text-sm font-medium text-gray-700">
              Type *
            </label>
            <select
              id="type"
              name="type"
              defaultValue={event?.type ?? "PRESTATION"}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            >
              <option value="PRESTATION">Prestation</option>
              <option value="VIE_ASSOCIATIVE">Vie associative</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
              Statut *
            </label>
            <select
              id="status"
              name="status"
              defaultValue={event?.status ?? "BROUILLON"}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            >
              <option value="BROUILLON">Brouillon</option>
              <option value="PUBLIE">Publie</option>
              <option value="ARCHIVE">Archive</option>
            </select>
          </div>
          <div>
            <label htmlFor="maxVolunteers" className="mb-1 block text-sm font-medium text-gray-700">
              Capacite max
            </label>
            <input
              type="number"
              id="maxVolunteers"
              name="maxVolunteers"
              defaultValue={event?.maxVolunteers ?? ""}
              min={1}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>
        </div>

        {/* Inscription open */}
        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="inscriptionOpen"
              value="true"
              defaultChecked={event?.inscriptionOpen ?? false}
              className="h-4 w-4 rounded border-gray-300 text-brand-red focus:ring-brand-red"
            />
            <span className="text-sm font-medium text-gray-700">Inscriptions ouvertes</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/evenements")}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button type="submit" disabled={isPending} className="btn-primary">
            {isPending
              ? "Enregistrement..."
              : mode === "create"
                ? "Creer l'evenement"
                : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
};
