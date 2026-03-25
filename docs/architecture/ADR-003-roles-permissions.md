# ADR-003 : Systeme de roles et permissions

## Statut

Accepte

## Contexte

Le site a 4 niveaux d'acces distincts avec des regles de gestion specifiques :
- Des adherents standards (acces espace prive)
- Des editeurs (creation de contenu modere)
- Des coordinateurs (gestion d'inscriptions sur un evenement precis)
- Des administrateurs (acces complet)
- Des developpeurs (acces technique total)

Les roles ne sont pas exclusifs : un adherent peut etre coordinateur sur un evenement
ET editeur en meme temps.

## Decision

### Hierarchie des roles

```
Developpeur   (niveau 4) — Acces total, technique + fonctionnel
    │
Administrateur (niveau 3) — Gestion complete du site et des utilisateurs
    │
Coordinateur   (niveau 2) — Gestion des inscriptions sur un evenement specifique
    │
Editeur        (niveau 1) — Creation de contenu (soumis a validation)
    │
Adherent       (niveau 0) — Acces espace prive (tout utilisateur authentifie)
```

Le role "Adherent" est implicite : tout utilisateur authentifie et actif est adherent.
Les autres roles sont explicitement attribues via la table `UserRole`.

### Matrice des permissions

| Action                          | Adherent | Editeur | Coordinateur* | Admin | Dev |
|---------------------------------|----------|---------|---------------|-------|-----|
| Voir site public                | oui      | oui     | oui           | oui   | oui |
| Acceder espace membre           | oui      | oui     | oui           | oui   | oui |
| Modifier son profil             | oui      | oui     | oui           | oui   | oui |
| S'inscrire a un evenement       | oui      | oui     | oui           | oui   | oui |
| Voter sondage / liker idee     | oui      | oui     | oui           | oui   | oui |
| Soumettre une idee              | oui      | oui     | oui           | oui   | oui |
| Creer une publication           | non      | oui     | non           | oui   | oui |
| Valider une publication         | non      | non     | non           | oui   | oui |
| Voir inscriptions evenement*    | non      | non     | oui*          | oui   | oui |
| Valider/refuser inscriptions*   | non      | non     | oui*          | oui   | oui |
| Affecter postes et horaires*    | non      | non     | oui*          | oui   | oui |
| CRUD evenements                 | non      | non     | non           | oui   | oui |
| Gerer les adherents             | non      | non     | non           | oui   | oui |
| Attribuer roles (sauf Dev)      | non      | non     | non           | oui   | oui |
| Attribuer role Developpeur      | non      | non     | non           | non** | oui |
| Acces technique / logs systeme  | non      | non     | non           | non   | oui |

*\* Coordinateur : uniquement sur l'evenement qui lui est assigne.*
*\*\* Seule la presidence peut attribuer le role Dev, via un admin ou dev existant.*

### Implementation technique

#### Middleware de protection des routes

```typescript
// src/middleware.ts
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Routes espace membre : authentification requise
  if (pathname.startsWith("/espace-membre") && !req.auth) {
    return Response.redirect(new URL("/connexion", req.url));
  }

  // Routes admin : role ADMINISTRATEUR ou DEVELOPPEUR requis
  if (pathname.startsWith("/admin") && !hasRole(req.auth, ["ADMINISTRATEUR", "DEVELOPPEUR"])) {
    return Response.redirect(new URL("/espace-membre", req.url));
  }
});
```

#### Helper de verification des roles

```typescript
// src/lib/permissions.ts

type RoleCheck = Role | { role: Role; eventId: string };

export function hasRole(session: Session | null, roles: RoleCheck[]): boolean {
  if (!session?.user?.roles) return false;
  return roles.some((check) => {
    if (typeof check === "string") {
      return session.user.roles.some((r) => r.role === check);
    }
    // Verification role + evenement specifique (coordinateur)
    return session.user.roles.some(
      (r) => r.role === check.role && r.eventId === check.eventId
    );
  });
}

export function requireRole(session: Session | null, roles: RoleCheck[]): void {
  if (!hasRole(session, roles)) {
    throw new Error("Acces non autorise.");
  }
}
```

#### Protection des API Routes

```typescript
// Exemple : src/app/api/admin/evenements/route.ts
import { auth } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";

export const POST = auth(async (req) => {
  requireRole(req.auth, ["ADMINISTRATEUR", "DEVELOPPEUR"]);
  // ... creer l'evenement
});
```

#### Protection des Server Actions

```typescript
"use server";

import { auth } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";

export async function validatePublication(publicationId: string) {
  const session = await auth();
  requireRole(session, ["ADMINISTRATEUR", "DEVELOPPEUR"]);
  // ... valider la publication
}
```

### Attribution des roles

- L'attribution se fait via l'interface `/admin/utilisateurs`.
- Seul un Administrateur ou Developpeur peut attribuer des roles.
- Le role Coordinateur necessite la selection d'un evenement associe.
- Chaque attribution est enregistree dans l'audit log.
- Un adherent peut avoir plusieurs roles simultanément (cumul autorise).

### Session JWT — Payload

```typescript
interface SessionUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Array<{
    role: Role;
    eventId: string | null;
  }>;
}
```

Les roles sont charges dans le JWT au login et rafraichis a chaque revalidation
de session. Cela evite un appel BDD a chaque requete tout en gardant les roles
a jour (revalidation toutes les 15 minutes).

## Consequences

- Le systeme est simple mais couvre tous les cas decrits dans la spec.
- Le cumul de roles offre de la flexibilite (un admin peut aussi etre coordinateur).
- Le scope par evenement du Coordinateur evite de donner trop de droits.
- L'audit log garantit la tracabilite de toutes les actions sensibles.

## Alternatives envisagees

| Alternative          | Raison du rejet                                                    |
|----------------------|--------------------------------------------------------------------|
| RBAC avec permissions granulaires | Sur-ingenierie pour 4 roles simples. A reconsiderer si les besoins se complexifient. |
| CASL (librairie)     | Abstraction supplementaire non necessaire a cette echelle         |
| Roles en BDD dynamiques | Les 4 roles sont fixes et connus. Enum Prisma plus simple.    |
| ACL par ressource    | Trop complexe. Le scope evenement du Coordinateur suffit.         |
