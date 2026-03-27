"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireRole, requireAuth } from "@/lib/permissions";
import { logAuditAction } from "@/services/audit";
import bcrypt from "bcryptjs";
import { generateUniqueUsername, generateSecurePassword } from "@/services/membres";
import {
  updateUserRolesSchema,
  toggleUserActiveSchema,
  eventFormSchema,
  publicationFormSchema,
  validatePublicationSchema,
  updateInscriptionStatusSchema,
  createMemberSchema,
  regeneratePasswordSchema,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";

import type { Role } from "@prisma/client";

// ─── Types de retour ──────────────────────────────────────

interface ActionResult {
  success: boolean;
  error?: string;
}

// ─── GESTION DES ROLES ───────────────────────────────────

export async function updateUserRoles(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    requireAuth(session);
    requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

    const userId = formData.get("userId") as string;
    const rolesJson = formData.get("roles") as string;

    let roles: Array<{ role: string; eventId?: string | null }>;
    try {
      roles = JSON.parse(rolesJson);
    } catch {
      return { success: false, error: "Donnees de roles invalides." };
    }

    const parsed = updateUserRolesSchema.safeParse({ userId, roles });
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Donnees invalides.";
      return { success: false, error: firstError };
    }

    // Verifier que l'utilisateur existe
    const targetUser = await prisma.user.findUnique({
      where: { id: parsed.data.userId },
      select: { id: true, username: true },
    });

    if (!targetUser) {
      return { success: false, error: "Utilisateur introuvable." };
    }

    // Verifier si on essaie d'ajouter le role DEVELOPPEUR
    const hasDeveloppeur = parsed.data.roles.some((r) => r.role === "DEVELOPPEUR");
    if (hasDeveloppeur) {
      // Seuls les developpeurs existants peuvent attribuer ce role
      requireRole(session, ["DEVELOPPEUR"]);
    }

    // Supprimer tous les roles existants puis recreer
    await prisma.$transaction(async (tx) => {
      await tx.userRole.deleteMany({
        where: { userId: parsed.data.userId },
      });

      if (parsed.data.roles.length > 0) {
        await tx.userRole.createMany({
          data: parsed.data.roles.map((r) => ({
            userId: parsed.data.userId,
            role: r.role as Role,
            eventId: r.eventId ?? null,
          })),
        });
      }
    });

    await logAuditAction({
      userId: session.user.id,
      action: "UPDATE_ROLES",
      target: `user:${targetUser.username}`,
      details: {
        roles: parsed.data.roles,
      } as unknown as import("@prisma/client").Prisma.InputJsonValue,
    });

    revalidatePath("/admin/utilisateurs");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Acces non autorise.") {
      return { success: false, error: "Acces non autorise." };
    }
    console.error("Erreur lors de la mise a jour des roles:", error);
    return { success: false, error: "Une erreur est survenue. Veuillez reessayer." };
  }
}

export async function toggleUserActive(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    requireAuth(session);
    requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

    const userId = formData.get("userId") as string;
    const isActive = formData.get("isActive") === "true";

    const parsed = toggleUserActiveSchema.safeParse({ userId, isActive });
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Donnees invalides.";
      return { success: false, error: firstError };
    }

    // Empecher de se desactiver soi-meme
    if (parsed.data.userId === session.user.id && !parsed.data.isActive) {
      return { success: false, error: "Vous ne pouvez pas desactiver votre propre compte." };
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: parsed.data.userId },
      select: { id: true, username: true },
    });

    if (!targetUser) {
      return { success: false, error: "Utilisateur introuvable." };
    }

    await prisma.user.update({
      where: { id: parsed.data.userId },
      data: { isActive: parsed.data.isActive },
    });

    await logAuditAction({
      userId: session.user.id,
      action: parsed.data.isActive ? "ACTIVATE_USER" : "DEACTIVATE_USER",
      target: `user:${targetUser.username}`,
    });

    revalidatePath("/admin/utilisateurs");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Acces non autorise.") {
      return { success: false, error: "Acces non autorise." };
    }
    console.error("Erreur lors de la modification du statut:", error);
    return { success: false, error: "Une erreur est survenue. Veuillez reessayer." };
  }
}

// ─── GESTION DES EVENEMENTS ──────────────────────────────

export async function createEvent(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    requireAuth(session);
    requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

    const rawData = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      missions: formData.get("missions") as string,
      location: formData.get("location") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as string,
      coverImage: formData.get("coverImage") as string,
      maxVolunteers: formData.get("maxVolunteers") ? Number(formData.get("maxVolunteers")) : null,
      inscriptionOpen: formData.get("inscriptionOpen") === "true",
    };

    const parsed = eventFormSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Donnees invalides.";
      return { success: false, error: firstError };
    }

    // Verifier unicite du slug
    const existing = await prisma.event.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (existing) {
      return { success: false, error: "Un evenement avec ce slug existe deja." };
    }

    await prisma.event.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description,
        missions: parsed.data.missions || null,
        location: parsed.data.location || null,
        startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
        type: parsed.data.type,
        status: parsed.data.status,
        coverImage: parsed.data.coverImage || null,
        maxVolunteers: parsed.data.maxVolunteers ?? null,
        inscriptionOpen: parsed.data.inscriptionOpen ?? false,
      },
    });

    await logAuditAction({
      userId: session.user.id,
      action: "CREATE_EVENT",
      target: `event:${parsed.data.slug}`,
    });

    revalidatePath("/admin/evenements");
    revalidatePath("/evenements");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Acces non autorise.") {
      return { success: false, error: "Acces non autorise." };
    }
    console.error("Erreur lors de la creation de l'evenement:", error);
    return { success: false, error: "Une erreur est survenue. Veuillez reessayer." };
  }
}

export async function updateEvent(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    requireAuth(session);
    requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

    const eventId = formData.get("eventId") as string;
    if (!eventId) {
      return { success: false, error: "Identifiant de l'evenement manquant." };
    }

    const rawData = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      missions: formData.get("missions") as string,
      location: formData.get("location") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as string,
      coverImage: formData.get("coverImage") as string,
      maxVolunteers: formData.get("maxVolunteers") ? Number(formData.get("maxVolunteers")) : null,
      inscriptionOpen: formData.get("inscriptionOpen") === "true",
    };

    const parsed = eventFormSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Donnees invalides.";
      return { success: false, error: firstError };
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, slug: true },
    });

    if (!event) {
      return { success: false, error: "Evenement introuvable." };
    }

    // Verifier unicite du slug si change
    if (parsed.data.slug !== event.slug) {
      const slugExists = await prisma.event.findUnique({
        where: { slug: parsed.data.slug },
      });
      if (slugExists) {
        return { success: false, error: "Un evenement avec ce slug existe deja." };
      }
    }

    await prisma.event.update({
      where: { id: eventId },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description,
        missions: parsed.data.missions || null,
        location: parsed.data.location || null,
        startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
        type: parsed.data.type,
        status: parsed.data.status,
        coverImage: parsed.data.coverImage || null,
        maxVolunteers: parsed.data.maxVolunteers ?? null,
        inscriptionOpen: parsed.data.inscriptionOpen ?? false,
      },
    });

    await logAuditAction({
      userId: session.user.id,
      action: "UPDATE_EVENT",
      target: `event:${parsed.data.slug}`,
    });

    revalidatePath("/admin/evenements");
    revalidatePath(`/admin/evenements/${parsed.data.slug}`);
    revalidatePath("/evenements");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Acces non autorise.") {
      return { success: false, error: "Acces non autorise." };
    }
    console.error("Erreur lors de la modification de l'evenement:", error);
    return { success: false, error: "Une erreur est survenue. Veuillez reessayer." };
  }
}

// ─── GESTION DES PUBLICATIONS ────────────────────────────

export async function createPublication(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    requireAuth(session);
    requireRole(session, ["EDITEUR", "ADMINISTRATEUR", "DEVELOPPEUR"]);

    const rawData = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      category: formData.get("category") as string,
      coverImage: formData.get("coverImage") as string,
    };

    const parsed = publicationFormSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Donnees invalides.";
      return { success: false, error: firstError };
    }

    await prisma.publication.create({
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        category: parsed.data.category,
        coverImage: parsed.data.coverImage || null,
        authorId: session.user.id,
        status: "BROUILLON",
      },
    });

    await logAuditAction({
      userId: session.user.id,
      action: "CREATE_PUBLICATION",
      target: `publication:${parsed.data.title}`,
    });

    revalidatePath("/admin/publications");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Acces non autorise.") {
      return { success: false, error: "Acces non autorise." };
    }
    console.error("Erreur lors de la creation de la publication:", error);
    return { success: false, error: "Une erreur est survenue. Veuillez reessayer." };
  }
}

export async function updatePublication(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    requireAuth(session);
    requireRole(session, ["EDITEUR", "ADMINISTRATEUR", "DEVELOPPEUR"]);

    const publicationId = formData.get("publicationId") as string;
    if (!publicationId) {
      return { success: false, error: "Identifiant de la publication manquant." };
    }

    const rawData = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      category: formData.get("category") as string,
      coverImage: formData.get("coverImage") as string,
    };

    const parsed = publicationFormSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Donnees invalides.";
      return { success: false, error: firstError };
    }

    const publication = await prisma.publication.findUnique({
      where: { id: publicationId },
      select: { id: true, authorId: true, status: true },
    });

    if (!publication) {
      return { success: false, error: "Publication introuvable." };
    }

    // Un editeur ne peut modifier que ses propres publications
    const isAdmin = session.user.roles?.some(
      (r: { role: string }) => r.role === "ADMINISTRATEUR" || r.role === "DEVELOPPEUR",
    );
    if (!isAdmin && publication.authorId !== session.user.id) {
      return { success: false, error: "Vous ne pouvez modifier que vos propres publications." };
    }

    // On ne peut pas modifier une publication approuvee
    if (publication.status === "APPROUVEE") {
      return { success: false, error: "Impossible de modifier une publication approuvee." };
    }

    await prisma.publication.update({
      where: { id: publicationId },
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        category: parsed.data.category,
        coverImage: parsed.data.coverImage || null,
      },
    });

    await logAuditAction({
      userId: session.user.id,
      action: "UPDATE_PUBLICATION",
      target: `publication:${publicationId}`,
    });

    revalidatePath("/admin/publications");
    revalidatePath(`/admin/publications/${publicationId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Acces non autorise.") {
      return { success: false, error: "Acces non autorise." };
    }
    console.error("Erreur lors de la modification de la publication:", error);
    return { success: false, error: "Une erreur est survenue. Veuillez reessayer." };
  }
}

export async function submitPublication(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    requireAuth(session);
    requireRole(session, ["EDITEUR", "ADMINISTRATEUR", "DEVELOPPEUR"]);

    const publicationId = formData.get("publicationId") as string;
    if (!publicationId) {
      return { success: false, error: "Identifiant de la publication manquant." };
    }

    const publication = await prisma.publication.findUnique({
      where: { id: publicationId },
      select: { id: true, authorId: true, status: true },
    });

    if (!publication) {
      return { success: false, error: "Publication introuvable." };
    }

    if (publication.authorId !== session.user.id) {
      return { success: false, error: "Vous ne pouvez soumettre que vos propres publications." };
    }

    if (publication.status !== "BROUILLON" && publication.status !== "REJETEE") {
      return {
        success: false,
        error: "Seules les publications en brouillon ou rejetees peuvent etre soumises.",
      };
    }

    await prisma.publication.update({
      where: { id: publicationId },
      data: {
        status: "EN_ATTENTE",
        validatorId: null,
        validationComment: null,
      },
    });

    await logAuditAction({
      userId: session.user.id,
      action: "SUBMIT_PUBLICATION",
      target: `publication:${publicationId}`,
    });

    revalidatePath("/admin/publications");
    revalidatePath(`/admin/publications/${publicationId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Acces non autorise.") {
      return { success: false, error: "Acces non autorise." };
    }
    console.error("Erreur lors de la soumission de la publication:", error);
    return { success: false, error: "Une erreur est survenue. Veuillez reessayer." };
  }
}

export async function validatePublication(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    requireAuth(session);
    requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

    const rawData = {
      publicationId: formData.get("publicationId") as string,
      action: formData.get("action") as string,
      comment: formData.get("comment") as string,
    };

    const parsed = validatePublicationSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Donnees invalides.";
      return { success: false, error: firstError };
    }

    const publication = await prisma.publication.findUnique({
      where: { id: parsed.data.publicationId },
      select: { id: true, status: true, title: true },
    });

    if (!publication) {
      return { success: false, error: "Publication introuvable." };
    }

    if (publication.status !== "EN_ATTENTE") {
      return { success: false, error: "Seules les publications en attente peuvent etre validees." };
    }

    const isApproved = parsed.data.action === "APPROUVEE";

    await prisma.publication.update({
      where: { id: parsed.data.publicationId },
      data: {
        status: parsed.data.action,
        validatorId: session.user.id,
        validationComment: parsed.data.comment || null,
        publishedAt: isApproved ? new Date() : null,
      },
    });

    await logAuditAction({
      userId: session.user.id,
      action: isApproved ? "APPROVE_PUBLICATION" : "REJECT_PUBLICATION",
      target: `publication:${publication.title}`,
    });

    revalidatePath("/admin/publications");
    revalidatePath(`/admin/publications/${parsed.data.publicationId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Acces non autorise.") {
      return { success: false, error: "Acces non autorise." };
    }
    console.error("Erreur lors de la validation de la publication:", error);
    return { success: false, error: "Une erreur est survenue. Veuillez reessayer." };
  }
}

// ─── GESTION DES INSCRIPTIONS ────────────────────────────

export async function updateInscriptionStatus(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    requireAuth(session);

    const rawData = {
      inscriptionId: formData.get("inscriptionId") as string,
      status: formData.get("status") as string,
      position: formData.get("position") as string,
      schedule: formData.get("schedule") as string,
    };

    const parsed = updateInscriptionStatusSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Donnees invalides.";
      return { success: false, error: firstError };
    }

    const inscription = await prisma.inscription.findUnique({
      where: { id: parsed.data.inscriptionId },
      include: {
        event: { select: { id: true, slug: true } },
        user: { select: { username: true } },
      },
    });

    if (!inscription) {
      return { success: false, error: "Inscription introuvable." };
    }

    // Verifier les droits : admin/dev global, ou coordinateur sur cet evenement
    const isAdmin = session.user.roles?.some(
      (r: { role: string }) => r.role === "ADMINISTRATEUR" || r.role === "DEVELOPPEUR",
    );
    const isCoordinator = session.user.roles?.some(
      (r: { role: string; eventId: string | null }) =>
        r.role === "COORDINATEUR" && r.eventId === inscription.eventId,
    );

    if (!isAdmin && !isCoordinator) {
      return { success: false, error: "Acces non autorise." };
    }

    await prisma.inscription.update({
      where: { id: parsed.data.inscriptionId },
      data: {
        status: parsed.data.status,
        position: parsed.data.position || null,
        schedule: parsed.data.schedule || null,
      },
    });

    await logAuditAction({
      userId: session.user.id,
      action: `UPDATE_INSCRIPTION_${parsed.data.status}`,
      target: `inscription:${inscription.user.username}@${inscription.event.slug}`,
    });

    revalidatePath(`/admin/evenements/${inscription.event.slug}/equipe`);
    revalidatePath("/espace-membre/inscriptions");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Acces non autorise.") {
      return { success: false, error: "Acces non autorise." };
    }
    console.error("Erreur lors de la mise a jour de l'inscription:", error);
    return { success: false, error: "Une erreur est survenue. Veuillez reessayer." };
  }
}

// ─── CREATION DE MEMBRE ──────────────────────────────────

interface CreateMemberResult {
  success: boolean;
  error?: string;
  /** Identifiant genere, retourne pour affichage apres creation */
  username?: string;
  /** Mot de passe genere en clair, a transmettre une seule fois */
  temporaryPassword?: string;
}

export async function createMember(formData: FormData): Promise<CreateMemberResult> {
  try {
    const session = await auth();
    requireAuth(session);
    requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

    const rawData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || "",
    };

    const parsed = createMemberSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Donnees invalides.";
      return { success: false, error: firstError };
    }

    // Verifier unicite de l'email
    const emailExists = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    });
    if (emailExists) {
      return { success: false, error: "Un compte avec cette adresse e-mail existe deja." };
    }

    // Generer identifiant unique et mot de passe temporaire
    const username = await generateUniqueUsername(parsed.data.firstName, parsed.data.lastName);
    const temporaryPassword = generateSecurePassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

    await prisma.user.create({
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        username,
        passwordHash: hashedPassword,
        isActive: true,
      },
    });

    await logAuditAction({
      userId: session.user.id,
      action: "CREATE_MEMBER",
      target: `user:${username}`,
    });

    revalidatePath("/admin/utilisateurs");
    return { success: true, username, temporaryPassword };
  } catch (error) {
    if (error instanceof Error && error.message === "Acces non autorise.") {
      return { success: false, error: "Acces non autorise." };
    }
    console.error("Erreur lors de la creation du membre:", error);
    return { success: false, error: "Une erreur est survenue. Veuillez reessayer." };
  }
}

// ─── REGENERATION DU MOT DE PASSE ────────────────────────

interface RegeneratePasswordResult {
  success: boolean;
  error?: string;
  /** Nouveau mot de passe temporaire en clair */
  temporaryPassword?: string;
}

export async function regeneratePassword(formData: FormData): Promise<RegeneratePasswordResult> {
  try {
    const session = await auth();
    requireAuth(session);
    requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);

    const parsed = regeneratePasswordSchema.safeParse({
      userId: formData.get("userId") as string,
    });
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Donnees invalides.";
      return { success: false, error: firstError };
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: parsed.data.userId },
      select: { id: true, username: true },
    });
    if (!targetUser) {
      return { success: false, error: "Utilisateur introuvable." };
    }

    const temporaryPassword = generateSecurePassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

    await prisma.user.update({
      where: { id: parsed.data.userId },
      data: { passwordHash: hashedPassword },
    });

    await logAuditAction({
      userId: session.user.id,
      action: "REGENERATE_PASSWORD",
      target: `user:${targetUser.username}`,
    });

    return { success: true, temporaryPassword };
  } catch (error) {
    if (error instanceof Error && error.message === "Acces non autorise.") {
      return { success: false, error: "Acces non autorise." };
    }
    console.error("Erreur lors de la regeneration du mot de passe:", error);
    return { success: false, error: "Une erreur est survenue. Veuillez reessayer." };
  }
}
