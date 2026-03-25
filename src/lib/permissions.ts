import type { Role } from "@prisma/client";

interface SessionUserRole {
  role: Role;
  eventId: string | null;
}

interface SessionUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: SessionUserRole[];
}

interface SessionLike {
  user?: SessionUser;
}

type RoleCheck = Role | { role: Role; eventId: string };

/**
 * Verifie si la session possede au moins un des roles demandes.
 *
 * Accepte soit un nom de role simple ("ADMINISTRATEUR"),
 * soit un objet { role, eventId } pour les coordinateurs scopes a un evenement.
 */
export function hasRole(
  session: SessionLike | null | undefined,
  roles: RoleCheck[],
): boolean {
  if (!session?.user?.roles) return false;

  return roles.some((check) => {
    if (typeof check === "string") {
      return session.user!.roles.some((r) => r.role === check);
    }
    return session.user!.roles.some(
      (r) => r.role === check.role && r.eventId === check.eventId,
    );
  });
}

/**
 * Verifie les roles et leve une erreur si l'acces est refuse.
 * A utiliser dans les Server Actions et API Routes.
 */
export function requireRole(
  session: SessionLike | null | undefined,
  roles: RoleCheck[],
): void {
  if (!hasRole(session, roles)) {
    throw new Error("Acces non autorise.");
  }
}

/**
 * Verifie si l'utilisateur est au moins authentifie (adherent).
 */
export function requireAuth(
  session: SessionLike | null | undefined,
): asserts session is { user: SessionUser } {
  if (!session?.user) {
    throw new Error("Authentification requise.");
  }
}
