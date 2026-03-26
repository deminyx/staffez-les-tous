"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/components/features/CartContext";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  productTitle: string;
  image: string | null;
  priceMember: number;
  variants: Array<{ id: string; label: string; stock: number }>;
}

export const AddToCartButton = ({
  productTitle,
  image,
  priceMember,
  variants,
}: AddToCartButtonProps) => {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(
    variants.find((v) => v.stock > 0)?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = variants.find((v) => v.id === selectedVariant);

  const handleAdd = () => {
    if (!variant || variant.stock === 0) return;

    addItem({
      variantId: variant.id,
      productTitle,
      variantLabel: variant.label,
      quantity,
      unitPrice: priceMember,
      image,
      stock: variant.stock,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Variant selector */}
      {variants.length > 1 && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600">Variante</label>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedVariant(v.id);
                  setQuantity(1);
                }}
                disabled={v.stock === 0}
                className={cn(
                  "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                  selectedVariant === v.id
                    ? "border-brand-red bg-brand-red/10 text-brand-red"
                    : v.stock === 0
                      ? "cursor-not-allowed border-gray-100 text-gray-400 line-through"
                      : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-brand-black",
                )}
              >
                {v.label}
                {v.stock === 0 && " (epuise)"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      {variant && variant.stock > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600">Quantite</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-brand-black hover:bg-gray-50"
            >
              -
            </button>
            <span className="w-8 text-center text-brand-black">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(variant.stock, quantity + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-brand-black hover:bg-gray-50"
            >
              +
            </button>
            <span className="text-xs text-gray-500">max {variant.stock}</span>
          </div>
        </div>
      )}

      {/* Add button */}
      <button
        onClick={handleAdd}
        disabled={!variant || variant.stock === 0}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all",
          added
            ? "bg-green-600 text-white"
            : "bg-brand-red text-white hover:bg-brand-red-vivid disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <ShoppingCart className="h-5 w-5" aria-hidden="true" />
        {added ? "Ajoute au panier !" : "Ajouter au panier"}
      </button>
    </div>
  );
};
