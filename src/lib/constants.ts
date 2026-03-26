/** Nombre maximum de tentatives de connexion par fenetre de 15 min */
export const MAX_LOGIN_ATTEMPTS = 5;

/** Duree de la fenetre de rate limiting en millisecondes (15 min) */
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

/** Longueur minimale des mots de passe generes */
export const MIN_PASSWORD_LENGTH = 12;

/** Nombre maximum de fichiers uploadables par evenement */
export const MAX_EVENT_PHOTOS = 20;

/** Taille max d'un fichier uploade (en octets) — 5 Mo */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/** URL HelloAsso par defaut */
export const HELLOASSO_URL =
  process.env.NEXT_PUBLIC_HELLOASSO_URL ||
  "https://www.helloasso.com/associations/staffez-les-tous";

/** Email de contact principal */
export const CONTACT_EMAIL = "contact@staffezlestous.fr";

/** Email du pole communication */
export const COMMUNICATION_EMAIL = "communication@staffezlestous.fr";

/** Statuts d'inscription avec labels francais */
export const INSCRIPTION_STATUS_LABELS = {
  EN_ATTENTE: "En attente",
  VALIDEE: "Validee",
  REFUSEE: "Refusee",
} as const;

/** Statuts de publication avec labels francais */
export const PUBLICATION_STATUS_LABELS = {
  BROUILLON: "Brouillon",
  EN_ATTENTE: "En attente de validation",
  APPROUVEE: "Publiee",
  REJETEE: "Rejetee",
} as const;

/** Statuts de commande avec labels francais */
export const ORDER_STATUS_LABELS = {
  EN_ATTENTE: "En attente",
  PAYEE: "Payee",
  LIVREE: "Livree",
  ANNULEE: "Annulee",
} as const;

/** Couleurs des statuts de commande */
export const ORDER_STATUS_COLORS = {
  EN_ATTENTE: "bg-yellow-500/20 text-yellow-400",
  PAYEE: "bg-green-500/20 text-green-400",
  LIVREE: "bg-blue-500/20 text-blue-400",
  ANNULEE: "bg-red-500/20 text-red-400",
} as const;
