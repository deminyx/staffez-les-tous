import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Instance singleton du client Prisma.
 *
 * En developpement, Next.js recharge les modules a chaque modification (HMR).
 * Sans ce pattern singleton, chaque rechargement creerait une nouvelle connexion
 * a la base de donnees, ce qui finirait par epuiser le pool de connexions.
 *
 * En production, une seule instance est creee et reutilisee.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
