# Staffez Les Tous

Site web de l'association **Staffez Les Tous** — benevoles specialises dans le staffing evenementiel manga, gaming et pop culture.

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Langage | TypeScript (strict) |
| Styling | Tailwind CSS |
| ORM | Prisma |
| Base de donnees | PostgreSQL |
| Auth | NextAuth.js v5 |
| Email | Resend |
| Hebergement | Vercel |
| Tests | Jest + React Testing Library |

## Demarrage rapide

```bash
# Installer les dependances
npm install

# Lancer le serveur de dev (http://localhost:3000)
npm run dev

# Build production
npm run build

# Linter
npm run lint

# Type-check
npx tsc --noEmit

# Tests
npm test
```

## Structure du projet

```
src/
├── app/
│   ├── (public)/                # Pages publiques (vitrine)
│   │   ├── page.tsx             # Accueil
│   │   ├── evenements/          # Listing + detail evenements
│   │   ├── recrutement/         # Formulaire benevoles
│   │   ├── organisateurs/       # Formulaire partenaires
│   │   ├── contact/             # Reseaux et emails
│   │   └── mentions-legales/    # Mentions legales
│   ├── layout.tsx               # Layout racine (fonts, metadata)
│   └── globals.css              # Tailwind + composants CSS
├── components/
│   ├── layout/                  # Header, Footer
│   ├── ui/                      # Composants design system
│   └── features/                # Composants metier
├── lib/                         # Utilitaires (cn, formatDate, constantes)
├── types/                       # Types TypeScript partages
├── hooks/                       # Hooks React custom
└── services/                    # Clients API, services externes
```

## Documentation

| Document | Description |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Guidelines agents IA, code style, workflows |
| [`docs/specs/`](docs/specs/) | Specifications fonctionnelles (6 features) |
| [`docs/architecture/`](docs/architecture/) | Decisions d'architecture (ADR) |
| [`docs/design/`](docs/design/) | Design system et charte graphique |

## Phases de livraison

| Phase | Contenu | Statut |
|---|---|---|
| **1** | Site vitrine public (accueil, evenements, recrutement, organisateurs, contact) | En cours |
| **2** | Authentification + espace adherent (dashboard, calendrier, inscriptions, profil) | A venir |
| **3** | Administration (roles, publications, gestion evenements/inscriptions) | A venir |
| **4** | Boutique (merch) + vie associative (sorties, sondages, boite a idees) | A venir |

## Licence

Projet prive de l'association Staffez Les Tous.
