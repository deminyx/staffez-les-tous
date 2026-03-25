# FEAT-espace-adherent : Espace prive adherent (intranet)

## Contexte

Une fois authentifie, chaque adherent accede a un espace prive complementaire au site public.
Cet espace sert de hub central pour la communication interne, la gestion des inscriptions
aux evenements et le suivi de son parcours benevole.

## Acteurs

- **Adherent** : membre connecte de l'association.
- **Coordinateur** : adherent ayant des droits etendus sur un evenement specifique.
- **Administrateur** : membre du bureau gerant l'ensemble.

## User Stories

### Tableau de bord (Dashboard)

- En tant qu'adherent, je veux voir un tableau de bord synthetique a ma connexion, afin
  d'acceder rapidement aux informations importantes.
- En tant qu'adherent, je veux voir un bandeau defilant avec les dernieres nouveautes
  (annonces, evenements a venir), afin d'etre informe sans effort.
- En tant qu'adherent, je veux pouvoir cliquer sur une nouveaute pour acceder au detail
  (ex: inscription a un evenement), afin d'agir directement.

### Calendrier des evenements

- En tant qu'adherent, je veux voir un calendrier avec tous les evenements de l'association
  (prestations et vie associative), afin de planifier ma disponibilite.
- En tant qu'adherent, je veux pouvoir filtrer les evenements par type (prestation, vie
  associative), afin de trouver rapidement ce qui m'interesse.
- En tant qu'adherent, je veux cliquer sur un evenement pour voir son detail et m'inscrire,
  afin de participer.

### Inscriptions aux evenements

- En tant qu'adherent, je veux m'inscrire a un evenement en un clic, afin de signaler ma
  disponibilite.
- En tant qu'adherent, je veux voir le statut de chacune de mes inscriptions
  (en attente, validee, refusee), afin de savoir ou j'en suis.
- En tant qu'adherent, je veux voir mes affectations de poste et mes horaires une fois
  mon inscription validee, afin de me preparer.
- En tant qu'adherent, je veux pouvoir annuler une inscription tant qu'elle est en attente,
  afin de gerer mes indisponibilites.

### Mon profil

- En tant qu'adherent, je veux consulter et modifier mes informations de profil (photo,
  telephone, allergies, mission/bio), afin que l'association dispose d'informations a jour.
- En tant qu'adherent, je veux voir mon historique de participations, afin de suivre mon
  engagement.

## Criteres d'acceptation

### Tableau de bord
- [ ] Page `/espace-membre` accessible uniquement apres authentification
- [ ] Bandeau defilant horizontal avec les dernieres annonces (images cliquables)
- [ ] Section "Mes prochains evenements" : liste des 3 prochains evenements ou l'adherent est inscrit
- [ ] Section "Mes inscriptions en attente" : nombre et lien vers le detail
- [ ] Section "Nouveautes" : 5 dernieres actualites internes
- [ ] Redirection vers `/connexion` si non authentifie

### Calendrier
- [ ] Vue calendrier mensuelle avec les evenements affiches par date
- [ ] Filtres par type : prestation, vie associative, tous
- [ ] Vue liste alternative pour mobile
- [ ] Clic sur un evenement → page detail avec bouton d'inscription
- [ ] Indicateur visuel : inscrit / non inscrit / complet

### Inscriptions
- [ ] Bouton "S'inscrire" sur chaque evenement ouvert aux inscriptions
- [ ] Page `/espace-membre/inscriptions` listant toutes les inscriptions de l'adherent
- [ ] Statuts affiches : en attente (jaune), validee (vert), refusee (rouge)
- [ ] Detail inscription validee : poste affecte, horaires, informations pratiques
- [ ] Bouton "Annuler" disponible tant que le statut est "en attente"
- [ ] Notification par email lors du changement de statut

### Profil
- [ ] Page `/espace-membre/profil` avec formulaire editable
- [ ] Champs : photo, telephone, allergies/regime alimentaire, bio/presentation
- [ ] Champs en lecture seule : nom, prenom, identifiant, email (modifiables par admin uniquement)
- [ ] Historique des participations passees (evenement, date, poste)
- [ ] Validation des donnees cote client et serveur

### Transversal
- [ ] Navigation dediee espace membre (sidebar ou topbar differenciee)
- [ ] Toutes les pages sont protegees par l'authentification
- [ ] Responsive mobile-first
- [ ] Messages et labels en francais

## Hors perimetre

- Messagerie entre adherents (pas dans le perimetre initial).
- Gestion des inscriptions cote admin/coordinateur (voir FEAT-administration).
- Boutique (voir FEAT-boutique).
- Vie associative collaborative (voir FEAT-vie-associative).

## Routes prevues

| Route                              | Page                              |
|------------------------------------|-----------------------------------|
| `/espace-membre`                   | Tableau de bord                   |
| `/espace-membre/calendrier`        | Calendrier des evenements         |
| `/espace-membre/evenements/[slug]` | Detail evenement + inscription    |
| `/espace-membre/inscriptions`      | Mes inscriptions                  |
| `/espace-membre/profil`            | Mon profil                        |

## Phase de livraison

**Phase 2** — Depend de FEAT-auth-membres. Livree en meme temps que l'authentification.
Le calendrier et les inscriptions peuvent etre livres incrementalement.
