# AGENTS.md — Staffez Les Tous

Guidelines for AI coding agents operating in this repository.
This is a **Next.js 14+ (App Router)** web application built with **TypeScript** and **Tailwind CSS** for the "Staffez Les Tous" association.

---

## Build / Dev / Lint / Test Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint (ESLint)
npm run lint

# Type-check without emitting
npx tsc --noEmit

# Format (Prettier)
npx prettier --write .

# Run all tests
npm test

# Run a single test file
npx jest path/to/file.test.ts
# or with vitest (if configured):
npx vitest run path/to/file.test.ts

# Run tests matching a name pattern
npx jest -t "pattern"

# Run tests in watch mode
npx jest --watch
```

> Always run `npm run lint` and `npx tsc --noEmit` before committing.

---

## Project Structure

```
staffez-les-tous/
├── src/
│   ├── app/              # Next.js App Router (pages, layouts, routes)
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── (routes)/     # Route groups
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # Primitive/design-system components
│   │   └── features/     # Feature-specific components
│   ├── lib/              # Utilities, helpers, constants
│   ├── hooks/            # Custom React hooks
│   ├── types/            # Shared TypeScript type definitions
│   ├── services/         # API client functions, external service wrappers
│   └── styles/           # Global CSS / Tailwind config extensions
├── public/               # Static assets (images, fonts, icons)
├── tests/                # Test files (mirrors src/ structure)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Code Style Guidelines

### Language & Framework

- **TypeScript** is mandatory for all source files. Never use plain `.js`/`.jsx`.
- Use **strict mode** (`"strict": true` in tsconfig).
- Target **Next.js App Router** conventions (`app/` directory, Server Components by default).
- Mark Client Components explicitly with `"use client"` at the top of the file.

### Imports

Organize imports in this order, separated by blank lines:

```typescript
// 1. React / Next.js core
import { useState, useEffect } from "react";
import Link from "next/link";

// 2. Third-party libraries
import { clsx } from "clsx";

// 3. Internal modules (absolute paths via @/ alias)
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

// 4. Types (use `import type` when importing only types)
import type { Event } from "@/types/event";
```

- Always use the `@/` path alias (mapped to `src/`) — never use relative paths like `../../`.
- Use `import type` for type-only imports to enable proper tree-shaking.

### Formatting

- **Prettier** handles formatting — do not manually format.
- 2-space indentation, no tabs.
- Semicolons: **yes**.
- Quotes: **double quotes** for strings.
- Trailing commas: **all** (ES5+).
- Max line length: 100 characters (soft guideline).
- Always use parentheses around arrow function parameters: `(x) => x`.

### Naming Conventions

| Element               | Convention          | Example                    |
|-----------------------|---------------------|----------------------------|
| Components            | PascalCase          | `EventCard.tsx`            |
| Component files       | PascalCase          | `EventCard.tsx`            |
| Hooks                 | camelCase, `use-`   | `useAuth.ts`               |
| Utilities / lib       | camelCase            | `formatDate.ts`            |
| Types / Interfaces    | PascalCase          | `Event`, `MemberProfile`   |
| Constants             | UPPER_SNAKE_CASE    | `MAX_TEAM_SIZE`            |
| CSS classes           | Tailwind utilities  | `className="flex gap-4"`   |
| Route directories     | kebab-case          | `app/nos-evenements/`      |
| API route files       | `route.ts`          | `app/api/events/route.ts`  |

### TypeScript Types

- Prefer `interface` for object shapes that may be extended; use `type` for unions, intersections, and computed types.
- **Never use `any`**. Use `unknown` + type narrowing if the type is truly unknown.
- Always type function parameters and return values for exported functions.
- Use `Record<string, T>` instead of `{ [key: string]: T }`.
- Use `as const` for constant objects and literal tuples.

```typescript
// Good
interface EventProps {
  title: string;
  date: Date;
  attendees: number;
}

// Good — union type
type Status = "draft" | "published" | "archived";
```

### Components

- Use **function declarations** for page/layout components, **arrow functions** for smaller components.
- Keep components focused and small (< 150 lines). Extract sub-components when needed.
- Co-locate component-specific types in the same file if they are not shared.
- Props interfaces should be named `{ComponentName}Props`.

```typescript
// Page component
export default function EventsPage() { ... }

// Reusable component
interface EventCardProps {
  event: Event;
  onSelect?: (id: string) => void;
}

export const EventCard = ({ event, onSelect }: EventCardProps) => { ... };
```

### Error Handling

- Use `try/catch` for async operations (data fetching, API calls).
- In Server Components, use Next.js `error.tsx` boundary files.
- In Client Components, use React Error Boundaries where appropriate.
- Always provide user-friendly error messages in French (the site is in French).
- Log errors to console in development; integrate a logging service for production.

```typescript
try {
  const data = await fetchEvents();
  return data;
} catch (error) {
  console.error("Erreur lors du chargement des événements:", error);
  throw new Error("Impossible de charger les événements.");
}
```

### Styling

- Use **Tailwind CSS** utility classes as the primary styling method.
- Use `clsx` or `cn` (from `@/lib/utils`) to conditionally join class names.
- Avoid inline `style` props unless truly dynamic values are needed.
- Follow mobile-first responsive design: base styles for mobile, then `sm:`, `md:`, `lg:`.
- Use CSS variables for theme colors defined in `tailwind.config.ts`.

### Data Fetching

- Prefer **Server Components** for data fetching (no `useEffect` for initial loads).
- Use `fetch` with Next.js caching/revalidation options in Server Components.
- For client-side mutations or interactive data, use Server Actions or a library like SWR.
- Centralize API call functions in `src/services/`.

### Testing

- Write tests for utilities, hooks, and critical user flows.
- Use **Jest** + **React Testing Library** (or Vitest if configured).
- Test files live in `tests/` mirroring the `src/` structure, or co-located as `*.test.ts(x)`.
- Name test files: `ComponentName.test.tsx` or `utilName.test.ts`.
- Focus on behavior, not implementation details.

### Git & Commits

- Write commit messages in English, imperative mood: `add event listing page`.
- Keep commits atomic — one logical change per commit.
- Branch naming: `feature/short-description`, `fix/short-description`.

---

## Locale & Content

- The website content is in **French**. All user-facing strings must be in French.
- Use semantic HTML for accessibility (`<main>`, `<nav>`, `<article>`, `<section>`).
- All images must have meaningful French `alt` text.

---

## Common Gotchas

- **Server vs Client**: Components in `app/` are Server Components by default. Add `"use client"` only when you need hooks, event handlers, or browser APIs.
- **Path alias**: Always use `@/` — misconfigured paths silently fail in some editors.
- **Tailwind purge**: Only use complete class names (no string concatenation like `` `text-${color}` ``).
- **Next.js caching**: `fetch()` results are cached by default in Server Components. Use `{ cache: "no-store" }` or `{ next: { revalidate: N } }` to control this.

---

## Specialized Agents

Seven specialized agents can be invoked depending on the task. Each agent has a clear scope, inputs it expects, and artifacts it produces.

### 1. Analyst (Analyste)

**Role**: Understand the user need, clarify scope, produce functional specifications.

| Aspect       | Detail                                                                 |
|--------------|------------------------------------------------------------------------|
| Trigger      | Any new feature request, user story, or change request                 |
| Inputs       | User request (natural language), existing docs, domain context         |
| Activities   | Ask clarifying questions, identify actors/use cases, define acceptance criteria |
| Artifacts    | `docs/specs/FEAT-<name>.md` — functional spec with user stories, acceptance criteria, out-of-scope |
| Rules        | All specs written in French. Must list acceptance criteria as checkboxes. |

### 2. Architect (Architecte)

**Role**: Make technical decisions, define structure, document trade-offs.

| Aspect       | Detail                                                                 |
|--------------|------------------------------------------------------------------------|
| Trigger      | After Analyst spec is validated, or for any structural/technical question |
| Inputs       | Functional spec, existing codebase, performance/scale requirements     |
| Activities   | Choose patterns, define data models, plan file/folder structure, write ADR |
| Artifacts    | `docs/architecture/ADR-<NNN>-<title>.md` — Architecture Decision Record |
| Rules        | Must justify choices with trade-offs. Must reference Next.js App Router conventions. |

### 3. Designer (Concepteur UI)

**Role**: Define UI structure, component hierarchy, Tailwind design tokens.

| Aspect       | Detail                                                                 |
|--------------|------------------------------------------------------------------------|
| Trigger      | After architecture is defined, or for any UI/UX task                   |
| Inputs       | Functional spec, architecture doc, existing design system              |
| Activities   | Define component tree, props interfaces, responsive breakpoints, a11y  |
| Artifacts    | `docs/design/UI-<name>.md` — component spec with props, variants, layout |
| Rules        | Mobile-first. Tailwind only. Must specify a11y attributes. French labels. |

### 4. Developer (Developpeur)

**Role**: Write production code following specs, architecture, and design docs.

| Aspect       | Detail                                                                 |
|--------------|------------------------------------------------------------------------|
| Trigger      | After specs + architecture + design are available (or for small tasks) |
| Inputs       | All upstream docs, existing codebase                                   |
| Activities   | Implement components, pages, API routes, services, hooks, types        |
| Artifacts    | Source files in `src/`                                                  |
| Rules        | Follow all Code Style Guidelines above. Server Components by default. `"use client"` only when needed. |

### 5. Reviewer (Relecteur)

**Role**: Review code for quality, consistency, security, and conformity to standards.

| Aspect       | Detail                                                                 |
|--------------|------------------------------------------------------------------------|
| Trigger      | After Developer completes implementation                               |
| Inputs       | Changed files, specs, architecture doc                                 |
| Activities   | Check types, naming, imports, a11y, security, performance, spec conformity |
| Artifacts    | Review comments (inline or summary)                                    |
| Rules        | Must run `npm run lint` + `npx tsc --noEmit` and report results. Must verify acceptance criteria. |

### 6. Tester (Testeur)

**Role**: Write and run tests to validate behavior.

| Aspect       | Detail                                                                 |
|--------------|------------------------------------------------------------------------|
| Trigger      | After implementation and review pass                                   |
| Inputs       | Source code, acceptance criteria from spec                             |
| Activities   | Write unit tests, integration tests, verify edge cases                 |
| Artifacts    | Test files in `tests/` or co-located `*.test.ts(x)`                   |
| Rules        | Cover every acceptance criterion. Test behavior, not implementation. Name tests in French (`"devrait afficher..."`). |

### 7. DevOps (Ops)

**Role**: Handle configuration, CI/CD, deployment, environment setup.

| Aspect       | Detail                                                                 |
|--------------|------------------------------------------------------------------------|
| Trigger      | Project init, dependency changes, deployment needs                     |
| Inputs       | Package requirements, environment constraints                          |
| Activities   | Configure tools, write CI pipelines, manage env variables, optimize builds |
| Artifacts    | Config files (`next.config.js`, `tailwind.config.ts`, `.github/workflows/`, `.env.example`) |
| Rules        | Never commit secrets. Always provide `.env.example` with placeholder values. |

---

## Workflows — Step-by-Step Pipelines

### Workflow A: New Feature (Nouvelle fonctionnalite)

This is the full pipeline. Every non-trivial feature must follow these steps in order.

```
Step  Agent       Action                                    Artifact
----  ----------  ----------------------------------------  ---------------------------------
1     Analyst     Clarify need, write functional spec       docs/specs/FEAT-<name>.md
2     Architect   Define data model, patterns, file plan    docs/architecture/ADR-<NNN>.md
3     Designer    Component tree, props, layout, a11y       docs/design/UI-<name>.md
4     Developer   Implement code                            src/**/*.tsx, src/**/*.ts
5     Reviewer    Code review, lint, type-check             Review comments / fixes
6     Tester      Write & run tests                         tests/**/*.test.ts(x)
7     Developer   Fix issues from review & tests            Updated source files
8     DevOps      Update config if needed, verify build     Config files, CI green
```

**Gate rules:**
- Step 2 cannot start until Step 1 spec has acceptance criteria.
- Step 4 cannot start until Steps 2 and 3 produce artifacts.
- Step 6 must cover all acceptance criteria from Step 1.
- The feature is done only when `npm run build` and `npm test` pass.

### Workflow B: Bug Fix (Correction de bug)

```
Step  Agent       Action                                    Artifact
----  ----------  ----------------------------------------  ---------------------------------
1     Analyst     Reproduce bug, document expected vs actual docs/specs/BUG-<name>.md
2     Tester      Write a failing test that exposes the bug tests/**/*.test.ts(x)
3     Developer   Fix the code (test must now pass)         Updated source files
4     Reviewer    Review the fix for regressions            Review comments
5     Tester      Run full test suite, confirm no regressions All tests green
```

**Gate rules:**
- Step 3 cannot start until Step 2 has a failing test.
- The fix is done only when the failing test passes AND no other test breaks.

### Workflow C: New Page / Route (Nouvelle page)

```
Step  Agent       Action                                    Artifact
----  ----------  ----------------------------------------  ---------------------------------
1     Analyst     Define page purpose, content, SEO needs   Brief in docs/specs/
2     Designer    Layout, responsive design, component list docs/design/UI-<name>.md
3     Architect   Route structure, data fetching strategy   Notes in ADR or inline
4     Developer   Create page.tsx, layout.tsx, components   src/app/<route>/page.tsx
5     Reviewer    Check a11y, SEO, responsiveness, i18n     Review comments
6     Tester      Test rendering & key interactions         tests/**/*.test.tsx
```

### Workflow D: New API Endpoint (Nouvel endpoint API)

```
Step  Agent       Action                                    Artifact
----  ----------  ----------------------------------------  ---------------------------------
1     Analyst     Define request/response contract, errors  docs/specs/API-<name>.md
2     Architect   Validate REST conventions, auth needs     ADR or inline notes
3     Developer   Implement route handler + service layer   src/app/api/<route>/route.ts
4     Tester      Test happy path, error cases, edge cases  tests/api/<route>.test.ts
5     Reviewer    Check security, validation, error codes   Review comments
```

### Workflow E: Refactoring

```
Step  Agent       Action                                    Artifact
----  ----------  ----------------------------------------  ---------------------------------
1     Analyst     Define goal (performance, readability...) Brief scope doc
2     Tester      Ensure existing test coverage is solid    Additional tests if gaps found
3     Architect   Plan the refactoring approach             ADR if structural changes
4     Developer   Refactor code                             Updated source files
5     Tester      Run full suite, confirm no regressions    All tests green
6     Reviewer    Verify improvements, no behavior changes  Review comments
```

**Gate rules:**
- Step 4 cannot start until Step 2 confirms test coverage is sufficient.
- No behavior change is allowed unless explicitly stated in Step 1.

### Workflow F: New UI Component (Nouveau composant)

```
Step  Agent       Action                                    Artifact
----  ----------  ----------------------------------------  ---------------------------------
1     Designer    Define variants, props, a11y, responsive  docs/design/UI-<name>.md
2     Developer   Implement component                       src/components/**/<Name>.tsx
3     Tester      Test all variants and interactions        tests/components/<Name>.test.tsx
4     Reviewer    Check reusability, a11y, design conformity Review comments
```

---

## Artifact Templates

### Functional Spec (`docs/specs/FEAT-<name>.md`)

```markdown
# FEAT-<name> : <Titre en francais>

## Contexte
Pourquoi cette fonctionnalite est necessaire.

## Acteurs
- Qui utilise cette fonctionnalite.

## User Stories
- En tant que <acteur>, je veux <action>, afin de <benefice>.

## Criteres d'acceptation
- [ ] Critere 1
- [ ] Critere 2

## Hors perimetre
- Ce qui n'est PAS inclus.
```

### Architecture Decision Record (`docs/architecture/ADR-<NNN>-<title>.md`)

```markdown
# ADR-<NNN> : <Titre>

## Statut
Propose | Accepte | Rejete | Remplace

## Contexte
Quel probleme technique doit etre resolu.

## Decision
La solution choisie et comment elle s'integre.

## Consequences
- Avantages
- Inconvenients
- Compromis

## Alternatives envisagees
Autre(s) approche(s) et pourquoi elles ont ete ecartees.
```

### UI Component Spec (`docs/design/UI-<name>.md`)

```markdown
# UI-<name> : <Nom du composant>

## Role
Description courte du composant.

## Props
| Prop      | Type     | Requis | Default | Description          |
|-----------|----------|--------|---------|----------------------|
| title     | string   | oui    | —       | Titre affiche        |
| variant   | "primary" \| "secondary" | non | "primary" | Style visuel |

## Variants
- primary : fond bleu, texte blanc
- secondary : fond gris, texte noir

## Responsive
- Mobile : pleine largeur
- md+ : largeur fixe 400px

## Accessibilite
- role, aria-label, focus management
```

---

## How to Invoke an Agent

When asking an AI agent to perform work in this repository, use this pattern:

```
Agent: <agent-name>
Workflow: <workflow-letter> Step <number>
Context: <link to upstream artifacts or brief description>
Task: <what to do>
```

Example:

```
Agent: Developer
Workflow: A Step 4
Context: See docs/specs/FEAT-event-list.md and docs/design/UI-event-list.md
Task: Implement the event listing page at src/app/evenements/page.tsx
```

The agent must:
1. Read all referenced upstream artifacts before starting.
2. Follow the Code Style Guidelines defined in this file.
3. Produce the artifacts listed for its step in the workflow.
4. Report what was done and what the next step is.
