# FEAT-site-public : Site vitrine public

## Contexte

Staffez Les Tous a besoin d'un site internet professionnel pour promouvoir l'association
aupres du grand public, recruter de nouveaux benevoles et demarcher des partenaires.
La section publique constitue la vitrine de l'association, accessible sans authentification.

## Acteurs

- **Visiteur** : toute personne arrivant sur le site (benevole potentiel, partenaire, curieux).
- **Organisateur d'evenement** : professionnel souhaitant faire appel a l'association.
- **Donateur** : personne souhaitant soutenir financierement l'association.

## User Stories

### Page d'accueil

- En tant que visiteur, je veux voir une presentation claire de l'association (nom, annee de
  creation, objet), afin de comprendre rapidement qui est Staffez Les Tous.
- En tant que visiteur, je veux voir des photos d'illustration, afin de me faire une idee
  de l'ambiance et du serieux de l'association.
- En tant que donateur, je veux trouver un lien vers la campagne HelloAsso, afin de pouvoir
  soutenir l'association financierement.

### Section Evenements

- En tant que visiteur, je veux voir la liste de tous les evenements de l'association, afin
  de decouvrir l'etendue de ses activites.
- En tant que visiteur, je veux acceder a une page dediee par evenement, afin de comprendre
  les missions de l'association sur cet evenement.
- En tant que visiteur, je veux voir des photos actuelles et avantageuses de chaque evenement,
  afin de me projeter dans l'ambiance.

### Section Recrutement (Benevoles)

- En tant que benevole potentiel, je veux comprendre le processus de recrutement etape par
  etape, afin de savoir a quoi m'attendre.
- En tant que benevole potentiel, je veux remplir un formulaire de contact integre, afin de
  candidater directement depuis le site.

### Section Organisateurs (Partenaires)

- En tant qu'organisateur d'evenement, je veux comprendre le processus de collaboration avec
  l'association, afin de savoir comment faire appel a Staffez Les Tous.
- En tant qu'organisateur, je veux remplir un formulaire de contact dedie, afin de demarrer
  une collaboration.

### Section Reseaux / Contact

- En tant que visiteur, je veux trouver les liens vers les reseaux sociaux de l'association,
  afin de suivre son actualite.
- En tant que visiteur, je veux trouver les adresses mail de contact, afin de pouvoir
  communiquer avec l'association.

## Criteres d'acceptation

### Page d'accueil
- [ ] Hero banner avec nom de l'association, accroche et CTA principal
- [ ] Section "A propos" : nom, annee de creation, objet de l'association
- [ ] Galerie ou carousel de photos d'illustration (min. 3 photos)
- [ ] Bouton/lien visible vers la campagne HelloAsso (lien externe, nouvel onglet)
- [ ] Navigation principale vers toutes les sections publiques
- [ ] Footer avec mentions legales, liens reseaux, contact

### Section Evenements
- [ ] Page listing avec tous les evenements sous forme de cartes cliquables
- [ ] Page detail par evenement : titre, description des missions, galerie photos
- [ ] Les evenements sont geres dynamiquement (pas en dur dans le code)
- [ ] Responsive : cartes empilees sur mobile, grille sur desktop

### Section Recrutement
- [ ] Explication du processus en etapes numerotees (timeline/stepper visuel)
- [ ] Formulaire de contact integre : prenom, nom, email, telephone, message, evenement(s) d'interet
- [ ] Validation des champs cote client et serveur
- [ ] Envoi d'un email de confirmation au candidat
- [ ] Notification par email aux administrateurs

### Section Organisateurs
- [ ] Explication du processus de partenariat en etapes
- [ ] Formulaire de contact dedie : nom de l'evenement, organisateur, email, telephone, dates, description
- [ ] Validation et envoi de confirmation identique au recrutement

### Section Reseaux
- [ ] Liens cliquables vers chaque reseau social (icones)
- [ ] Adresse(s) mail de contact affichees et cliquables (mailto:)

### Transversal
- [ ] Toutes les pages sont responsive (mobile-first)
- [ ] SEO : balises meta, Open Graph, titre unique par page
- [ ] Accessibilite : navigation clavier, contrastes WCAG AA, alt text sur toutes les images
- [ ] Temps de chargement < 3s sur connexion 3G
- [ ] Contenu en francais

## Hors perimetre

- Authentification et espace adherent (voir FEAT-auth-membres et FEAT-espace-adherent).
- Administration du contenu / back-office (voir FEAT-administration).
- Boutique / merch (voir FEAT-boutique).
- Vie associative interne (voir FEAT-vie-associative).
- Paiement en ligne (hors lien HelloAsso externe).

## Pages et routes prevues

| Route                     | Page                          |
|---------------------------|-------------------------------|
| `/`                       | Accueil                       |
| `/evenements`             | Listing des evenements        |
| `/evenements/[slug]`      | Detail d'un evenement         |
| `/recrutement`            | Recrutement benevoles         |
| `/organisateurs`          | Espace organisateurs          |
| `/contact`                | Reseaux et contact            |
| `/mentions-legales`       | Mentions legales              |

## Phase de livraison

**Phase 1** — C'est la premiere fonctionnalite a livrer. Le site public doit etre
operationnel avant de demarrer les phases privees.
