# ADR-002 : Modele de donnees et authentification

## Statut

Accepte

## Contexte

Le site gere des adherents avec des identifiants generes par le bureau, des evenements
avec des inscriptions benevoles, des publications moderees, et a terme une boutique.
Le modele de donnees doit supporter ces entites et leurs relations, tout en etant
evolutif pour les phases futures.

## Decision

### ORM et base de donnees

- **Prisma** comme ORM avec **PostgreSQL** comme SGBD.
- Le schema Prisma est la source de verite pour le modele de donnees.
- Les migrations sont versionnees et commitees dans le depot.

### Schema principal (Phase 1-3)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── UTILISATEURS ─────────────────────────────────────────

model User {
  id            String         @id @default(cuid())
  username      String         @unique           // identifiant genere (spuy, spuy02...)
  email         String         @unique
  passwordHash  String
  firstName     String
  lastName      String
  phone         String?
  photo         String?                          // URL de la photo de profil
  bio           String?                          // presentation personnelle
  allergies     String?                          // allergies / regime alimentaire
  isActive      Boolean        @default(true)
  roles         UserRole[]
  inscriptions  Inscription[]
  publications  Publication[]  @relation("author")
  validations   Publication[]  @relation("validator")
  votes         Vote[]
  ideas         Idea[]
  ideaLikes     IdeaLike[]
  orders        Order[]
  auditLogs     AuditLog[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model UserRole {
  id          String    @id @default(cuid())
  user        User      @relation(fields: [userId], references: [id])
  userId      String
  role        Role
  // Pour le role COORDINATEUR : evenement specifique
  event       Event?    @relation(fields: [eventId], references: [id])
  eventId     String?
  assignedAt  DateTime  @default(now())

  @@unique([userId, role, eventId])
}

enum Role {
  EDITEUR
  ADMINISTRATEUR
  COORDINATEUR
  DEVELOPPEUR
}

// ─── EVENEMENTS ───────────────────────────────────────────

model Event {
  id              String         @id @default(cuid())
  title           String
  slug            String         @unique
  description     String                         // texte riche (HTML ou Markdown)
  missions        String?                        // description des missions
  coverImage      String?                        // image principale
  photos          String[]                       // galerie
  startDate       DateTime?
  endDate         DateTime?
  location        String?
  type            EventType      @default(PRESTATION)
  status          EventStatus    @default(BROUILLON)
  inscriptionOpen Boolean        @default(false)
  maxVolunteers   Int?
  coordinators    UserRole[]
  inscriptions    Inscription[]
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

enum EventType {
  PRESTATION
  VIE_ASSOCIATIVE
}

enum EventStatus {
  BROUILLON
  PUBLIE
  ARCHIVE
}

// ─── INSCRIPTIONS ─────────────────────────────────────────

model Inscription {
  id          String              @id @default(cuid())
  user        User                @relation(fields: [userId], references: [id])
  userId      String
  event       Event               @relation(fields: [eventId], references: [id])
  eventId     String
  status      InscriptionStatus   @default(EN_ATTENTE)
  position    String?                              // poste affecte
  schedule    String?                              // horaires
  notes       String?
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt

  @@unique([userId, eventId])
}

enum InscriptionStatus {
  EN_ATTENTE
  VALIDEE
  REFUSEE
}

// ─── PUBLICATIONS ─────────────────────────────────────────

model Publication {
  id            String              @id @default(cuid())
  title         String
  content       String                             // texte riche
  coverImage    String?
  category      PublicationCategory
  status        PublicationStatus   @default(BROUILLON)
  author        User                @relation("author", fields: [authorId], references: [id])
  authorId      String
  validator     User?               @relation("validator", fields: [validatorId], references: [id])
  validatorId   String?
  validationComment String?
  publishedAt   DateTime?
  createdAt     DateTime            @default(now())
  updatedAt     DateTime            @updatedAt
}

enum PublicationCategory {
  NEWSLETTER
  ANNONCE_EVENEMENT
  ACTUALITE
}

enum PublicationStatus {
  BROUILLON
  EN_ATTENTE
  APPROUVEE
  REJETEE
}

// ─── SONDAGES ─────────────────────────────────────────────

model Poll {
  id          String       @id @default(cuid())
  question    String
  options     PollOption[]
  closesAt    DateTime
  createdAt   DateTime     @default(now())
}

model PollOption {
  id      String  @id @default(cuid())
  label   String
  poll    Poll    @relation(fields: [pollId], references: [id])
  pollId  String
  votes   Vote[]
}

model Vote {
  id        String     @id @default(cuid())
  user      User       @relation(fields: [userId], references: [id])
  userId    String
  option    PollOption @relation(fields: [optionId], references: [id])
  optionId  String
  createdAt DateTime   @default(now())

  @@unique([userId, optionId])
}

// ─── BOITE A IDEES ────────────────────────────────────────

model Idea {
  id          String     @id @default(cuid())
  title       String     @db.VarChar(100)
  description String     @db.VarChar(500)
  author      User       @relation(fields: [authorId], references: [id])
  authorId    String
  isApproved  Boolean    @default(false)
  likes       IdeaLike[]
  createdAt   DateTime   @default(now())
}

model IdeaLike {
  id      String @id @default(cuid())
  user    User   @relation(fields: [userId], references: [id])
  userId  String
  idea    Idea   @relation(fields: [ideaId], references: [id])
  ideaId  String

  @@unique([userId, ideaId])
}

// ─── BOUTIQUE (Phase 4) ──────────────────────────────────

model Product {
  id            String          @id @default(cuid())
  title         String
  slug          String          @unique
  description   String
  image         String?
  priceMember   Int                              // prix en centimes (tarif adherent)
  pricePublic   Int?                             // prix en centimes (tarif public, v2)
  variants      ProductVariant[]
  isAvailable   Boolean         @default(true)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
}

model ProductVariant {
  id        String      @id @default(cuid())
  label     String                                // ex: "T-shirt M", "T-shirt L"
  stock     Int         @default(0)
  product   Product     @relation(fields: [productId], references: [id])
  productId String
  orderItems OrderItem[]
}

model Order {
  id          String        @id @default(cuid())
  orderNumber String        @unique
  user        User          @relation(fields: [userId], references: [id])
  userId      String
  items       OrderItem[]
  status      OrderStatus   @default(EN_ATTENTE)
  totalCents  Int
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model OrderItem {
  id        String         @id @default(cuid())
  order     Order          @relation(fields: [orderId], references: [id])
  orderId   String
  variant   ProductVariant @relation(fields: [variantId], references: [id])
  variantId String
  quantity  Int
  unitPrice Int                                   // prix unitaire en centimes au moment de la commande
}

enum OrderStatus {
  EN_ATTENTE
  PAYEE
  LIVREE
  ANNULEE
}

// ─── AUDIT ────────────────────────────────────────────────

model AuditLog {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  action    String                                // ex: "CREATE_USER", "VALIDATE_PUBLICATION"
  target    String                                // ex: "User:cuid123", "Publication:cuid456"
  details   Json?
  createdAt DateTime @default(now())
}

// ─── FORMULAIRES DE CONTACT (public) ─────────────────────

model ContactSubmission {
  id        String          @id @default(cuid())
  type      ContactType
  firstName String
  lastName  String
  email     String
  phone     String?
  message   String
  // Champs specifiques recrutement
  eventsOfInterest String[]
  // Champs specifiques organisateurs
  eventName    String?
  eventDates   String?
  organization String?
  isProcessed  Boolean      @default(false)
  createdAt    DateTime     @default(now())
}

enum ContactType {
  RECRUTEMENT
  ORGANISATEUR
}
```

### Authentification

- **NextAuth.js v5** avec `CredentialsProvider`.
- Le mot de passe est hashe avec **bcrypt** (cost factor 12).
- Session stockee en **JWT** (cookie httpOnly, secure, sameSite=lax).
- Middleware Next.js protege les routes `/espace-membre/*` et `/admin/*`.
- Rate limiting sur `/api/auth/login` : 5 tentatives max par IP par 15 minutes.

### Generation d'identifiant

Algorithme implemente dans `src/services/membres.ts` :

```typescript
function generateUsername(firstName: string, lastName: string): string {
  const base = normalize(firstName.charAt(0) + lastName); // sans accents, minuscule, sans espaces/tirets
  // Chercher en BDD le nombre d'identifiants commencant par `base`
  // Si 0 → retourner base
  // Si N → retourner base + String(N + 1).padStart(2, "0")
}
```

## Consequences

- Le schema Prisma couvre toutes les phases (1-4). Les tables des phases futures
  (boutique, sondages, idees) existent dans le schema mais ne sont utilisees
  qu'a partir de leur phase respective.
- Les enums en francais (`EN_ATTENTE`, `VALIDEE`, `BROUILLON`) permettent une
  correspondance directe avec l'UI sans mapping supplementaire.
- Les prix en centimes (Int) evitent les problemes de virgule flottante.
- L'audit log couvre toutes les actions sensibles.

## Alternatives envisagees

| Alternative       | Raison du rejet                                                 |
|-------------------|-----------------------------------------------------------------|
| MongoDB           | Relations complexes (roles, inscriptions) mieux gerees en SQL  |
| Drizzle ORM       | Plus leger mais Prisma offre meilleure DX et documentation     |
| Session en BDD    | JWT plus simple, pas de table session a gerer                  |
| Argon2 au lieu de bcrypt | Performance similaire, bcrypt plus repandu dans l'ecosysteme Node |
