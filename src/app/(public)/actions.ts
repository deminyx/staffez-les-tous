"use server";

import { prisma } from "@/lib/prisma";
import { recrutementFormSchema, organisateursFormSchema } from "@/lib/validations";

// ─── Types de retour ──────────────────────────────────────

export interface ContactActionState {
  success: boolean;
  error?: string;
}

// ─── Formulaire recrutement benevole ─────────────────────

export async function submitRecrutement(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  try {
    const rawData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      events: formData.get("events") as string,
      message: formData.get("message") as string,
    };

    const parsed = recrutementFormSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Donnees invalides.";
      return { success: false, error: firstError };
    }

    const eventsOfInterest = parsed.data.events
      ? parsed.data.events
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    await prisma.contactSubmission.create({
      data: {
        type: "RECRUTEMENT",
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        message: parsed.data.message,
        eventsOfInterest,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'envoi de la candidature:", error);
    return { success: false, error: "Une erreur est survenue. Veuillez reessayer." };
  }
}

// ─── Formulaire organisateurs ─────────────────────────────

export async function submitOrganisateur(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  try {
    const rawData = {
      orgName: formData.get("orgName") as string,
      eventName: formData.get("eventName") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      eventDates: formData.get("eventDates") as string,
      message: formData.get("message") as string,
    };

    const parsed = organisateursFormSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Donnees invalides.";
      return { success: false, error: firstError };
    }

    await prisma.contactSubmission.create({
      data: {
        type: "ORGANISATEUR",
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        message: parsed.data.message,
        organization: parsed.data.orgName,
        eventName: parsed.data.eventName,
        eventDates: parsed.data.eventDates || null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande organisateur:", error);
    return { success: false, error: "Une erreur est survenue. Veuillez reessayer." };
  }
}
