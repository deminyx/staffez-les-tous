"use client";

import { useState } from "react";
import { Clock } from "lucide-react";

import { votePoll } from "@/app/espace-membre/vie-associative/actions";
import { cn } from "@/lib/utils";

import type { PollSummary } from "@/types";

interface PollCardProps {
  poll: PollSummary;
}

export const PollCard = ({ poll }: PollCardProps) => {
  const [hasVoted, setHasVoted] = useState(poll.hasVoted);
  const [options, setOptions] = useState(poll.options);
  const [totalVotes, setTotalVotes] = useState(poll.totalVotes);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showResults = hasVoted || poll.isClosed;

  const handleVote = async (optionId: string) => {
    if (hasVoted || poll.isClosed) return;
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("optionId", optionId);

    const result = await votePoll(formData);

    if (result.success) {
      setHasVoted(true);
      setTotalVotes((t) => t + 1);
      setOptions((prev) =>
        prev.map((o) =>
          o.id === optionId ? { ...o, voteCount: o.voteCount + 1, isSelected: true } : o,
        ),
      );
    } else {
      setError(result.error ?? "Erreur");
    }

    setIsLoading(false);
  };

  const closesAt = new Date(poll.closesAt);
  const formatDate = (d: Date) =>
    d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-brand-black">
          {poll.question}
        </h3>
        <span
          className={cn(
            "flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
            poll.isClosed ? "bg-gray-100 text-gray-500" : "bg-green-50 text-green-600",
          )}
        >
          <Clock className="h-3 w-3" aria-hidden="true" />
          {poll.isClosed ? "Cloture" : `Jusqu'au ${formatDate(closesAt)}`}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {options.map((option) => {
          const pct = totalVotes > 0 ? Math.round((option.voteCount / totalVotes) * 100) : 0;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted || poll.isClosed || isLoading}
              className={cn(
                "relative w-full overflow-hidden rounded-lg border p-3 text-left text-sm transition-all",
                option.isSelected
                  ? "border-brand-red bg-brand-red/10 text-brand-black"
                  : showResults
                    ? "border-gray-100 text-gray-600"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:text-brand-black",
                (hasVoted || poll.isClosed) && "cursor-default",
              )}
            >
              {showResults && (
                <div className="absolute inset-0 bg-gray-50" style={{ width: `${pct}%` }} />
              )}
              <span className="relative flex items-center justify-between">
                <span>{option.label}</span>
                {showResults && (
                  <span className="text-xs text-gray-500">
                    {option.voteCount} ({pct}%)
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      <p className="mt-3 text-xs text-gray-500">
        {totalVotes} vote{totalVotes > 1 ? "s" : ""}
      </p>
    </div>
  );
};
