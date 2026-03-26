"use client";

import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";

import { useCart } from "@/components/features/CartContext";
import { placeOrder } from "@/app/espace-membre/boutique/actions";
import { useState } from "react";

export default function PanierPage() {
  const { items, removeItem, updateQuantity, clearCart, totalCents, itemCount } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleOrder = async () => {
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.set(
      "items",
      JSON.stringify(items.map((i) => ({ variantId: i.variantId, quantity: i.quantity }))),
    );

    const result = await placeOrder(formData);

    if (result.success) {
      clearCart();
      setSuccess(
        result.orderNumber
          ? `Commande ${result.orderNumber} enregistree ! Vous serez contacte pour le paiement.`
          : "Commande enregistree !",
      );
    } else {
      setError(result.error ?? "Une erreur est survenue.");
    }

    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <ShoppingBag className="h-8 w-8 text-green-400" />
        </div>
        <h1 className="font-display text-xl font-bold uppercase text-white">Commande confirmee</h1>
        <p className="mt-2 max-w-md text-center text-gray-400">{success}</p>
        <Link
          href="/espace-membre/boutique"
          className="mt-6 rounded-lg bg-brand-red px-6 py-2 text-sm font-bold text-white hover:bg-brand-red-vivid"
        >
          Retour a la boutique
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl font-black uppercase tracking-wider text-white">
        Mon panier
      </h1>

      {items.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-surface-dark p-12 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-400">Votre panier est vide.</p>
          <Link
            href="/espace-membre/boutique"
            className="mt-4 inline-block rounded-lg bg-brand-red px-6 py-2 text-sm font-bold text-white hover:bg-brand-red-vivid"
          >
            Parcourir la boutique
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart items */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-surface-dark p-4"
              >
                {/* Image */}
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white/5">
                  {item.image ? (
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="font-display text-lg text-white/20">S</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">{item.productTitle}</h3>
                  <p className="text-xs text-gray-500">{item.variantLabel}</p>
                  <p className="mt-1 text-sm font-bold text-brand-red">
                    {(item.unitPrice / 100).toFixed(2)} &euro;
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded border border-white/10 text-sm text-white hover:bg-white/5"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-sm text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded border border-white/10 text-sm text-white hover:bg-white/5"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal + remove */}
                <div className="text-right">
                  <p className="text-sm font-bold text-white">
                    {((item.unitPrice * item.quantity) / 100).toFixed(2)} &euro;
                  </p>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="mt-1 text-gray-500 hover:text-red-400"
                    aria-label={`Retirer ${item.productTitle}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="rounded-xl border border-white/10 bg-surface-dark p-6">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Recapitulatif
            </h2>
            <div className="mt-4 space-y-2 border-b border-white/10 pb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  {itemCount} article{itemCount > 1 ? "s" : ""}
                </span>
                <span className="text-white">{(totalCents / 100).toFixed(2)} &euro;</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-lg font-bold">
              <span className="text-white">Total</span>
              <span className="text-brand-red">{(totalCents / 100).toFixed(2)} &euro;</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Paiement en mains propres ou par virement. Vous serez contacte apres validation.
            </p>

            {error && (
              <div className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
            )}

            <button
              onClick={handleOrder}
              disabled={isSubmitting}
              className="mt-6 w-full rounded-lg bg-brand-red py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-red-vivid disabled:opacity-50"
            >
              {isSubmitting ? "Validation..." : "Confirmer la commande"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
