import { prisma } from "@/lib/prisma";

import type { Prisma } from "@prisma/client";

/**
 * Enregistre une action dans le journal d'audit.
 * A appeler dans chaque Server Action admin.
 */
export async function logAuditAction({
  userId,
  action,
  target,
  details,
}: {
  userId: string;
  action: string;
  target: string;
  details?: Prisma.InputJsonValue;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        target,
        details: details ?? undefined,
      },
    });
  } catch (error) {
    // L'audit ne doit jamais bloquer l'action principale
    console.error("Erreur lors de l'ecriture du journal d'audit:", error);
  }
}
