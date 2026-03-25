import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine et fusionne des classes Tailwind de maniere intelligente.
 * Utilise clsx pour la logique conditionnelle et tailwind-merge pour
 * eviter les conflits entre classes utilitaires.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formate une date en francais.
 */
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(date);
}

/**
 * Genere un identifiant utilisateur a partir du prenom et du nom.
 * Retire les accents, espaces, tirets. Tout en minuscule.
 * Ex: "Jean-Pierre" "De La Fontaine" → "jdelafontaine"
 */
export function generateBaseUsername(firstName: string, lastName: string): string {
  const normalize = (str: string): string =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // retirer accents
      .replace(/[^a-zA-Z]/g, "") // garder uniquement les lettres
      .toLowerCase();

  const firstInitial = normalize(firstName).charAt(0);
  const normalizedLast = normalize(lastName);

  return `${firstInitial}${normalizedLast}`;
}
