# UI-design-system : Charte graphique et design system

## Identite visuelle de l'association

### Mascotte / Logo
Le logo de Staffez Les Tous est un **kitsune** (renard a neuf queues) dans un style
esport/manga. Il existe en deux declinaisons :
- **Logo complet** : kitsune + banniere rouge avec texte "STAFFEZ LES TOUS" en blanc bold
- **Logo compact** : kitsune seul (tete uniquement), utilise sur le merch et en favicon

Le logo doit toujours etre affiche sur fond sombre ou neutre. Ne jamais deformer
les proportions. Zone de protection minimale : 16px autour du logo.

### Univers visuel
L'association evolue dans l'univers de l'**evenementiel manga/gaming/pop culture**
(conventions, festivals type Art to Play). Le ton visuel oscille entre :
- **Professionnel et structure** (fiches de poste, guides benevoles) : fond clair, rouge sobre
- **Dynamique et energique** (reseaux, merch, annonces) : fonds sombres, rouge vif, bold

Le site web doit combiner ces deux registres : serieux pour la vitrine publique et
les espaces admin, plus dynamique pour l'espace adherent et les annonces.

---

## Palette de couleurs

### Couleurs principales

| Token               | Hex       | Usage                                          |
|----------------------|-----------|-------------------------------------------------|
| `--color-red`        | `#B91C1C` | Rouge primaire (bandeaux, headers, CTA)         |
| `--color-red-dark`   | `#7F1D1D` | Rouge sombre (texte sur fond clair, titres)     |
| `--color-red-vivid`  | `#DC2626` | Rouge vif (accents, badges, alertes, hover)     |
| `--color-black`      | `#111111` | Noir profond (texte principal, fonds sombres)   |
| `--color-white`      | `#FFFFFF` | Blanc (fonds clairs, texte sur fond sombre)     |
| `--color-gray-50`    | `#F9FAFB` | Gris tres clair (fond de page, sections alternes)|
| `--color-gray-100`   | `#F3F4F6` | Gris clair (cartes, encadres)                   |
| `--color-gray-400`   | `#9CA3AF` | Gris moyen (texte secondaire, placeholders)     |
| `--color-gray-700`   | `#374151` | Gris fonce (texte corps sur fond clair)         |
| `--color-gray-900`   | `#1A1A2E` | Fond sombre (espace adherent, sections dark)    |

### Couleurs semantiques

| Token               | Hex       | Usage                                          |
|----------------------|-----------|-------------------------------------------------|
| `--color-success`    | `#16A34A` | Vert — validation, inscription validee          |
| `--color-warning`    | `#D97706` | Ambre — en attente, attention                   |
| `--color-error`      | `#DC2626` | Rouge vif — erreur, inscription refusee         |
| `--color-info`       | `#2563EB` | Bleu — information, lien                        |

### Configuration Tailwind

```typescript
// tailwind.config.ts — theme.extend.colors
colors: {
  brand: {
    red: "#B91C1C",
    "red-dark": "#7F1D1D",
    "red-vivid": "#DC2626",
    black: "#111111",
  },
  surface: {
    light: "#F9FAFB",
    card: "#F3F4F6",
    dark: "#1A1A2E",
  },
}
```

---

## Typographie

### Polices

| Usage              | Police                    | Fallback                    |
|--------------------|---------------------------|-----------------------------|
| Titres (display)   | **Montserrat** (800, 900) | `sans-serif`                |
| Corps de texte     | **Inter** (400, 500, 600) | `system-ui, sans-serif`     |
| Monospace (code)   | **JetBrains Mono**        | `monospace`                 |

Montserrat est choisie pour sa proximite avec les typos bold/condensees utilisees dans
les visuels de l'association (titres gras, majuscules, impactants). Inter pour la lisibilite
du texte courant.

### Echelle typographique

| Classe Tailwind  | Taille | Poids | Usage                                    |
|------------------|--------|-------|------------------------------------------|
| `text-4xl`       | 36px   | 900   | Titre hero (h1 page d'accueil)           |
| `text-3xl`       | 30px   | 800   | Titres de section (h2)                   |
| `text-2xl`       | 24px   | 800   | Sous-titres (h3)                         |
| `text-xl`        | 20px   | 600   | Titres de cartes                         |
| `text-lg`        | 18px   | 500   | Texte mis en avant                       |
| `text-base`      | 16px   | 400   | Corps de texte                           |
| `text-sm`        | 14px   | 400   | Texte secondaire, labels                 |
| `text-xs`        | 12px   | 400   | Captions, metadata                       |

### Regles typographiques
- Titres principaux : **majuscules + bold** (rappel des visuels asso)
- Titres de sections : **capitalize ou uppercase**, rouge sombre sur fond clair
- Corps de texte : casse normale, gris fonce `gray-700` sur fond clair, blanc sur fond sombre
- Liens : rouge vif `red-vivid`, underline au hover

---

## Composants de base

### Bandeaux / Headers

Inspires directement des fiches de poste et du briefing :

```
┌──────────────────────────────────────────────┐
│  FOND ROUGE (#B91C1C)                        │
│  TITRE EN BLANC, BOLD, UPPERCASE             │
│  Sous-titre en blanc, lighter                │
└──────────────────────────────────────────────┘
```

- Header de page : bandeau pleine largeur, fond `brand-red`, texte blanc, `py-8 md:py-12`
- Le site public utilise un header rouge sobre
- L'espace adherent utilise un header sombre `surface-dark` avec accents rouges

### Navigation principale (public)

```
┌─ Logo ────────── Accueil | Evenements | Recrutement | Organisateurs | Contact ── [Connexion] ─┐
```

- Barre fixe (sticky), fond blanc avec ombre subtile, ou fond sombre selon scroll
- Logo compact a gauche, liens au centre, bouton connexion a droite (encadre rouge)
- Mobile : hamburger menu, drawer lateral depuis la gauche

### Navigation espace membre (sidebar)

```
┌──────────┬──────────────────────────────────┐
│ LOGO     │  Bandeau nouveautes (defilant)   │
│          ├──────────────────────────────────┤
│ Dashboard│                                  │
│ Calendrier│        Contenu principal        │
│ Inscriptions│                               │
│ Profil   │                                  │
│ Boutique │                                  │
│ Vie asso │                                  │
│          │                                  │
│ [Deconnexion]│                              │
└──────────┴──────────────────────────────────┘
```

- Sidebar fond `surface-dark`, texte blanc, icones, items avec hover rouge
- Sur mobile : sidebar masquee, accessible via hamburger
- Contenu principal fond `surface-light`

### Boutons

| Variante     | Fond           | Texte     | Bordure       | Usage                    |
|--------------|----------------|-----------|---------------|--------------------------|
| primary      | `brand-red`    | blanc     | —             | CTA principal            |
| secondary    | transparent    | `brand-red` | `brand-red` | Actions secondaires      |
| dark         | `brand-black`  | blanc     | —             | Actions sur fond clair   |
| ghost        | transparent    | `gray-700`| —             | Actions tertiaires       |
| danger       | `red-vivid`    | blanc     | —             | Suppression, annulation  |
| success      | `success`      | blanc     | —             | Validation               |

Etats : hover (assombrir 10%), focus (ring rouge 2px), disabled (opacity 50%).
Taille : `px-4 py-2 rounded-lg text-sm font-semibold` par defaut.
Taille large (hero) : `px-6 py-3 rounded-xl text-base`.

### Cartes

Inspirees du decoupage grille du visuel merch :

```
┌────────────────────────┐
│  IMAGE (aspect 16/9)   │
├────────────────────────┤
│  Titre (bold)          │
│  Description (2 lignes)│
│  [Badge statut]        │
│  [CTA]                 │
└────────────────────────┘
```

- Fond blanc, `rounded-xl`, `shadow-sm`, hover `shadow-md` + leger translate-y
- Bordure subtile `border border-gray-100`
- Image avec `object-cover`, overlay rouge semi-transparent au hover pour les evenements

### Badges / Tags

Inspires des "burst" du visuel merch (forme etoilee rouge pour les annonces urgentes) :

| Variante    | Fond          | Texte    | Usage                        |
|-------------|---------------|----------|------------------------------|
| default     | `gray-100`    | `gray-700` | Tag generique              |
| red         | `red-vivid`   | blanc    | Important, nouveau           |
| success     | `green-100`   | `green-800`| Inscription validee        |
| warning     | `amber-100`   | `amber-800`| En attente                 |
| error       | `red-100`     | `red-800`  | Refuse, erreur             |

Forme : `px-2 py-0.5 rounded-full text-xs font-medium`

### Formulaires

- Inputs : `border border-gray-300 rounded-lg px-3 py-2`, focus `ring-2 ring-brand-red`
- Labels : `text-sm font-medium text-gray-700`, au-dessus de l'input
- Erreurs : texte `text-red-vivid text-sm` sous l'input
- Textarea : meme style, `min-h-[100px]`
- Select : style natif ameliore, chevron custom

### Bandeau defilant (nouveautes adherent)

Inspire du besoin spec : entete defilant lateralement avec images cliquables.

```
┌──────────────────────────────────────────────────────────────────┐
│  ← [Image annonce 1] [Image annonce 2] [Image annonce 3]  →    │
└──────────────────────────────────────────────────────────────────┘
```

- Defilement horizontal automatique (CSS scroll-snap ou lib carousel)
- Chaque item : image + overlay avec titre, cliquable
- Indicateurs (dots) en dessous
- Pause au hover

---

## Motifs et effets visuels recurrents

### Diagonal rouge
Presente dans le briefing benevole : bande diagonale rouge qui traverse un coin.
A utiliser en decoration sur les sections hero ou les pages de connexion.

```css
/* Decoration diagonale */
.diagonal-accent::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, transparent 50%, #B91C1C 50%);
}
```

### Grille avec bordures blanches
Presente dans le visuel merch : decoupage en grille de photos separees par des lignes blanches.
A utiliser pour les galeries photos des evenements.

### Separation par bandeau rouge
Les documents (fiche de poste, guide) utilisent des bandeaux rouges pleins comme separateurs
de sections. A reprendre dans les pages longues du site public.

### Ombres et profondeur
- Cartes : `shadow-sm` au repos, `shadow-md` au hover
- Navbar fixe : `shadow-md` au scroll
- Modals : `shadow-xl` + overlay `bg-black/50`
- Pas d'ombres tres lourdes : rester subtil et pro

---

## Layout et grille responsive

### Breakpoints (Tailwind par defaut)

| Breakpoint | Largeur min | Usage                                   |
|------------|-------------|------------------------------------------|
| (base)     | 0px         | Mobile portrait                          |
| `sm`       | 640px       | Mobile paysage                           |
| `md`       | 768px       | Tablette                                 |
| `lg`       | 1024px      | Desktop                                  |
| `xl`       | 1280px      | Grand ecran                              |
| `2xl`      | 1536px      | Tres grand ecran                         |

### Conteneur

- Max-width : `max-w-7xl` (1280px) centre avec `mx-auto px-4 md:px-6 lg:px-8`
- Pages admin/espace membre : pleine largeur avec sidebar fixe (250px)

### Grille de cartes

- Mobile : 1 colonne
- `sm` : 2 colonnes
- `lg` : 3 colonnes
- `xl` : 4 colonnes (boutique uniquement)
- Gap : `gap-4 md:gap-6`

---

## Accessibilite

- Contrastes WCAG AA minimum (4.5:1 texte normal, 3:1 grand texte)
- Le rouge `#B91C1C` sur blanc = ratio 6.6:1 (conforme AA)
- Le blanc sur `#B91C1C` = ratio 6.6:1 (conforme AA)
- Focus visible sur tous les elements interactifs : `ring-2 ring-brand-red ring-offset-2`
- Skip-to-content link en haut de page
- Navigation clavier complete (tab, enter, escape pour modals)
- `aria-label` sur tous les boutons avec icone seule
- `alt` en francais sur toutes les images

---

## Icones

- Set : **Lucide React** (fork de Feather Icons, legers, coherents)
- Taille par defaut : `w-5 h-5` (20px)
- Couleur : herite de `currentColor` (donc suit le texte)
- Utiliser les icones pour : navigation sidebar, boutons, badges, statuts
