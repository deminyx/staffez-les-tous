"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema, createInscriptionSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

// ─── Types de retour ──────────────────────────────────────

interface ActionResult {
  success: boolean;
  error?: string;
}

// ─── PROFIL ───────────────────────────────────────────────

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Vous devez etre connecte." };
    }

    const rawData = {
      phone: formData.get("phone") as string,
      bio: formData.get("bio") as string,
      allergies: formData.get("allergies") as string,
    };

    const parsed = updateProfileSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Donnees invalides.";
      return { success: false, error: firstError };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        phone: parsed.data.phone || null,
        bio: parsed.data.bio || null,
        allergies: parsed.data.allergies || null,
      },
    });

    revalidatePath("/espace-membre/profil");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise a jour du profil:", error);
    return { success: false, error: "Une erreur est survenue. Veuillez reessayer." };
  }
}

// ─── INSCRIPTIONS ─────────────────────────────────────────

export async function createInscription(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Vous devez etre connecte." };
    }

    const rawData = {
      eventId: formData.get("eventId") as string,
      notes: formData.get("notes") as string,
    };

    const parsed = createInscriptionSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Donnees invalides.";
      return { success: false, error: firstError };
    }

    // Verifier que l'evenement existe et que les inscriptions sont ouvertes
    const event = await prisma.event.findUnique({
      where: { id: parsed.data.eventId },
      select: {
        id: true,
        inscriptionOpen: true,
        maxVolunteers: true,
        status: true,
        _count: { select: { inscriptions: true } },
      },
    });

    if (!event) {
      return { success: false, error: "Evenement introuvable." };
    }

    if (event.status !== "PUBLIE") {
      return { success: false, error: "Cet evenement n'est pas disponible." };
    }

    if (!event.inscriptionOpen) {
      return { success: false, error: "Les inscriptions sont fermees pour cet evenement." };
    }

    if (event.maxVolunteers !== null && event._count.inscriptions >= event.maxVolunteers) {
      return { success: false, error: "Cet evenement est complet." };
    }

    // Verifier que l'utilisateur n'est pas deja inscrit
    const existing = await prisma.inscription.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: parsed.data.eventId,
        },
      },
    });

    if (existing) {
      return { success: false, error: "Vous etes deja inscrit a cet evenement." };
    }

    await prisma.inscription.create({
      data: {
        userId: session.user.id,
        eventId: parsed.data.eventId,
        notes: parsed.data.notes || null,
        status: "EN_ATTENTE",
      },
    });

    revalidatePath("/espace-membre/calendrier");
    revalidatePath("/espace-membre/inscriptions");
    revalidatePath(`/espace-membre/evenements`);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return { success: false, error: "Une erreur est survenue. Veuillez reessayer." };
  }
}

export async function cancelInscription(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Vous devez etre connecte." };
    }

    const inscriptionId = formData.get("inscriptionId") as string;
    if (!inscriptionId) {
      return { success: false, error: "Identifiant d'inscription manquant." };
    }

    // Verifier que l'inscription appartient a l'utilisateur et est annulable
    const inscription = await prisma.inscription.findUnique({
      where: { id: inscriptionId },
      select: {
        id: true,
        userId: true,
        status: true,
      },
    });

    if (!inscription) {
      return { success: false, error: "Inscription introuvable." };
    }

    if (inscription.userId !== session.user.id) {
      return { success: false, error: "Vous ne pouvez pas annuler cette inscription." };
    }

    if (inscription.status === "VALIDEE") {
      return {
        success: false,
        error: "Impossible d'annuler une inscription validee. Contactez un coordinateur.",
      };
    }

    if (inscription.status === "REFUSEE") {
      return { success: false, error: "Cette inscription a deja ete refusee." };
    }

    // Supprimer l'inscription (EN_ATTENTE uniquement)
    await prisma.inscription.delete({
      where: { id: inscriptionId },
    });

    revalidatePath("/espace-membre/calendrier");
    revalidatePath("/espace-membre/inscriptions");
    revalidatePath(`/espace-membre/evenements`);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'annulation:", error);
    return { success: false, error: "Une erreur est survenue. Veuillez reessayer." };
  }
}
