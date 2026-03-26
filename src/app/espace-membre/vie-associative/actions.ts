"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { votePollSchema, submitIdeaSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

interface ActionResult {
  success: boolean;
  error?: string;
}

// ─── INSCRIPTION SORTIE ───────────────────────────────────

export async function toggleSortieInscription(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Vous devez etre connecte." };
    }

    const eventId = formData.get("eventId") as string;
    if (!eventId) {
      return { success: false, error: "Identifiant de la sortie manquant." };
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        type: true,
        status: true,
        inscriptionOpen: true,
        maxVolunteers: true,
        _count: { select: { inscriptions: true } },
      },
    });

    if (!event || event.type !== "VIE_ASSOCIATIVE" || event.status !== "PUBLIE") {
      return { success: false, error: "Sortie introuvable ou indisponible." };
    }

    // Verifier si deja inscrit
    const existing = await prisma.inscription.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId,
        },
      },
    });

    if (existing) {
      // Desinscription
      await prisma.inscription.delete({ where: { id: existing.id } });
    } else {
      // Inscription
      if (!event.inscriptionOpen) {
        return { success: false, error: "Les inscriptions sont fermees." };
      }
      if (event.maxVolunteers && event._count.inscriptions >= event.maxVolunteers) {
        return { success: false, error: "Cette sortie est complete." };
      }
      await prisma.inscription.create({
        data: {
          userId: session.user.id,
          eventId,
          status: "VALIDEE",
        },
      });
    }

    revalidatePath("/espace-membre/vie-associative");
    revalidatePath("/espace-membre/vie-associative/sorties");
    return { success: true };
  } catch (error) {
    console.error("Erreur inscription sortie:", error);
    return { success: false, error: "Une erreur est survenue." };
  }
}

// ─── VOTE SONDAGE ─────────────────────────────────────────

export async function votePoll(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Vous devez etre connecte." };
    }

    const rawData = { optionId: formData.get("optionId") as string };
    const parsed = votePollSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Donnees invalides." };
    }

    const option = await prisma.pollOption.findUnique({
      where: { id: parsed.data.optionId },
      include: { poll: { select: { id: true, closesAt: true } } },
    });

    if (!option) {
      return { success: false, error: "Option introuvable." };
    }

    if (new Date() > new Date(option.poll.closesAt)) {
      return { success: false, error: "Ce sondage est cloture." };
    }

    // Verifier si deja vote dans ce sondage (pas juste cette option)
    const allOptionIds = await prisma.pollOption.findMany({
      where: { pollId: option.poll.id },
      select: { id: true },
    });

    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: session.user.id,
        optionId: { in: allOptionIds.map((o) => o.id) },
      },
    });

    if (existingVote) {
      return { success: false, error: "Vous avez deja vote pour ce sondage." };
    }

    await prisma.vote.create({
      data: {
        userId: session.user.id,
        optionId: parsed.data.optionId,
      },
    });

    revalidatePath("/espace-membre/vie-associative");
    revalidatePath("/espace-membre/vie-associative/sondages");
    return { success: true };
  } catch (error) {
    console.error("Erreur vote sondage:", error);
    return { success: false, error: "Une erreur est survenue." };
  }
}

// ─── SOUMETTRE UNE IDEE ──────────────────────────────────

export async function submitIdea(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Vous devez etre connecte." };
    }

    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    };

    const parsed = submitIdeaSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Donnees invalides." };
    }

    await prisma.idea.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        authorId: session.user.id,
        isApproved: false,
      },
    });

    revalidatePath("/espace-membre/vie-associative");
    revalidatePath("/espace-membre/vie-associative/idees");
    return { success: true };
  } catch (error) {
    console.error("Erreur soumission idee:", error);
    return { success: false, error: "Une erreur est survenue." };
  }
}

// ─── LIKER UNE IDEE ──────────────────────────────────────

export async function toggleIdeaLike(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Vous devez etre connecte." };
    }

    const ideaId = formData.get("ideaId") as string;
    if (!ideaId) {
      return { success: false, error: "Identifiant de l'idee manquant." };
    }

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      select: { id: true, isApproved: true },
    });

    if (!idea || !idea.isApproved) {
      return { success: false, error: "Idee introuvable." };
    }

    const existing = await prisma.ideaLike.findUnique({
      where: {
        userId_ideaId: {
          userId: session.user.id,
          ideaId,
        },
      },
    });

    if (existing) {
      await prisma.ideaLike.delete({ where: { id: existing.id } });
    } else {
      await prisma.ideaLike.create({
        data: {
          userId: session.user.id,
          ideaId,
        },
      });
    }

    revalidatePath("/espace-membre/vie-associative");
    revalidatePath("/espace-membre/vie-associative/idees");
    return { success: true };
  } catch (error) {
    console.error("Erreur like idee:", error);
    return { success: false, error: "Une erreur est survenue." };
  }
}
