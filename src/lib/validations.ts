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

// ─── Admin : Gestion des roles ────────────────────────────

export const updateUserRolesSchema = z.object({
  userId: z.string().min(1, "L'identifiant de l'utilisateur est requis"),
  roles: z.array(
    z.object({
      role: z.enum(["EDITEUR", "ADMINISTRATEUR", "COORDINATEUR", "DEVELOPPEUR"]),
      eventId: z.string().nullable().optional(),
    }),
  ),
});

export type UpdateUserRolesInput = z.infer<typeof updateUserRolesSchema>;

export const toggleUserActiveSchema = z.object({
  userId: z.string().min(1, "L'identifiant de l'utilisateur est requis"),
  isActive: z.boolean(),
});

export type ToggleUserActiveInput = z.infer<typeof toggleUserActiveSchema>;

// ─── Admin : Evenements ───────────────────────────────────

export const eventFormSchema = z.object({
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(200, "Le titre ne peut pas depasser 200 caracteres"),
  slug: z
    .string()
    .min(1, "Le slug est requis")
    .max(200, "Le slug ne peut pas depasser 200 caracteres")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Le slug doit etre en format kebab-case"),
  description: z
    .string()
    .min(1, "La description est requise")
    .max(5000, "La description ne peut pas depasser 5000 caracteres"),
  missions: z
    .string()
    .max(5000, "Les missions ne peuvent pas depasser 5000 caracteres")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .max(200, "Le lieu ne peut pas depasser 200 caracteres")
    .optional()
    .or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  type: z.enum(["PRESTATION", "VIE_ASSOCIATIVE"]),
  status: z.enum(["BROUILLON", "PUBLIE", "ARCHIVE"]),
  coverImage: z
    .string()
    .max(500, "L'URL de l'image ne peut pas depasser 500 caracteres")
    .optional()
    .or(z.literal("")),
  maxVolunteers: z
    .number()
    .int()
    .min(1, "La capacite doit etre d'au moins 1")
    .nullable()
    .optional(),
  inscriptionOpen: z.boolean().optional(),
});

export type EventFormInput = z.infer<typeof eventFormSchema>;

// ─── Admin : Publications ─────────────────────────────────

export const publicationFormSchema = z.object({
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(200, "Le titre ne peut pas depasser 200 caracteres"),
  content: z
    .string()
    .min(1, "Le contenu est requis")
    .max(20000, "Le contenu ne peut pas depasser 20000 caracteres"),
  category: z.enum(["NEWSLETTER", "ANNONCE_EVENEMENT", "ACTUALITE"]),
  coverImage: z
    .string()
    .max(500, "L'URL de l'image ne peut pas depasser 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type PublicationFormInput = z.infer<typeof publicationFormSchema>;

export const validatePublicationSchema = z.object({
  publicationId: z.string().min(1, "L'identifiant de la publication est requis"),
  action: z.enum(["APPROUVEE", "REJETEE"]),
  comment: z
    .string()
    .max(1000, "Le commentaire ne peut pas depasser 1000 caracteres")
    .optional()
    .or(z.literal("")),
});

export type ValidatePublicationInput = z.infer<typeof validatePublicationSchema>;

// ─── Admin : Gestion des inscriptions ─────────────────────

export const updateInscriptionStatusSchema = z.object({
  inscriptionId: z.string().min(1, "L'identifiant de l'inscription est requis"),
  status: z.enum(["EN_ATTENTE", "VALIDEE", "REFUSEE"]),
  position: z
    .string()
    .max(100, "Le poste ne peut pas depasser 100 caracteres")
    .optional()
    .or(z.literal("")),
  schedule: z
    .string()
    .max(200, "Les horaires ne peuvent pas depasser 200 caracteres")
    .optional()
    .or(z.literal("")),
});

export type UpdateInscriptionStatusInput = z.infer<typeof updateInscriptionStatusSchema>;

// ─── Boutique : Articles ──────────────────────────────────

export const productFormSchema = z.object({
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(200, "Le titre ne peut pas depasser 200 caracteres"),
  slug: z
    .string()
    .min(1, "Le slug est requis")
    .max(200, "Le slug ne peut pas depasser 200 caracteres")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Le slug doit etre en format kebab-case"),
  description: z
    .string()
    .min(1, "La description est requise")
    .max(5000, "La description ne peut pas depasser 5000 caracteres"),
  image: z
    .string()
    .max(500, "L'URL de l'image ne peut pas depasser 500 caracteres")
    .optional()
    .or(z.literal("")),
  priceMember: z.number().int().min(0, "Le prix adherent doit etre positif"),
  pricePublic: z.number().int().min(0, "Le prix public doit etre positif").nullable().optional(),
  isAvailable: z.boolean().optional(),
  variants: z.array(
    z.object({
      id: z.string().optional(),
      label: z.string().min(1, "Le label de la variante est requis").max(100),
      stock: z.number().int().min(0, "Le stock doit etre positif ou nul"),
    }),
  ),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;

export const placeOrderSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().min(1),
        quantity: z.number().int().min(1, "La quantite doit etre d'au moins 1"),
      }),
    )
    .min(1, "Le panier ne peut pas etre vide"),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1, "L'identifiant de la commande est requis"),
  status: z.enum(["EN_ATTENTE", "PAYEE", "LIVREE", "ANNULEE"]),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

// ─── Vie associative : Sondages ───────────────────────────

export const createPollSchema = z.object({
  question: z
    .string()
    .min(1, "La question est requise")
    .max(500, "La question ne peut pas depasser 500 caracteres"),
  options: z
    .array(z.string().min(1, "L'option ne peut pas etre vide").max(200))
    .min(2, "Il faut au moins 2 options")
    .max(6, "Maximum 6 options"),
  closesAt: z.string().min(1, "La date de cloture est requise"),
});

export type CreatePollInput = z.infer<typeof createPollSchema>;

export const votePollSchema = z.object({
  optionId: z.string().min(1, "L'option est requise"),
});

export type VotePollInput = z.infer<typeof votePollSchema>;

// ─── Vie associative : Boite a idees ─────────────────────

export const submitIdeaSchema = z.object({
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(100, "Le titre ne peut pas depasser 100 caracteres"),
  description: z
    .string()
    .min(1, "La description est requise")
    .max(500, "La description ne peut pas depasser 500 caracteres"),
});

export type SubmitIdeaInput = z.infer<typeof submitIdeaSchema>;
