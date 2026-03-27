# Droits par role — Staffez Les Tous

## Vue d'ensemble des roles

| Role             | Description                                                            |
| ---------------- | ---------------------------------------------------------------------- |
| `DEVELOPPEUR`    | Super-administrateur technique. Acces total sans restriction.          |
| `ADMINISTRATEUR` | Administrateur associatif. Acces complet sauf attribution DEVELOPPEUR. |
| `COORDINATEUR`   | Gestionnaire d'evenements. Acces scope a un ou plusieurs evenements.   |
| `EDITEUR`        | Redacteur de publications. Acces uniquement a la section publications. |

---

## Tableau des permissions

### Administration (espace `/admin`)

| Section                     | DEVELOPPEUR | ADMINISTRATEUR | COORDINATEUR | EDITEUR |
| --------------------------- | :---------: | :------------: | :----------: | :-----: |
| Tableau de bord             |     Oui     |      Oui       |     Oui      |   Oui   |
| Utilisateurs                |     Oui     |      Oui       |     Non      |   Non   |
| Evenements (liste/creation) |     Oui     |      Oui       |   Oui (\*)   |   Non   |
| Publications                |     Oui     |      Oui       |     Non      |   Oui   |
| Boutique                    |     Oui     |      Oui       |     Non      |   Non   |
| Vie associative             |     Oui     |      Oui       |     Non      |   Non   |

(\*) Le coordinateur voit tous les evenements mais ne peut gerer l'equipe que des evenements auxquels son role est associe (`eventId`).

### Actions sur les utilisateurs

| Action                         | DEVELOPPEUR | ADMINISTRATEUR | COORDINATEUR | EDITEUR |
| ------------------------------ | :---------: | :------------: | :----------: | :-----: |
| Voir la liste des utilisateurs |     Oui     |      Oui       |     Non      |   Non   |
| Activer / desactiver un compte |     Oui     |      Oui       |     Non      |   Non   |
| Modifier les roles             |     Oui     |      Oui       |     Non      |   Non   |
| Attribuer le role DEVELOPPEUR  |     Oui     |      Non       |     Non      |   Non   |
| Creer un nouveau membre        |     Oui     |      Oui       |     Non      |   Non   |
| Regenerer le mot de passe      |     Oui     |      Oui       |     Non      |   Non   |

### Actions sur les evenements

| Action                          | DEVELOPPEUR | ADMINISTRATEUR | COORDINATEUR | EDITEUR |
| ------------------------------- | :---------: | :------------: | :----------: | :-----: |
| Creer / modifier un evenement   |     Oui     |      Oui       |   Non (\*)   |   Non   |
| Gerer les inscriptions (equipe) |     Oui     |      Oui       |  Oui (\*\*)  |   Non   |
| Exporter les benevoles (CSV)    |     Oui     |      Oui       |  Oui (\*\*)  |   Non   |

(\*) Le coordinateur peut consulter les evenements mais ne peut pas en creer ou modifier.
(\*\*) Uniquement pour les evenements dont le `eventId` correspond a son role.

### Actions sur les publications

| Action                             | DEVELOPPEUR | ADMINISTRATEUR | COORDINATEUR | EDITEUR |
| ---------------------------------- | :---------: | :------------: | :----------: | :-----: |
| Creer une publication              |     Oui     |      Oui       |     Non      |   Oui   |
| Modifier sa propre publication     |     Oui     |      Oui       |     Non      |   Oui   |
| Modifier la publication d'un autre |     Oui     |      Oui       |     Non      |   Non   |
| Soumettre a validation             |     Oui     |      Oui       |     Non      |   Oui   |
| Approuver / rejeter                |     Oui     |      Oui       |     Non      |   Non   |

---

## Modele de donnees

Le role d'un utilisateur est stocke dans la table `UserRole` :

```prisma
model UserRole {
  id      String  @id @default(cuid())
  userId  String
  role    Role
  eventId String? // null = global, non-null = scope a un evenement
}

enum Role {
  ADMINISTRATEUR
  DEVELOPPEUR
  EDITEUR
  COORDINATEUR
}
```

Un utilisateur peut avoir plusieurs roles. Un coordinateur peut etre associe a plusieurs evenements (un `UserRole` par evenement).

---

## Navigation dans l'interface admin

La barre de navigation laterale (`AdminSidebar`) filtre les elements visibles en fonction des roles de l'utilisateur connecte :

| Element de menu | Visible pour                              |
| --------------- | ----------------------------------------- |
| Tableau de bord | Tous                                      |
| Utilisateurs    | ADMINISTRATEUR, DEVELOPPEUR               |
| Evenements      | ADMINISTRATEUR, DEVELOPPEUR, COORDINATEUR |
| Publications    | ADMINISTRATEUR, DEVELOPPEUR, EDITEUR      |
| Boutique        | ADMINISTRATEUR, DEVELOPPEUR               |
| Vie associative | ADMINISTRATEUR, DEVELOPPEUR               |

---

## Securite

- Les verifications de role sont effectuees cote serveur dans chaque page (`page.tsx`) et chaque action (`actions.ts`).
- Un utilisateur sans le role requis est redirige vers `/admin` (dashboard) ou `/connexion`.
- Les Server Actions utilisent `requireRole()` de `src/lib/permissions.ts` et retournent `{ success: false, error: "Acces non autorise." }` en cas de violation.
- Le rate limiting sur la connexion est gere dans `src/lib/auth.ts` : 5 tentatives maximum par fenetre de 15 minutes par identifiant.
