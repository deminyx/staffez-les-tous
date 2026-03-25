import type { Role } from "@prisma/client";

/**
 * Extension des types NextAuth pour inclure nos champs custom
 * (username, firstName, lastName, roles) dans le token JWT et la session.
 */
declare module "next-auth" {
  interface User {
    username?: string;
    firstName?: string;
    lastName?: string;
    roles?: Array<{ role: Role; eventId: string | null }>;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      roles: Array<{ role: Role; eventId: string | null }>;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    roles?: Array<{ role: Role; eventId: string | null }>;
  }
}
