"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireRole, requireAuth } from "@/lib/permissions";
import { logAuditAction } from "@/services/audit";
import { productFormSchema, updateOrderStatusSchema, createPollSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

import type { Prisma } from "@prisma/client";

interface ActionResult {
  success: boolean;
  error?: string;
}

// ─── GESTION DES ARTICLES ────────────────────────────────

export async function createProduct(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    requireAuth(session);
    requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

    const rawData = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      priceMember: Number(formData.get("priceMember")),
      pricePublic: formData.get("pricePublic") ? Number(formData.get("pricePublic")) : null,
      isAvailable: formData.get("isAvailable") === "true",
      variants: JSON.parse((formData.get("variants") as string) || "[]"),
    };

    const parsed = productFormSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Donnees invalides." };
    }

    const existing = await prisma.product.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) {
      return { success: false, error: "Un article avec ce slug existe deja." };
    }

    await prisma.product.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description,
        image: parsed.data.image || null,
        priceMember: parsed.data.priceMember,
        pricePublic: parsed.data.pricePublic ?? null,
        isAvailable: parsed.data.isAvailable ?? true,
        variants: {
          create: parsed.data.variants.map((v) => ({
            label: v.label,
            stock: v.stock,
          })),
        },
      },
    });

    await logAuditAction({
      userId: session.user.id,
      action: "CREATE_PRODUCT",
      target: `product:${parsed.data.slug}`,
    });

    revalidatePath("/admin/boutique/articles");
    revalidatePath("/espace-membre/boutique");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Acces non autorise.") {
      return { success: false, error: "Acces non autorise." };
    }
    console.error("Erreur creation article:", error);
    return { success: false, error: "Une erreur est survenue." };
  }
}

export async function updateProduct(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    requireAuth(session);
    requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

    const productId = formData.get("productId") as string;
    if (!productId) {
      return { success: false, error: "Identifiant de l'article manquant." };
    }

    const rawData = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      priceMember: Number(formData.get("priceMember")),
      pricePublic: formData.get("pricePublic") ? Number(formData.get("pricePublic")) : null,
      isAvailable: formData.get("isAvailable") === "true",
      variants: JSON.parse((formData.get("variants") as string) || "[]"),
    };

    const parsed = productFormSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Donnees invalides." };
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, slug: true },
    });
    if (!product) {
      return { success: false, error: "Article introuvable." };
    }

    if (parsed.data.slug !== product.slug) {
      const slugExists = await prisma.product.findUnique({ where: { slug: parsed.data.slug } });
      if (slugExists) {
        return { success: false, error: "Un article avec ce slug existe deja." };
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: productId },
        data: {
          title: parsed.data.title,
          slug: parsed.data.slug,
          description: parsed.data.description,
          image: parsed.data.image || null,
          priceMember: parsed.data.priceMember,
          pricePublic: parsed.data.pricePublic ?? null,
          isAvailable: parsed.data.isAvailable ?? true,
        },
      });

      // Update variants: delete existing (without orders) and recreate
      // For simplicity: update existing by id, create new ones
      const existingVariants = await tx.productVariant.findMany({
        where: { productId },
        include: { _count: { select: { orderItems: true } } },
      });

      for (const variant of parsed.data.variants) {
        if (variant.id) {
          await tx.productVariant.update({
            where: { id: variant.id },
            data: { label: variant.label, stock: variant.stock },
          });
        } else {
          await tx.productVariant.create({
            data: { productId, label: variant.label, stock: variant.stock },
          });
        }
      }

      // Delete variants not in the new list (only if no orders reference them)
      const newVariantIds = parsed.data.variants.filter((v) => v.id).map((v) => v.id);
      for (const existing of existingVariants) {
        if (!newVariantIds.includes(existing.id) && existing._count.orderItems === 0) {
          await tx.productVariant.delete({ where: { id: existing.id } });
        }
      }
    });

    await logAuditAction({
      userId: session.user.id,
      action: "UPDATE_PRODUCT",
      target: `product:${parsed.data.slug}`,
    });

    revalidatePath("/admin/boutique/articles");
    revalidatePath("/espace-membre/boutique");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Acces non autorise.") {
      return { success: false, error: "Acces non autorise." };
    }
    console.error("Erreur modification article:", error);
    return { success: false, error: "Une erreur est survenue." };
  }
}

// ─── GESTION DES COMMANDES ───────────────────────────────

export async function updateOrderStatus(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    requireAuth(session);
    requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

    const rawData = {
      orderId: formData.get("orderId") as string,
      status: formData.get("status") as string,
    };

    const parsed = updateOrderStatusSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Donnees invalides." };
    }

    const order = await prisma.order.findUnique({
      where: { id: parsed.data.orderId },
      select: { id: true, orderNumber: true, status: true },
    });

    if (!order) {
      return { success: false, error: "Commande introuvable." };
    }

    // Si on annule, remettre le stock
    if (parsed.data.status === "ANNULEE" && order.status !== "ANNULEE") {
      const items = await prisma.orderItem.findMany({
        where: { orderId: order.id },
      });
      for (const item of items) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    await prisma.order.update({
      where: { id: parsed.data.orderId },
      data: {
        status: parsed.data.status as Prisma.EnumOrderStatusFieldUpdateOperationsInput["set"],
      },
    });

    await logAuditAction({
      userId: session.user.id,
      action: `UPDATE_ORDER_${parsed.data.status}`,
      target: `order:${order.orderNumber}`,
    });

    revalidatePath("/admin/boutique/commandes");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Acces non autorise.") {
      return { success: false, error: "Acces non autorise." };
    }
    console.error("Erreur mise a jour commande:", error);
    return { success: false, error: "Une erreur est survenue." };
  }
}

// ─── GESTION DES SONDAGES ────────────────────────────────

export async function createPoll(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    requireAuth(session);
    requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

    const rawData = {
      question: formData.get("question") as string,
      options: JSON.parse((formData.get("options") as string) || "[]"),
      closesAt: formData.get("closesAt") as string,
    };

    const parsed = createPollSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Donnees invalides." };
    }

    await prisma.poll.create({
      data: {
        question: parsed.data.question,
        closesAt: new Date(parsed.data.closesAt),
        options: {
          create: parsed.data.options.map((label) => ({ label })),
        },
      },
    });

    await logAuditAction({
      userId: session.user.id,
      action: "CREATE_POLL",
      target: `poll:${parsed.data.question.substring(0, 50)}`,
    });

    revalidatePath("/admin/vie-associative/sondages");
    revalidatePath("/espace-membre/vie-associative");
    revalidatePath("/espace-membre/vie-associative/sondages");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Acces non autorise.") {
      return { success: false, error: "Acces non autorise." };
    }
    console.error("Erreur creation sondage:", error);
    return { success: false, error: "Une erreur est survenue." };
  }
}

// ─── MODERATION DES IDEES ────────────────────────────────

export async function toggleIdeaApproval(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    requireAuth(session);
    requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

    const ideaId = formData.get("ideaId") as string;
    if (!ideaId) {
      return { success: false, error: "Identifiant de l'idee manquant." };
    }

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      select: { id: true, title: true, isApproved: true },
    });

    if (!idea) {
      return { success: false, error: "Idee introuvable." };
    }

    await prisma.idea.update({
      where: { id: ideaId },
      data: { isApproved: !idea.isApproved },
    });

    await logAuditAction({
      userId: session.user.id,
      action: idea.isApproved ? "HIDE_IDEA" : "APPROVE_IDEA",
      target: `idea:${idea.title}`,
    });

    revalidatePath("/admin/vie-associative/idees");
    revalidatePath("/espace-membre/vie-associative/idees");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Acces non autorise.") {
      return { success: false, error: "Acces non autorise." };
    }
    console.error("Erreur moderation idee:", error);
    return { success: false, error: "Une erreur est survenue." };
  }
}
