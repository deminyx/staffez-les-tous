"use client";

import { useState } from "react";

import { updateOrderStatus } from "@/app/admin/boutique-vie-asso-actions";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import type { OrderStatus } from "@/types";

interface OrderRowProps {
  orderId: string;
  currentStatus: OrderStatus;
}

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  EN_ATTENTE: ["PAYEE", "ANNULEE"],
  PAYEE: ["LIVREE", "ANNULEE"],
  LIVREE: [],
  ANNULEE: [],
};

export const OrderRow = ({ orderId, currentStatus }: OrderRowProps) => {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const possibleTransitions = STATUS_TRANSITIONS[status];

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("orderId", orderId);
    formData.set("status", newStatus);

    const result = await updateOrderStatus(formData);

    if (result.success) {
      setStatus(newStatus);
    } else {
      setError(result.error ?? "Erreur");
    }

    setIsLoading(false);
  };

  if (possibleTransitions.length === 0) return null;

  return (
    <div className="mt-4 border-t border-white/5 pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500">Changer le statut :</span>
        {possibleTransitions.map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            disabled={isLoading}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              s === "ANNULEE"
                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                : "bg-white/5 text-gray-300 hover:bg-white/10",
              isLoading && "opacity-50",
            )}
          >
            {ORDER_STATUS_LABELS[s]}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
};
