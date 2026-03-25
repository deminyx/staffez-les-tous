"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createPublication, updatePublication, submitPublication } from "@/app/admin/actions";

interface PublicationData {
  id: string;
  title: string;
  content: string;
  category: string;
  coverImage: string | null;
  status: string;
  authorId: string;
}

interface PublicationFormProps {
  mode: "create" | "edit";
  publication?: PublicationData;
  currentUserId: string;
}

export const PublicationForm = ({
  mode,
  publication,
  currentUserId: _currentUserId,
}: PublicationFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canEdit = mode === "create" || (publication && publication.status !== "APPROUVEE");

  const canSubmit =
    mode === "edit" &&
    publication &&
    (publication.status === "BROUILLON" || publication.status === "REJETEE");

  const handleSubmitForm = (formData: FormData) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const action = mode === "create" ? createPublication : updatePublication;
      const result = await action(formData);
      if (!result.success) {
        setError(result.error ?? "Erreur inconnue.");
      } else {
        if (mode === "create") {
          router.push("/admin/publications");
        } else {
          setSuccess("Publication enregistree.");
        }
      }
    });
  };

  const handleSubmitForValidation = () => {
    if (!publication) return;
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.set("publicationId", publication.id);

    startTransition(async () => {
      const result = await submitPublication(formData);
      if (!result.success) {
        setError(result.error ?? "Erreur inconnue.");
      } else {
        setSuccess("Publication soumise pour validation.");
      }
    });
  };

  return (
    <div className="card p-6">
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</div>
      )}

      <form action={handleSubmitForm} className="space-y-6">
        {mode === "edit" && publication && (
          <input type="hidden" name="publicationId" value={publication.id} />
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
            Titre *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={publication?.title ?? ""}
            required
            disabled={!canEdit}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
            Categorie *
          </label>
          <select
            id="category"
            name="category"
            defaultValue={publication?.category ?? "ACTUALITE"}
            disabled={!canEdit}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red disabled:bg-gray-50 disabled:text-gray-500"
          >
            <option value="ACTUALITE">Actualite</option>
            <option value="NEWSLETTER">Newsletter</option>
            <option value="ANNONCE_EVENEMENT">Annonce evenement</option>
          </select>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="mb-1 block text-sm font-medium text-gray-700">
            Contenu *
          </label>
          <textarea
            id="content"
            name="content"
            defaultValue={publication?.content ?? ""}
            required
            rows={10}
            disabled={!canEdit}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        {/* Cover image */}
        <div>
          <label htmlFor="coverImage" className="mb-1 block text-sm font-medium text-gray-700">
            Image de couverture (URL)
          </label>
          <input
            type="text"
            id="coverImage"
            name="coverImage"
            defaultValue={publication?.coverImage ?? ""}
            disabled={!canEdit}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/publications")}
            className="btn-secondary"
          >
            Retour
          </button>
          {canEdit && (
            <button type="submit" disabled={isPending} className="btn-primary">
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </button>
          )}
          {canSubmit && (
            <button
              type="button"
              onClick={handleSubmitForValidation}
              disabled={isPending}
              className="btn-dark"
            >
              {isPending ? "Soumission..." : "Soumettre pour validation"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
