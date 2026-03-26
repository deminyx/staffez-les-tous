"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { placeOrderSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

// ─── Types de retour ──────────────────────────────────────

interface ActionResult {
  success: boolean;
  error?: string;
  orderNumber?: string;
}

// ─── PASSER COMMANDE ──────────────────────────────────────

export async function placeOrder(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Vous devez etre connecte." };
    }

    const itemsJson = formData.get("items") as string;
    let items: Array<{ variantId: string; quantity: number }>;
    try {
      items = JSON.parse(itemsJson);
    } catch {
      return { success: false, error: "Donnees du panier invalides." };
    }

    const parsed = placeOrderSchema.safeParse({ items });
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Donnees invalides.";
      return { success: false, error: firstError };
    }

    // Recuperer toutes les variantes avec prix
    const variantIds = parsed.data.items.map((i) => i.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: { select: { priceMember: true, isAvailable: true } } },
    });

    if (variants.length !== variantIds.length) {
      return { success: false, error: "Un ou plusieurs articles sont introuvables." };
    }

    // Verifier stock et disponibilite
    for (const item of parsed.data.items) {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) {
        return { success: false, error: "Article introuvable." };
      }
      if (!variant.product.isAvailable) {
        return { success: false, error: "Un article n'est plus disponible." };
      }
      if (variant.stock < item.quantity) {
        return {
          success: false,
          error: `Stock insuffisant pour "${variant.label}" (${variant.stock} restant${variant.stock > 1 ? "s" : ""}).`,
        };
      }
    }

    // Calculer le total
    let totalCents = 0;
    const orderItemsData = parsed.data.items.map((item) => {
      const variant = variants.find((v) => v.id === item.variantId)!;
      const unitPrice = variant.product.priceMember;
      totalCents += unitPrice * item.quantity;
      return {
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice,
      };
    });

    // Generer un numero de commande unique
    const orderNumber = `CMD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Transaction: creer commande + decrementer stocks
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          totalCents,
          status: "EN_ATTENTE",
          items: {
            create: orderItemsData,
          },
        },
      });

      // Decrementer les stocks
      for (const item of parsed.data.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return order;
    });

    revalidatePath("/espace-membre/boutique");
    revalidatePath("/admin/boutique/commandes");
    return { success: true, orderNumber };
  } catch (error) {
    console.error("Erreur lors de la commande:", error);
    return { success: false, error: "Une erreur est survenue. Veuillez reessayer." };
  }
}
