# FEAT-boutique : Boutique merch associative

## Contexte

L'association souhaite proposer du merchandising (t-shirts, goodies, etc.) a la vente a
prix attractif. Dans un premier temps, la boutique est reservee aux adherents. Si elle
fonctionne bien, elle pourra etre ouverte au public avec des tarifs preferentiels pour
les adherents.

## Acteurs

- **Adherent** : peut consulter et commander des articles a tarif adherent.
- **Visiteur** : pourra consulter et commander (v2, tarif public).
- **Administrateur** : gere le catalogue, les prix et les commandes.

## User Stories

- En tant qu'adherent, je veux voir le catalogue des articles disponibles, afin de choisir
  ce que je souhaite acheter.
- En tant qu'adherent, je veux voir le prix adherent de chaque article, afin de profiter
  du tarif preferentiel.
- En tant qu'adherent, je veux ajouter des articles a un panier et passer commande, afin
  d'acheter du merch.
- En tant qu'administrateur, je veux ajouter, modifier et retirer des articles du catalogue,
  afin de gerer l'offre.
- En tant qu'administrateur, je veux voir la liste des commandes et leur statut, afin de
  gerer les livraisons.

## Criteres d'acceptation

### Catalogue
- [ ] Page `/espace-membre/boutique` listant les articles avec photo, nom, prix
- [ ] Fiche article avec description, tailles/variantes disponibles, stock
- [ ] Badge "Tarif adherent" distinguant le prix preferentiel
- [ ] Articles epuises affiches comme indisponibles

### Panier et commande
- [ ] Ajout au panier avec choix de taille/variante et quantite
- [ ] Page panier recapitulative avant validation
- [ ] Validation de commande (sans paiement en ligne en v1 : commande enregistree,
  paiement en mains propres ou virement)
- [ ] Confirmation par email avec recapitulatif de commande
- [ ] Numero de commande unique

### Administration
- [ ] CRUD articles (titre, description, photo, prix adherent, prix public, tailles, stock)
- [ ] Liste des commandes avec filtres (statut, date, adherent)
- [ ] Statuts de commande : en attente, payee, livree, annulee
- [ ] Notification admin a chaque nouvelle commande

## Hors perimetre

- Paiement en ligne integre (v1 : hors ligne uniquement).
- Ouverture au public (v2).
- Gestion des livraisons / expedition (remise en mains propres).

## Routes prevues

| Route                              | Page                          | Acces      |
|------------------------------------|-------------------------------|------------|
| `/espace-membre/boutique`          | Catalogue                     | Adherent   |
| `/espace-membre/boutique/[slug]`   | Fiche article                 | Adherent   |
| `/espace-membre/boutique/panier`   | Panier                        | Adherent   |
| `/admin/boutique/articles`         | Gestion catalogue             | Admin      |
| `/admin/boutique/commandes`        | Gestion commandes             | Admin      |

## Phase de livraison

**Phase 4** — Fonctionnalite secondaire, a livrer apres l'espace adherent et l'administration.
