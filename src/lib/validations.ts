import { z } from "zod";

// ─── Authentification ─────────────────────────────────────

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "L'identifiant est requis")
    .max(50, "L'identifiant ne peut pas depasser 50 caracteres"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .max(128, "Le mot de passe ne peut pas depasser 128 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse e-mail est requise")
    .email("L'adresse e-mail n'est pas valide"),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ─── Profil ───────────────────────────────────────────────

export const updateProfileSchema = z.object({
  phone: z
    .string()
    .max(20, "Le numero de telephone ne peut pas depasser 20 caracteres")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, "La biographie ne peut pas depasser 500 caracteres")
    .optional()
    .or(z.literal("")),
  allergies: z
    .string()
    .max(500, "Le champ allergies ne peut pas depasser 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ─── Inscription evenement ────────────────────────────────

export const createInscriptionSchema = z.object({
  eventId: z.string().min(1, "L'identifiant de l'evenement est requis"),
  notes: z
    .string()
    .max(500, "Les notes ne peuvent pas depasser 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type CreateInscriptionInput = z.infer<typeof createInscriptionSchema>;
