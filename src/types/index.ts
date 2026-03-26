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

// ─── Boutique ────────────────────────────────────────────

export type OrderStatus = "EN_ATTENTE" | "PAYEE" | "LIVREE" | "ANNULEE";

export interface ProductVariant {
  id: string;
  label: string;
  stock: number;
}

export interface ProductSummary {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  priceMember: number;
  pricePublic: number | null;
  isAvailable: boolean;
  variants: ProductVariant[];
}

export interface ProductDetail extends ProductSummary {
  description: string;
}

export interface CartItem {
  variantId: string;
  productTitle: string;
  variantLabel: string;
  quantity: number;
  unitPrice: number;
  image: string | null;
  stock: number;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalCents: number;
  createdAt: string;
  userName: string;
  itemCount: number;
}

// ─── Vie associative ────────────────────────────────────

export interface SortieSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  maxVolunteers: number | null;
  inscriptionCount: number;
  isInscrit: boolean;
}

export interface PollSummary {
  id: string;
  question: string;
  closesAt: string;
  isClosed: boolean;
  hasVoted: boolean;
  totalVotes: number;
  options: PollOptionSummary[];
}

export interface PollOptionSummary {
  id: string;
  label: string;
  voteCount: number;
  isSelected: boolean;
}

export interface IdeaSummary {
  id: string;
  title: string;
  description: string;
  authorName: string;
  likeCount: number;
  isLiked: boolean;
  isApproved: boolean;
  createdAt: string;
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
