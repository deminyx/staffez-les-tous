# Phase 2 — Choix techniques et explications

> Ce document est destine a expliquer **en termes simples** les technologies
> utilisees dans la Phase 2 (authentification + espace membre), **pourquoi** elles
> ont ete choisies, et **comment** elles fonctionnent ensemble.

---

## Vue d'ensemble

La Phase 2 ajoute 3 briques fondamentales au projet :

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│  Base de donnees     │     │  Authentification     │     │  Espace membre      │
│  (Prisma + Postgres) │────▶│  (NextAuth.js v5)     │────▶│  (pages protegees)  │
└─────────────────────┘     └──────────────────────┘     └─────────────────────┘
```

---

## 1. Prisma — L'ORM (Object-Relational Mapper)

### C'est quoi ?

Prisma est un **traducteur entre ton code TypeScript et ta base de donnees**.
Au lieu d'ecrire du SQL brut (`SELECT * FROM users WHERE id = '123'`), tu ecris
du TypeScript type-safe et Prisma genere le SQL pour toi.

```typescript
// Sans Prisma (SQL brut) :
const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
const user = result.rows[0]; // ← pas de typage, tu esperes que ca marche

// Avec Prisma :
const user = await prisma.user.findUnique({ where: { email } });
// ← TypeScript sait que `user` a un champ `firstName`, `lastName`, etc.
// ← L'autocompletion fonctionne, les erreurs sont detectees avant l'execution
```

### Pourquoi Prisma plutot qu'un autre ORM ?

| Critere                     | Prisma                          | Alternatives (Drizzle, TypeORM, Knex) |
|-----------------------------|---------------------------------|---------------------------------------|
| Typage automatique          | Genere les types depuis le schema | Il faut souvent les ecrire soi-meme |
| Migrations                  | Automatiques, versionnees        | Variables selon la lib               |
| Documentation               | Excellente, tres claire          | Inegale                             |
| Adoption Next.js            | Standard de facto                | Moins repandu                        |
| Courbe d'apprentissage      | Faible, syntaxe intuitive        | Variable                            |

### Comment ca marche concrètement ?

1. **Le schema** (`prisma/schema.prisma`) — C'est un fichier texte qui decrit tes
   tables. C'est la **source de verite** : tu le modifies, et tout le reste suit.

   ```prisma
   model User {
     id        String  @id @default(cuid())
     username  String  @unique
     email     String  @unique
     firstName String
     // ... Prisma genere la table SQL correspondante
   }
   ```

2. **Les migrations** — Quand tu modifies le schema, tu lances `npx prisma migrate dev`.
   Prisma compare le schema actuel avec la base, genere un fichier SQL de migration
   (ex: `20240101_add_user_table.sql`), et l'execute. Ces fichiers sont commites
   dans le depot — tout le monde a le meme historique de migrations.

3. **Le client** — `npx prisma generate` cree un client TypeScript avec des types
   correspondant exactement a ton schema. Quand tu ecris `prisma.user.findMany()`,
   TypeScript connait les champs retournes.

4. **Prisma Studio** — Interface web gratuite pour voir et editer les donnees :
   `npx prisma studio` ouvre un navigateur sur http://localhost:5555.

### Ce qu'on ne fait PAS en Phase 2

On ne deploie pas encore de PostgreSQL en production. En local, on utilise un
PostgreSQL Docker ou SQLite pour le dev (Prisma supporte les deux). Le deploy
prod (Vercel Postgres ou Supabase) viendra quand on deployera.

---

## 2. NextAuth.js v5 (Auth.js) — L'authentification

### C'est quoi ?

NextAuth.js est une **librairie d'authentification** specialement concue pour
Next.js. La v5 (aussi appelee "Auth.js") est la derniere version, compatible
avec l'App Router et les Server Components.

Elle gere :
- La connexion / deconnexion
- Les sessions (qui est connecte ?)
- La protection des routes (qui a le droit d'acceder ou ?)
- Le stockage securise du token dans un cookie

### Pourquoi NextAuth plutot qu'un systeme custom ?

| Aspect                    | NextAuth                              | Auth custom (fait maison)            |
|---------------------------|---------------------------------------|--------------------------------------|
| Securite                  | Audite, cookies httpOnly/secure auto  | Risque d'oubli de bonnes pratiques   |
| Integration Next.js       | Native (middleware, Server Components)| Il faut tout cabler soi-meme        |
| Temps de developpement    | ~1h pour un setup complet             | Plusieurs jours                      |
| Maintenance               | Mise a jour npm                       | A maintenir soi-meme                |

### Comment ca marche ?

1. **Configuration** (`src/lib/auth.ts`) — On declare un "provider" de type
   `Credentials` qui dit : "pour connecter un utilisateur, verifie son
   identifiant et son mot de passe en base de donnees".

   ```typescript
   // Simplifie
   export const { handlers, auth, signIn, signOut } = NextAuth({
     providers: [
       Credentials({
         authorize: async (credentials) => {
           // 1. Chercher l'utilisateur par identifiant
           // 2. Verifier le mot de passe (bcrypt)
           // 3. Retourner l'utilisateur ou null
         },
       }),
     ],
   });
   ```

2. **API Routes** — NextAuth cree automatiquement les endpoints `/api/auth/*`
   (login, logout, session, etc.) via un fichier `src/app/api/auth/[...nextauth]/route.ts`.

3. **Middleware** (`src/middleware.ts`) — Un fichier a la racine de `src/` qui
   intercepte **chaque requete** avant qu'elle n'atteigne la page. On y verifie
   si l'utilisateur est connecte pour les routes protegees.

   ```
   Requete → Middleware → Connecte ? → Oui → Page /espace-membre
                                     → Non → Redirect /connexion
   ```

4. **Session** — Cote serveur, `auth()` retourne la session courante :

   ```typescript
   const session = await auth();
   // session.user.id, session.user.username, session.user.roles...
   ```

### Sessions JWT vs Sessions en base

On utilise des **JWT** (JSON Web Tokens). Le token est stocke dans un cookie
chiffre. Avantage : pas besoin de table `sessions` en base, pas de requete BDD
a chaque requete. Inconvenient : si on revoque un utilisateur, il faut attendre
l'expiration du token (on a configure 15 min de revalidation pour limiter ca).

---

## 3. bcryptjs — Le hashage de mots de passe

### C'est quoi ?

bcrypt est un algorithme de hashage **specialement concu pour les mots de passe**.
Contrairement a SHA-256 ou MD5, il est **volontairement lent** pour rendre les
attaques par force brute impraticables.

On utilise `bcryptjs` (version JavaScript pure) au lieu de `bcrypt` (version C++
native) parce que la compilation C++ echoue sous Windows. Le resultat est
identique.

### Comment ca marche ?

```typescript
import bcrypt from "bcryptjs";

// Hasher un mot de passe (a la creation du compte)
const hash = await bcrypt.hash("MonMotDePasse123!", 12);
// → "$2a$12$LJ3m4ys..." (irreversible)

// Verifier un mot de passe (a la connexion)
const isValid = await bcrypt.compare("MonMotDePasse123!", hash);
// → true
```

Le `12` est le "cost factor" — il determine la lenteur. 12 = ~250ms par hash,
ce qui est imperceptible pour un utilisateur mais catastrophique pour un
attaquant qui doit tester des millions de combinaisons.

---

## 4. Zod — La validation des donnees

### C'est quoi ?

Zod est une librairie de **validation de schema** pour TypeScript. Elle valide
les donnees entrantes (formulaires, requetes API) et genere les types
TypeScript correspondants.

```typescript
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "L'identifiant est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

// Valider les donnees
const result = loginSchema.safeParse(formData);
if (!result.success) {
  // result.error contient les messages d'erreur en detail
}
```

On l'utilise sur **chaque formulaire** et **chaque endpoint API** pour garantir
que les donnees sont valides avant de toucher a la base de donnees.

---

## 5. Architecture de la Phase 2

### Nouvelles routes

```
src/app/
├── (auth)/                        # Route group sans header/footer
│   ├── layout.tsx                 # Layout minimal (fond sombre, centre)
│   ├── connexion/page.tsx         # Formulaire de connexion
│   └── mot-de-passe-oublie/page.tsx
├── espace-membre/                 # Route group protege
│   ├── layout.tsx                 # Layout avec sidebar
│   ├── page.tsx                   # Dashboard
│   ├── calendrier/page.tsx        # Calendrier evenements
│   ├── inscriptions/page.tsx      # Mes inscriptions
│   └── profil/page.tsx            # Mon profil
└── api/
    └── auth/
        └── [...nextauth]/route.ts # Handlers NextAuth auto-generes
```

### Nouveaux fichiers lib/services

```
src/lib/
├── auth.ts                        # Config NextAuth (providers, callbacks)
├── prisma.ts                      # Instance singleton du client Prisma
├── validations.ts                 # Schemas Zod (login, profil, inscription)
└── permissions.ts                 # Helpers hasRole(), requireRole()

src/services/
├── membres.ts                     # CRUD utilisateurs, generation username
└── email.ts                       # Envoi d'emails (Resend)
```

### Flux de connexion

```
1. Utilisateur va sur /connexion
2. Saisit identifiant + mot de passe
3. Submit → Server Action appelle signIn("credentials", ...)
4. NextAuth appelle authorize() :
   a. Cherche l'utilisateur par username (Prisma)
   b. Verifie le mot de passe (bcrypt)
   c. Charge les roles depuis UserRole
   d. Retourne l'utilisateur ou erreur
5. NextAuth cree un JWT avec les infos utilisateur
6. Cookie securise pose dans le navigateur
7. Redirect vers /espace-membre
8. Middleware verifie le cookie → OK → page affichee
```

### Flux de protection des routes

```
Toute requete HTTP :
  → middleware.ts intercepte
  → Lit le cookie de session (JWT)
  → /espace-membre/* : pas de session ? → redirect /connexion
  → /admin/* : pas de role ADMIN/DEV ? → redirect /espace-membre
  → Sinon : laisse passer
```

---

## 6. Base de donnees en developpement

En local, on a deux options :

1. **Docker PostgreSQL** (recommande si Docker est installe) :
   ```bash
   docker run -d --name staffez-db -e POSTGRES_PASSWORD=staffez -e POSTGRES_DB=staffez_les_tous -p 5432:5432 postgres:16
   ```

2. **PostgreSQL installe localement** (Windows : installer via pgAdmin ou Chocolatey)

La variable `DATABASE_URL` dans `.env.local` pointe vers cette base.

> **Note** : On ne peut pas utiliser SQLite en prod (Vercel ne le supporte pas),
> mais Prisma supporte les deux en dev si besoin.

---

## 7. Ce qui est implemente en Phase 2 vs ce qui attend

| Fonctionnalite                      | Phase 2 | Phase 3+ |
|-------------------------------------|---------|----------|
| Schema Prisma complet               | oui     | —        |
| Connexion / deconnexion             | oui     | —        |
| Middleware protection routes        | oui     | —        |
| Page connexion                      | oui     | —        |
| Page mot de passe oublie            | oui     | —        |
| Dashboard membre                    | oui     | —        |
| Profil membre (lecture + edition)   | oui     | —        |
| Calendrier evenements               | oui     | —        |
| Inscription a un evenement          | oui     | —        |
| Liste mes inscriptions              | oui     | —        |
| Sidebar espace membre               | oui     | —        |
| Creation de comptes (admin)         | —       | Phase 3  |
| CRUD evenements (admin)             | —       | Phase 3  |
| Gestion roles (admin)               | —       | Phase 3  |
| Workflow publications               | —       | Phase 3  |
| Boutique                            | —       | Phase 4  |
| Vie associative                     | —       | Phase 4  |

---

## 8. Commandes utiles Phase 2

```bash
# Generer le client Prisma apres modification du schema
npx prisma generate

# Creer et appliquer une migration
npx prisma migrate dev --name nom_de_la_migration

# Ouvrir Prisma Studio (visualiser les donnees)
npx prisma studio

# Seeder la base avec des donnees de test
npx prisma db seed
```
