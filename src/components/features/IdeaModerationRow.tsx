"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

import { toggleIdeaApproval } from "@/app/admin/boutique-vie-asso-actions";
import { cn } from "@/lib/utils";

interface IdeaModerationRowProps {
  id: string;
  title: string;
  description: string;
  authorName: string;
  likeCount: number;
  isApproved: boolean;
  createdAt: string;
}

export const IdeaModerationRow = ({
  id,
  title,
  description,
  authorName,
  likeCount,
  isApproved: initialApproved,
  createdAt,
}: IdeaModerationRowProps) => {
  const [isApproved, setIsApproved] = useState(initialApproved);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("ideaId", id);

    const result = await toggleIdeaApproval(formData);

    if (result.success) {
      setIsApproved(!isApproved);
    } else {
      setError(result.error ?? "Erreur");
    }

    setIsLoading(false);
  };

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-xl border bg-white p-4",
        isApproved ? "border-green-200" : "border-yellow-200",
      )}
    >
      <div className="flex-1">
        <h4 className="text-sm font-bold text-brand-black">{title}</h4>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
        <p className="mt-2 text-xs text-gray-500">
          Par {authorName} — {new Date(createdAt).toLocaleDateString("fr-FR")} — {likeCount} vote
          {likeCount > 1 ? "s" : ""}
        </p>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>

      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          "flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
          isApproved
            ? "bg-red-50 text-red-500 hover:bg-red-100"
            : "bg-green-50 text-green-600 hover:bg-green-100",
          isLoading && "opacity-50",
        )}
      >
        {isApproved ? (
          <>
            <X className="h-3.5 w-3.5" /> Masquer
          </>
        ) : (
          <>
            <Check className="h-3.5 w-3.5" /> Approuver
          </>
        )}
      </button>
    </div>
  );
};
