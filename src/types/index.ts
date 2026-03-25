// ─── Roles et permissions ─────────────────────────────────

export type Role = "EDITEUR" | "ADMINISTRATEUR" | "COORDINATEUR" | "DEVELOPPEUR";

export interface UserRole {
  role: Role;
  eventId: string | null;
}

// ─── Evenements ──────────────────────────────────────────

export type EventType = "PRESTATION" | "VIE_ASSOCIATIVE";

export type EventStatus = "BROUILLON" | "PUBLIE" | "ARCHIVE";

export interface EventSummary {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  type: EventType;
  status: EventStatus;
  inscriptionOpen: boolean;
}

export interface EventDetail extends EventSummary {
  description: string;
  missions: string | null;
  photos: string[];
  maxVolunteers: number | null;
}

// ─── Inscriptions ────────────────────────────────────────

export type InscriptionStatus = "EN_ATTENTE" | "VALIDEE" | "REFUSEE";

export interface Inscription {
  id: string;
  eventId: string;
  eventTitle: string;
  status: InscriptionStatus;
  position: string | null;
  schedule: string | null;
  createdAt: string;
}

// ─── Publications ────────────────────────────────────────

export type PublicationCategory = "NEWSLETTER" | "ANNONCE_EVENEMENT" | "ACTUALITE";

export type PublicationStatus = "BROUILLON" | "EN_ATTENTE" | "APPROUVEE" | "REJETEE";

export interface PublicationSummary {
  id: string;
  title: string;
  category: PublicationCategory;
  status: PublicationStatus;
  coverImage: string | null;
  publishedAt: string | null;
  authorName: string;
}

// ─── Utilisateur / Profil ────────────────────────────────

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  photo: string | null;
  bio: string | null;
  allergies: string | null;
  roles: UserRole[];
}

// ─── Formulaires de contact ──────────────────────────────

export type ContactType = "RECRUTEMENT" | "ORGANISATEUR";

export interface ContactFormData {
  type: ContactType;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  // Specifique recrutement
  eventsOfInterest?: string[];
  // Specifique organisateur
  eventName?: string;
  eventDates?: string;
  organization?: string;
}
