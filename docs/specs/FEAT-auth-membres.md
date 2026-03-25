# FEAT-auth-membres : Authentification et gestion des adherents

## Contexte

L'association a besoin d'un systeme d'authentification pour donner acces a un espace prive
(intranet) a ses adherents. Les identifiants sont generes et geres par le bureau de
l'association, pas par les adherents eux-memes (pas d'inscription libre).

## Acteurs

- **Adherent** : membre de l'association disposant d'un compte.
- **Administrateur (Bureau)** : gere la creation, modification et suppression des comptes.
- **Systeme** : genere automatiquement les identifiants et mots de passe.

## User Stories

### Creation de compte
- En tant qu'administrateur, je veux creer un compte adherent en saisissant prenom, nom et
  email, afin qu'un identifiant et un mot de passe soient generes automatiquement.
- En tant que systeme, je genere l'identifiant au format `[1ere lettre prenom][nom]` en
  minuscule, sans accent ni espace. Si l'identifiant existe deja, j'ajoute un suffixe
  numerique incremental (`02`, `03`, ...).
  - Sarah Puy → `spuy`
  - Samira Puy → `spuy02`
  - Sophie Puy → `spuy03`
- En tant que systeme, je genere un mot de passe aleatoire securise (min. 12 caracteres,
  majuscules, minuscules, chiffres, caractere special).
- En tant que systeme, j'envoie un email a l'adherent avec son identifiant et son mot de
  passe initial.

### Connexion
- En tant qu'adherent, je veux me connecter avec mon identifiant et mon mot de passe, afin
  d'acceder a mon espace prive.
- En tant qu'adherent, je veux voir un message d'erreur clair si mes identifiants sont
  incorrects, afin de comprendre le probleme.
- En tant qu'adherent, apres connexion, je veux etre redirige vers mon tableau de bord.

### Mot de passe oublie
- En tant qu'adherent, je veux pouvoir demander la reinitialisation de mon mot de passe, afin
  de recuperer l'acces a mon compte.
- En tant que systeme, je genere un nouveau mot de passe et l'envoie par email a l'adherent.

### Gestion des comptes (admin)
- En tant qu'administrateur, je veux voir la liste de tous les adherents, afin de gerer
  les comptes.
- En tant qu'administrateur, je veux pouvoir desactiver un compte, afin de bloquer l'acces
  d'un ancien adherent sans supprimer ses donnees.
- En tant qu'administrateur, je veux pouvoir regenerer le mot de passe d'un adherent, afin
  de l'aider en cas de probleme.

## Criteres d'acceptation

### Generation d'identifiant
- [ ] Format : premiere lettre du prenom + nom complet, tout en minuscule, sans accents
- [ ] Caracteres speciaux et espaces retires (ex: Jean-Pierre De La Fontaine → `jdelafontaine`)
- [ ] Si doublon : ajout de suffixe `02`, `03`, etc.
- [ ] Identifiant unique garanti en base de donnees (contrainte UNIQUE)

### Generation de mot de passe
- [ ] Minimum 12 caracteres
- [ ] Au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 caractere special
- [ ] Mot de passe hashe en base (bcrypt ou argon2)
- [ ] Mot de passe en clair envoye uniquement par email, jamais stocke

### Portail de connexion
- [ ] Page `/connexion` avec formulaire identifiant + mot de passe
- [ ] Validation cote client (champs requis) et serveur
- [ ] Message d'erreur generique en cas d'echec (ne pas reveler si l'identifiant existe)
- [ ] Protection anti brute-force (rate limiting : max 5 tentatives / 15 min)
- [ ] Session securisee (cookie httpOnly, secure, sameSite)
- [ ] Redirection vers `/espace-membre` apres connexion reussie

### Reinitialisation de mot de passe
- [ ] Page `/mot-de-passe-oublie` avec champ email
- [ ] Si email reconnu : nouveau mot de passe genere et envoye
- [ ] Message identique que l'email existe ou non (securite)
- [ ] Rate limiting sur les demandes de reinitialisation

### Gestion admin
- [ ] Interface admin listant les adherents (nom, prenom, identifiant, email, statut)
- [ ] Actions : creer, desactiver/reactiver, regenerer mot de passe
- [ ] Historique des actions sur chaque compte (audit log)

## Hors perimetre

- Inscription libre par les visiteurs (les comptes sont crees par le bureau uniquement).
- Connexion via reseaux sociaux (OAuth/SSO).
- Changement de mot de passe par l'adherent lui-meme (v1 — a envisager en v2).
- Double authentification / 2FA (a envisager en v2).

## Routes prevues

| Route                     | Page / API                    | Acces       |
|---------------------------|-------------------------------|-------------|
| `/connexion`              | Portail de connexion          | Public      |
| `/mot-de-passe-oublie`    | Reinitialisation MDP          | Public      |
| `/api/auth/login`         | Endpoint connexion            | Public      |
| `/api/auth/logout`        | Endpoint deconnexion          | Adherent    |
| `/api/auth/reset-password`| Endpoint reinit MDP           | Public      |
| `/api/admin/membres`      | CRUD adherents                | Admin       |

## Phase de livraison

**Phase 2** — Prerequis pour toutes les fonctionnalites de l'espace prive.
Peut etre developpee en parallele de la phase 1 (site public) sur la partie back-end.
