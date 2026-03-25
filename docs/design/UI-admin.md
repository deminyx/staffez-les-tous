# UI-admin : Interface d'administration

## Role

Back-office complet pour la gestion du site : utilisateurs, evenements, publications, inscriptions. Partage le meme design system que l'espace membre (surface-dark sidebar, cards, brand-red accents) avec des composants supplementaires pour les formulaires et tables de donnees.

## Layout

### AdminSidebar

Sidebar identique au `MemberSidebar` en structure, avec des liens specifiques a l'admin.

| Prop | Type | Requis | Default | Description                        |
| ---- | ---- | ------ | ------- | ---------------------------------- |
| —    | —    | —      | —       | Aucune prop, utilise `usePathname` |

Navigation :

- Tableau de bord → `/admin`
- Utilisateurs → `/admin/utilisateurs`
- Evenements → `/admin/evenements`
- Publications → `/admin/publications`
- Lien retour → `/espace-membre`

### AdminLayout

Meme structure que `EspaceMembreLayout` : sidebar fixe a gauche, contenu principal decale.

## Pages

### Dashboard (`/admin`)

- Carte de bienvenue (meme style que membre)
- 4 stats cards : Adherents actifs, Evenements publies, Publications en attente, Inscriptions en attente
- Liens rapides vers les sections admin

### Utilisateurs (`/admin/utilisateurs`)

- En-tete avec titre + compteur d'utilisateurs
- Barre de recherche (nom, email, identifiant) + filtre par role (dropdown)
- Table responsive : Nom complet, Identifiant, Email, Roles (badges), Statut (actif/inactif), Actions
- Actions par ligne : Modifier les roles (modale), Activer/Desactiver
- Badge role : fond colore selon le role (rouge admin, bleu coordinateur, vert editeur, violet dev)

### Evenements (`/admin/evenements`)

- Liste : table avec titre, dates, statut (badge), inscription ouverte (toggle), actions
- Actions : Modifier, Voir equipe, Archiver
- Bouton "Nouvel evenement" en haut a droite
- Formulaire creation/edition : titre, slug (auto-genere), description (textarea), missions (textarea), dates debut/fin, lieu, type (select), statut (select), image couverture, capacite max

### Formulaire evenement (`/admin/evenements/nouveau` et `/admin/evenements/[slug]`)

- Formulaire pleine page dans un card
- Champs : titre, slug (auto depuis titre), description, missions, lieu, date debut, date fin, type (PRESTATION/VIE_ASSOCIATIVE), statut (BROUILLON/PUBLIE/ARCHIVE), image couverture (URL), capacite max, inscription ouverte (toggle)
- Boutons : Enregistrer (primary), Annuler (secondary)

### Publications (`/admin/publications`)

- Vue separee pour editeurs et admins :
  - Editeur : voit ses propres publications + bouton "Nouvelle publication"
  - Admin : voit toutes les publications, filtrable par statut
- Table : Titre, Categorie (badge), Auteur, Statut (badge), Date, Actions
- Statut badges : Brouillon (gris), En attente (orange), Approuvee (vert), Rejetee (rouge)

### Formulaire publication (`/admin/publications/nouveau` et `/admin/publications/[id]`)

- Champs : titre, contenu (textarea large), categorie (select), image couverture (URL)
- Pour editeur : bouton "Soumettre pour validation" (passe en EN_ATTENTE)
- Pour admin : boutons "Approuver" / "Rejeter" avec champ commentaire

### Equipe evenement (`/admin/evenements/[slug]/equipe`)

- En-tete : nom de l'evenement, dates, compteur inscrits/capacite
- Table des inscriptions : Benevole (nom), Date inscription, Statut (badge), Poste (editable select), Horaires (editable input), Actions
- Actions : Valider, Refuser, Mettre en attente
- Bouton export CSV

## Composants partages

### StatusBadge

| Prop    | Type                                      | Requis | Default | Description       |
| ------- | ----------------------------------------- | ------ | ------- | ----------------- |
| status  | string                                    | oui    | —       | Statut a afficher |
| variant | "event" \| "publication" \| "inscription" | oui    | —       | Type de badge     |

### AdminDataTable

Pas un composant generique complexe. Chaque page a son propre tableau en JSX avec les colonnes appropriees. On utilise simplement des `<table>` stylees avec Tailwind.

### RoleModal

| Prop    | Type           | Requis | Default | Description                       |
| ------- | -------------- | ------ | ------- | --------------------------------- |
| user    | UserProfile    | oui    | —       | Utilisateur a modifier            |
| events  | EventSummary[] | oui    | —       | Evenements pour role coordinateur |
| onClose | () => void     | oui    | —       | Callback fermeture                |

Modale pour ajouter/retirer des roles. Checkboxes pour EDITEUR, ADMINISTRATEUR, DEVELOPPEUR. Select evenement pour COORDINATEUR.

## Responsive

- Mobile : sidebar cachee avec hamburger (meme pattern que membre)
- Tables : scroll horizontal sur mobile
- Formulaires : une colonne sur mobile, deux colonnes sur md+

## Accessibilite

- Tables avec `<thead>`, `<tbody>`, scope headers
- Modales avec `role="dialog"`, `aria-modal="true"`, focus trap
- Boutons d'action avec `aria-label` descriptifs
- Badges de statut avec texte lisible (pas seulement couleur)
- Formulaires avec `<label>` associes aux inputs via `htmlFor`/`id`
