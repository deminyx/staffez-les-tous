"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { createProduct, updateProduct } from "@/app/admin/boutique-vie-asso-actions";

interface Variant {
  id?: string;
  label: string;
  stock: number;
}

interface ProductFormProps {
  productId?: string;
  defaultValues?: {
    title: string;
    slug: string;
    description: string;
    image: string;
    priceMember: number;
    pricePublic: number | null;
    isAvailable: boolean;
    variants: Variant[];
  };
}

export const ProductForm = ({ productId, defaultValues }: ProductFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variants, setVariants] = useState<Variant[]>(
    defaultValues?.variants ?? [{ label: "Taille unique", stock: 0 }],
  );

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("variants", JSON.stringify(variants));
    formData.set("isAvailable", formData.get("isAvailable") ? "true" : "false");

    if (productId) {
      formData.set("productId", productId);
    }

    const action = productId ? updateProduct : createProduct;
    const result = await action(formData);

    if (result.success) {
      router.push("/admin/boutique/articles");
    } else {
      setError(result.error ?? "Erreur");
      setIsSubmitting(false);
    }
  };

  const addVariant = () => {
    setVariants([...variants, { label: "", stock: 0 }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    setVariants(variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="rounded-xl border border-white/10 bg-surface-dark p-6">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-300">
              Titre
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={defaultValues?.title}
              onChange={(e) => {
                if (!productId) {
                  const slugInput = document.getElementById("slug") as HTMLInputElement;
                  if (slugInput) slugInput.value = generateSlug(e.target.value);
                }
              }}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-gray-600 focus:border-brand-red focus:outline-none"
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="mb-1 block text-sm font-medium text-gray-300">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              defaultValue={defaultValues?.slug}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-gray-600 focus:border-brand-red focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              defaultValue={defaultValues?.description}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-gray-600 focus:border-brand-red focus:outline-none"
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image" className="mb-1 block text-sm font-medium text-gray-300">
              URL de l&apos;image
            </label>
            <input
              id="image"
              name="image"
              type="text"
              defaultValue={defaultValues?.image}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-gray-600 focus:border-brand-red focus:outline-none"
            />
          </div>

          {/* Prices */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="priceMember" className="mb-1 block text-sm font-medium text-gray-300">
                Prix adherent (centimes)
              </label>
              <input
                id="priceMember"
                name="priceMember"
                type="number"
                min="0"
                required
                defaultValue={defaultValues?.priceMember ?? 0}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-brand-red focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="pricePublic" className="mb-1 block text-sm font-medium text-gray-300">
                Prix public (centimes, optionnel)
              </label>
              <input
                id="pricePublic"
                name="pricePublic"
                type="number"
                min="0"
                defaultValue={defaultValues?.pricePublic ?? ""}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-brand-red focus:outline-none"
              />
            </div>
          </div>

          {/* Disponible */}
          <div className="flex items-center gap-2">
            <input
              id="isAvailable"
              name="isAvailable"
              type="checkbox"
              defaultChecked={defaultValues?.isAvailable ?? true}
              className="h-4 w-4 rounded border-white/10 bg-white/5 text-brand-red focus:ring-brand-red"
            />
            <label htmlFor="isAvailable" className="text-sm text-gray-300">
              Article disponible a la vente
            </label>
          </div>

          {/* Variants */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">Variantes</label>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1 text-xs text-brand-red hover:underline"
              >
                <Plus className="h-3 w-3" /> Ajouter
              </button>
            </div>
            <div className="space-y-2">
              {variants.map((variant, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Label (ex: S, M, L)"
                    value={variant.label}
                    onChange={(e) => updateVariant(index, "label", e.target.value)}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value) || 0)}
                    className="w-24 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-gray-500 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-brand-red px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-red-vivid disabled:opacity-50"
          >
            {isSubmitting ? "Enregistrement..." : productId ? "Mettre a jour" : "Creer l'article"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/boutique/articles")}
            className="rounded-lg bg-white/5 px-6 py-2 text-sm text-gray-400 transition-colors hover:bg-white/10"
          >
            Annuler
          </button>
        </div>
      </div>
    </form>
  );
};
