import { prisma } from "@/lib/prisma";
import { generateBaseUsername } from "@/lib/utils";

/**
 * Genere un identifiant unique a partir du prenom et du nom.
 *
 * Algorithme :
 * 1. Normalise : premiere lettre du prenom + nom complet (sans accents, minuscule, lettres uniquement)
 * 2. Verifie en base si l'identifiant existe deja
 * 3. Si oui, ajoute un suffixe incremental (02, 03, ...)
 *
 * Exemples :
 * - Sarah Puy → "spuy"
 * - Samira Puy → "spuy02"
 * - Sophie Puy → "spuy03"
 */
export async function generateUniqueUsername(
  firstName: string,
  lastName: string,
): Promise<string> {
  const base = generateBaseUsername(firstName, lastName);

  // Chercher tous les identifiants qui commencent par ce base
  const existingUsers = await prisma.user.findMany({
    where: {
      username: {
        startsWith: base,
      },
    },
    select: { username: true },
  });

  if (existingUsers.length === 0) {
    return base;
  }

  // Trouver le prochain suffixe disponible
  const existingUsernames = new Set(existingUsers.map((u) => u.username));

  // Le premier (sans suffixe) peut deja exister
  if (!existingUsernames.has(base)) {
    return base;
  }

  // Chercher le prochain numero libre
  let counter = 2;
  while (existingUsernames.has(`${base}${String(counter).padStart(2, "0")}`)) {
    counter++;
  }

  return `${base}${String(counter).padStart(2, "0")}`;
}

/**
 * Genere un mot de passe securise aleatoire.
 *
 * - Minimum 12 caracteres
 * - Au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 caractere special
 */
export function generateSecurePassword(length: number = 16): string {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const specials = "!@#$%&*-_=+";
  const all = lowercase + uppercase + digits + specials;

  // Garantir au moins un de chaque type
  const mandatoryChars = [
    lowercase[Math.floor(Math.random() * lowercase.length)],
    uppercase[Math.floor(Math.random() * uppercase.length)],
    digits[Math.floor(Math.random() * digits.length)],
    specials[Math.floor(Math.random() * specials.length)],
  ];

  // Remplir le reste
  const remaining = Array.from({ length: length - mandatoryChars.length }, () =>
    all[Math.floor(Math.random() * all.length)],
  );

  // Melanger le tout (Fisher-Yates)
  const chars = [...mandatoryChars, ...remaining];
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
}
