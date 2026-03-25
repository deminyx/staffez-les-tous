# FEAT-administration : Back-office et roles d'administration

## Contexte

Le site doit etre administrable par differentes personnes avec des niveaux de droits
distincts. Le bureau de l'association supervise l'ensemble, mais delegue certaines
responsabilites (edition de contenu, coordination d'evenements).

## Acteurs

- **Developpeur** : acces total au systeme technique (Ben, Max, Nemo).
- **Administrateur** : membre du bureau ou personne designee. Gere le site, les publications
  et les inscriptions. Valide les contenus des editeurs.
- **Coordinateur** : personne nommee par le bureau, administre les inscriptions benevoles
  sur un evenement specifique uniquement.
- **Editeur** : peut creer du contenu (newsletters, annonces evenements) mais ses publications
  necessitent la validation d'un administrateur avant publication.

## User Stories

### Gestion des roles
- En tant qu'administrateur (president), je veux attribuer ou retirer un role a un adherent,
  afin de deleguer les responsabilites.
- En tant qu'administrateur, je veux voir la liste des utilisateurs et leurs roles, afin
  d'avoir une vue d'ensemble.

### Publication de contenu (Editeur)
- En tant qu'editeur, je veux creer une publication (newsletter, annonce evenement) avec un
  editeur simplifie, afin d'alimenter le site en contenu.
- En tant qu'editeur, je veux previsualiser ma publication avant soumission, afin de verifier
  le rendu.
- En tant qu'editeur, ma publication est en statut "brouillon" puis "en attente de validation"
  apres soumission.

### Validation de contenu (Administrateur)
- En tant qu'administrateur, je veux voir la liste des publications en attente de validation,
  afin de les approuver ou les rejeter.
- En tant qu'administrateur, je veux previsualiser, approuver ou rejeter une publication avec
  un commentaire, afin de controler la qualite du contenu.
- En tant qu'administrateur, une publication approuvee devient visible sur le site.

### Gestion des evenements (Administrateur)
- En tant qu'administrateur, je veux creer, modifier et archiver un evenement, afin de tenir
  la section evenements a jour.
- En tant qu'administrateur, je veux gerer les photos, la description et les missions d'un
  evenement.
- En tant qu'administrateur, je veux ouvrir et fermer les inscriptions benevoles sur un
  evenement.

### Gestion des inscriptions (Coordinateur / Administrateur)
- En tant que coordinateur, je veux voir la liste des inscriptions benevoles sur mon evenement,
  afin de constituer mon equipe.
- En tant que coordinateur, je veux valider ou refuser une inscription, afin de selectionner
  les benevoles.
- En tant que coordinateur, je veux affecter un poste et des horaires a chaque benevole
  valide, afin d'organiser l'evenement.
- En tant que coordinateur, mes actions sont limitees a l'evenement qui m'est assigne.

### Gestion des adherents (Administrateur)
- En tant qu'administrateur, je veux creer, desactiver et gerer les comptes adherents
  (cf. FEAT-auth-membres).

## Criteres d'acceptation

### Systeme de roles
- [ ] 4 roles : Editeur, Administrateur, Coordinateur, Developpeur
- [ ] Un adherent peut cumuler plusieurs roles
- [ ] Le role Coordinateur est lie a un ou plusieurs evenements specifiques
- [ ] Seuls les administrateurs (et la presidence) peuvent attribuer des roles
- [ ] L'attribution du role Developpeur est restreinte (presidence uniquement)
- [ ] Interface `/admin/utilisateurs` avec filtres par role

### Publications
- [ ] Editeur WYSIWYG simplifie (titre, texte riche, image, categorie)
- [ ] Workflow : brouillon → en attente → approuvee / rejetee
- [ ] Les publications rejetees retournent en brouillon avec le commentaire de l'admin
- [ ] Les publications approuvees sont visibles sur le site (section nouveautes)
- [ ] Historique de chaque publication (qui a cree, soumis, valide/rejete, quand)

### Gestion des evenements
- [ ] CRUD complet sur les evenements (titre, slug, description, missions, photos, dates)
- [ ] Statuts : brouillon, publie, archive
- [ ] Un evenement publie apparait sur la section publique et dans le calendrier adherent
- [ ] Gestion des inscriptions : ouvrir/fermer par evenement
- [ ] Assignation d'un ou plusieurs coordinateurs par evenement

### Gestion des inscriptions
- [ ] Liste filtrable des inscriptions par evenement
- [ ] Actions : valider, refuser, mettre en attente
- [ ] Affectation de poste (liste deroulante configurable) et horaires par benevole
- [ ] Notification email automatique a l'adherent lors de chaque changement de statut
- [ ] Export CSV de la liste des benevoles valides par evenement

### Transversal
- [ ] Routes `/admin/*` protegees par role
- [ ] Chaque action admin est tracee (audit log : qui, quoi, quand)
- [ ] Interface responsive mais optimisee desktop (usage principal)
- [ ] Toutes les interfaces en francais

## Hors perimetre

- Gestion financiere / tresorerie.
- Statistiques avancees / analytics (v2).
- Moderation de la boite a idees (voir FEAT-vie-associative).

## Routes prevues

| Route                              | Page                              | Role minimum    |
|------------------------------------|-----------------------------------|-----------------|
| `/admin`                           | Dashboard admin                   | Administrateur  |
| `/admin/utilisateurs`              | Gestion des adherents et roles    | Administrateur  |
| `/admin/publications`              | Liste des publications            | Editeur         |
| `/admin/publications/nouveau`      | Creer une publication             | Editeur         |
| `/admin/publications/[id]`         | Editer / valider une publication  | Editeur / Admin |
| `/admin/evenements`                | Liste des evenements              | Administrateur  |
| `/admin/evenements/nouveau`        | Creer un evenement                | Administrateur  |
| `/admin/evenements/[slug]`         | Editer un evenement               | Administrateur  |
| `/admin/evenements/[slug]/equipe`  | Gestion inscriptions benevoles    | Coordinateur    |

## Phase de livraison

**Phase 3** — Depend de FEAT-auth-membres et FEAT-espace-adherent.
Le CRUD evenements peut etre avance en Phase 1 si les evenements sont dynamiques.
