"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";

import { toggleIdeaLike } from "@/app/espace-membre/vie-associative/actions";
import { cn } from "@/lib/utils";

interface IdeaCardProps {
  idea: {
    id: string;
    title: string;
    description: string;
    authorName: string;
    likeCount: number;
    isLiked: boolean;
    createdAt: string;
  };
}

export const IdeaCard = ({ idea }: IdeaCardProps) => {
  const [isLiked, setIsLiked] = useState(idea.isLiked);
  const [likeCount, setLikeCount] = useState(idea.likeCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.set("ideaId", idea.id);

    const result = await toggleIdeaLike(formData);

    if (result.success) {
      if (isLiked) {
        setLikeCount((c) => c - 1);
      } else {
        setLikeCount((c) => c + 1);
      }
      setIsLiked(!isLiked);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-surface-dark p-6">
      {/* Vote button */}
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={cn(
          "flex shrink-0 flex-col items-center gap-1 rounded-lg p-2 transition-all",
          isLiked
            ? "bg-brand-red/20 text-brand-red"
            : "bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white",
          isLoading && "opacity-50",
        )}
        aria-label={isLiked ? "Retirer le vote" : "Voter pour cette idee"}
      >
        <ThumbsUp className={cn("h-5 w-5", isLiked && "fill-current")} />
        <span className="text-xs font-bold">{likeCount}</span>
      </button>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
          {idea.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-300">{idea.description}</p>
        <p className="mt-2 text-xs text-gray-500">
          Par {idea.authorName} —{" "}
          {new Date(idea.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
          })}
        </p>
      </div>
    </div>
  );
};
