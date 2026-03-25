# FEAT-vie-associative : Vie associative collaborative

## Contexte

Au-dela des prestations evenementielles, l'association organise des sorties et des moments
de convivialite. Cette section vise a dynamiser la vie interne en permettant aux adherents
de proposer des idees, de participer a des sondages et de decouvrir les sorties prevues.

## Acteurs

- **Adherent** : propose des idees, vote aux sondages, consulte les sorties.
- **Administrateur** : cree les sondages, valide/modere les idees, organise les sorties.

## User Stories

### Sorties vie associative
- En tant qu'adherent, je veux voir les prochaines sorties de vie associative, afin de
  m'organiser pour y participer.
- En tant qu'adherent, je veux m'inscrire a une sortie, afin de signaler ma presence.
- En tant qu'administrateur, je veux creer et gerer les sorties (date, lieu, description,
  nombre de places), afin d'organiser la vie de l'association.

### Sondages
- En tant qu'administrateur, je veux creer un sondage avec plusieurs options, afin de
  consulter les adherents sur un sujet.
- En tant qu'adherent, je veux voter a un sondage actif, afin de donner mon avis.
- En tant qu'adherent, je veux voir les resultats d'un sondage cloture, afin de connaitre
  la decision collective.

### Boite a idees
- En tant qu'adherent, je veux soumettre une idee (titre + description), afin de proposer
  un projet ou une amelioration.
- En tant qu'adherent, je veux voter (pouce haut) pour les idees des autres, afin de
  soutenir les propositions qui me plaisent.
- En tant qu'administrateur, je veux moderer les idees (approuver, masquer), afin de
  garantir la pertinence du contenu.

## Criteres d'acceptation

### Sorties
- [ ] Page `/espace-membre/vie-associative` avec liste des prochaines sorties
- [ ] Detail sortie : date, lieu, description, nombre d'inscrits / places
- [ ] Inscription/desinscription en un clic
- [ ] Les sorties passees sont archivees avec le nombre de participants

### Sondages
- [ ] Section sondages sur la page vie associative
- [ ] Un sondage = question + 2 a 6 options + date de cloture
- [ ] Vote unique par adherent (pas de modification apres vote)
- [ ] Affichage des resultats (barres de progression) apres cloture
- [ ] Creation de sondage reservee aux administrateurs

### Boite a idees
- [ ] Section boite a idees avec liste des idees approuvees
- [ ] Formulaire de soumission : titre (max 100 car.) + description (max 500 car.)
- [ ] Systeme de vote positif (like) : un vote par adherent par idee
- [ ] Tri par popularite (nombre de votes) ou par date
- [ ] Moderation par les administrateurs (approuver/masquer)

## Hors perimetre

- Messagerie / chat entre adherents.
- Forum de discussion.
- Gestion de budget pour les sorties.

## Routes prevues

| Route                                    | Page                    | Acces    |
|------------------------------------------|-------------------------|----------|
| `/espace-membre/vie-associative`         | Hub vie associative     | Adherent |
| `/espace-membre/vie-associative/sorties` | Sorties                 | Adherent |
| `/espace-membre/vie-associative/sondages`| Sondages                | Adherent |
| `/espace-membre/vie-associative/idees`   | Boite a idees           | Adherent |

## Phase de livraison

**Phase 4** — Fonctionnalite secondaire. Peut etre livree par morceaux :
les sorties d'abord, puis sondages, puis boite a idees.
