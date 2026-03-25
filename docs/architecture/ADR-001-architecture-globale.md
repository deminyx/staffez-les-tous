# ADR-001 : Architecture globale et stack technique

## Statut

Accepte

## Contexte

Staffez Les Tous a besoin d'un site web evolutif qui combine :
- Un site vitrine public (statique/SSR pour le SEO)
- Un espace prive type intranet (dashboard, inscriptions, profil)
- Un back-office d'administration (gestion contenu, evenements, adherents)
- Une boutique interne (v2)

Le site doit etre maintenable par une petite equipe technique (3 personnes), evolutif
(ajout de modules dans le temps) et performant (SEO, temps de chargement).

Le projet est decoupe en phases de livraison successives.

## Decision

### Stack technique

| Couche         | Technologie                  | Justification                                         |
|----------------|------------------------------|-------------------------------------------------------|
| Framework      | **Next.js 14+ (App Router)** | SSR/SSG pour le SEO, Server Components, API Routes    |
| Langage        | **TypeScript (strict)**      | Typage statique, maintenabilite, DX                   |
| Styling        | **Tailwind CSS**             | Utilitaire, rapide, coherent, mobile-first            |
| Composants UI  | **Radix UI + Tailwind**      | Accessibilite native, headless, personnalisable       |
| Base de donnees| **PostgreSQL**               | Relationnelle, robuste, gratuite, adaptee aux roles   |
| ORM            | **Prisma**                   | Type-safe, migrations, introspection, DX              |
| Authentification| **NextAuth.js (Auth.js v5)**| Credentials provider, sessions, middleware protege    |
| Email          | **Resend** (ou Nodemailer)   | API simple, templates React Email                     |
| Hebergement    | **Vercel**                   | Zero-config Next.js, preview deploys, edge functions  |
| BDD hebergee   | **Vercel Postgres** ou **Supabase** | Managed PostgreSQL, backup auto                |
| Stockage media | **Vercel Blob** ou **Cloudinary** | Images optimisees, CDN                           |
| Tests          | **Jest + React Testing Library** | Standard React, bonne integration Next.js         |
| CI/CD          | **GitHub Actions**           | Lint, type-check, tests, deploy preview               |

### Structure des dossiers

```
src/
├── app/
│   ├── (public)/              # Groupe de routes publiques
│   │   ├── page.tsx           # Accueil
│   │   ├── evenements/
│   │   ├── recrutement/
│   │   ├── organisateurs/
│   │   ├── contact/
│   │   └── mentions-legales/
│   ├── (auth)/                # Groupe auth (layout minimal)
│   │   ├── connexion/
│   │   └── mot-de-passe-oublie/
│   ├── espace-membre/         # Espace prive (layout avec sidebar)
│   │   ├── page.tsx           # Dashboard
│   │   ├── calendrier/
│   │   ├── inscriptions/
│   │   ├── profil/
│   │   ├── boutique/
│   │   └── vie-associative/
│   ├── admin/                 # Back-office (layout admin)
│   │   ├── page.tsx           # Dashboard admin
│   │   ├── utilisateurs/
│   │   ├── publications/
│   │   ├── evenements/
│   │   └── boutique/
│   ├── api/                   # API Routes
│   │   ├── auth/
│   │   ├── evenements/
│   │   ├── inscriptions/
│   │   ├── publications/
│   │   └── admin/
│   ├── layout.tsx             # Root layout
│   └── globals.css
├── components/
│   ├── ui/                    # Boutons, inputs, cards, modals...
│   ├── layout/                # Header, Footer, Sidebar, Navigation
│   └── features/              # Composants metier (EventCard, InscriptionBadge...)
├── lib/
│   ├── utils.ts               # Helpers (cn, formatDate...)
│   ├── constants.ts           # Constantes globales
│   ├── auth.ts                # Config NextAuth
│   └── prisma.ts              # Instance Prisma
├── services/                  # Logique metier et acces donnees
│   ├── evenements.ts
│   ├── inscriptions.ts
│   ├── membres.ts
│   ├── publications.ts
│   └── email.ts
├── hooks/                     # Hooks React custom
├── types/                     # Types TypeScript partages
└── styles/                    # Extensions Tailwind
```

### Phases de livraison

```
Phase 1 — Site public (vitrine)
  ├── Pages publiques (accueil, evenements, recrutement, organisateurs, contact)
  ├── Formulaires de contact (benevoles + organisateurs)
  ├── SEO, accessibilite, responsive
  └── Deploiement initial sur Vercel

Phase 2 — Authentification + Espace adherent
  ├── Systeme d'auth (NextAuth credentials)
  ├── Generation d'identifiants et MDP
  ├── Dashboard adherent
  ├── Calendrier et inscriptions
  └── Profil adherent

Phase 3 — Administration
  ├── Back-office admin
  ├── Gestion des roles et permissions
  ├── Workflow de publication (editeur → validation admin)
  ├── CRUD evenements
  └── Gestion des inscriptions (coordinateur)

Phase 4 — Extensions
  ├── Boutique / merch
  ├── Vie associative (sorties, sondages, boite a idees)
  └── Ouverture boutique au public (tarifs differencies)
```

## Consequences

### Avantages
- Stack 100% TypeScript (front + back) : une seule competence a maitriser.
- Next.js App Router : Server Components par defaut = performance + SEO.
- Prisma + PostgreSQL : modele de donnees type-safe, migrations versionnees.
- Tailwind : coherence visuelle, pas de fichiers CSS a maintenir.
- Vercel : deploiement automatique, preview par branche, zero config.
- Architecture modulaire : chaque phase est independante et incrementale.

### Inconvenients
- Vercel : cout potentiel si le trafic augmente (mais gratuit en plan Hobby).
- NextAuth Credentials : moins securise qu'OAuth (mais impose par le besoin bureau-gere).
- PostgreSQL : necessite un service managed (pas de SQLite en prod sur Vercel).

### Compromis
- On privilegie la simplicite et la DX sur l'hyper-scalabilite (association, pas startup).
- On utilise des Server Actions pour les mutations simples, des API Routes pour les cas
  complexes (webhooks, integrations).

## Alternatives envisagees

| Alternative          | Raison du rejet                                                    |
|----------------------|--------------------------------------------------------------------|
| CMS (WordPress)      | Manque de flexibilite pour l'intranet et les roles sur-mesure     |
| SPA (React + Vite)   | Pas de SSR natif, SEO complique, double infra (front + API)      |
| Firebase             | Vendor lock-in, modele NoSQL peu adapte aux relations complexes   |
| Django / Rails       | Equipe front-focused, perte de la stack unifiee TypeScript        |
| Remix                | Moins mature que Next.js, ecosysteme plus petit                   |
