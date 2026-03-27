import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { MAX_LOGIN_ATTEMPTS, RATE_LIMIT_WINDOW_MS } from "@/lib/constants";

import type { Role } from "@prisma/client";

// ─── Rate limiting en memoire ─────────────────────────────
// Cle : identifiant (username) normalisé
// Valeur : { count: number; firstAttempt: number }
// Note : en prod multi-instance, remplacer par Redis (Upstash).

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}

const loginAttempts = new Map<string, RateLimitEntry>();

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(identifier);

  if (!entry) return false;

  // La fenetre a expire → on efface et on laisse passer
  if (now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    loginAttempts.delete(identifier);
    return false;
  }

  return entry.count >= MAX_LOGIN_ATTEMPTS;
}

function recordFailedAttempt(identifier: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(identifier);

  if (!entry || now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    loginAttempts.set(identifier, { count: 1, firstAttempt: now });
  } else {
    loginAttempts.set(identifier, { count: entry.count + 1, firstAttempt: entry.firstAttempt });
  }
}

function clearFailedAttempts(identifier: string): void {
  loginAttempts.delete(identifier);
}

/**
 * Configuration NextAuth.js v5.
 *
 * - Provider : Credentials (identifiant + mot de passe)
 * - Session : JWT (pas de table session en base)
 * - Rate limiting en memoire : MAX_LOGIN_ATTEMPTS tentatives / RATE_LIMIT_WINDOW_MS
 * - Les roles sont charges dans le token au login et rafraichis via le callback jwt
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Identifiant", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { username, password } = parsed.data;
        const normalizedUsername = username.toLowerCase();

        // ─ Rate limiting ─────────────────────────────────
        if (isRateLimited(normalizedUsername)) {
          // On retourne null sans distinguer "compte bloque" de "mauvais mdp"
          // pour ne pas faciliter l'enumeration d'utilisateurs.
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { username: normalizedUsername },
          include: {
            roles: {
              select: {
                role: true,
                eventId: true,
              },
            },
          },
        });

        if (!user || !user.isActive) {
          recordFailedAttempt(normalizedUsername);
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
          recordFailedAttempt(normalizedUsername);
          return null;
        }

        // Succes : on efface les tentatives echouees
        clearFailedAttempts(normalizedUsername);

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles.map((r) => ({
            role: r.role,
            eventId: r.eventId,
          })),
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 heures
  },

  pages: {
    signIn: "/connexion",
    error: "/connexion",
  },

  callbacks: {
    async jwt({ token, user }) {
      // Au premier login, on injecte les infos utilisateur dans le token
      if (user) {
        const u = user as {
          id: string;
          username: string;
          email: string;
          firstName: string;
          lastName: string;
          roles: Array<{ role: Role; eventId: string | null }>;
        };
        token.id = u.id;
        token.username = u.username;
        token.email = u.email;
        token.firstName = u.firstName;
        token.lastName = u.lastName;
        token.roles = u.roles;
      }
      return token;
    },

    async session({ session, token }) {
      // On expose les infos du token dans la session cote client
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.roles = token.roles as Array<{
          role: Role;
          eventId: string | null;
        }>;
      }
      return session;
    },

    async authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const { pathname } = nextUrl;

      // Routes espace membre : authentification requise
      if (pathname.startsWith("/espace-membre")) {
        if (!isLoggedIn) {
          return Response.redirect(new URL("/connexion", nextUrl));
        }
        return true;
      }

      // Routes admin : au moins un role specifique requis
      // (ADMINISTRATEUR, DEVELOPPEUR, EDITEUR, ou COORDINATEUR)
      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) {
          return Response.redirect(new URL("/connexion", nextUrl));
        }
        const user = session.user as {
          roles?: Array<{ role: string; eventId: string | null }>;
        };
        const hasAnyAdminRole = user.roles?.some(
          (r) =>
            r.role === "ADMINISTRATEUR" ||
            r.role === "DEVELOPPEUR" ||
            r.role === "EDITEUR" ||
            r.role === "COORDINATEUR",
        );
        if (!hasAnyAdminRole) {
          return Response.redirect(new URL("/espace-membre", nextUrl));
        }
        return true;
      }

      // Si connecte et va sur /connexion → redirect espace membre
      if (pathname === "/connexion" && isLoggedIn) {
        return Response.redirect(new URL("/espace-membre", nextUrl));
      }

      return true;
    },
  },
});
