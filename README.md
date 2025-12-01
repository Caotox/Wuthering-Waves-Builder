# Wuthering Waves Database

Base de données sécurisée des personnages de Wuthering Waves - Projet académique de sécurité des applications web.

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Sécurité](#sécurité)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Technologies](#technologies)
- [Conformité RGPD](#conformité-rgpd)

## Vue d'ensemble

Wuthering Waves Database est une application web full-stack conçue avec une priorité absolue sur la sécurité. Ce projet démontre l'implémentation de pratiques de sécurité conformes aux standards OWASP et RGPD.

## Fonctionnalités

### Authentification & Autorisation
- **Inscription sécurisée** avec validation stricte des mots de passe (12+ caractères, 3+ types)
- **Connexion** avec messages d'erreur génériques (prévention énumération)
- **Sessions sécurisées** (30 min timeout, HttpOnly, Secure, SameSite=Strict)
- **Système de rôles** (USER, ADMIN) avec contrôle d'accès côté serveur
- **Déconnexion complète** (destruction session serveur + cookie)

### Gestion des personnages
- Consultation des personnages (public)
- Système de favoris (authentifié uniquement)
- Administration CRUD (admin uniquement)
- Builds personnalisés par personnage (authentifié uniquement)

### Conformité & Légal
- Page de mentions légales complète
- Politique de confidentialité détaillée
- Consentement RGPD explicite (case non pré-cochée)

## Sécurité

Ce projet implémente **toutes** les mesures de sécurité requises par le cahier des charges :

### 1. Authentification Robuste

#### Mots de passe
- **Hachage bcrypt** avec 10 rounds minimum (jamais MD5/SHA1/texte clair)
- **Validation stricte** : 12+ caractères, majuscules, minuscules, chiffres, spéciaux
- **Stockage sécurisé** : Hash irréversible en base de données

#### Sessions
```typescript
// Configuration de session sécurisée
{
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: true,        // Protection XSS
    secure: true,          // HTTPS uniquement
    sameSite: 'strict',    // Protection CSRF
    maxAge: 1800000        // 30 minutes
  }
}
```

### 2. Contrôle d'Accès (RBAC)

#### Rôles implémentés
- `USER` : Accès lecture + favoris personnels
- `ADMIN` : Accès complet + gestion personnages

#### Protection IDOR
```typescript
// Vérification ownership avant modification
const userId = req.session.userId;
if (resourceUserId !== userId) {
  return res.status(403).json({ message: "Accès refusé" });
}
```

### 3. Protection contre les Injections

#### SQL Injection
```typescript
// BON : Requêtes préparées avec Drizzle ORM
await db.select().from(users).where(eq(users.id, userId));

// MAUVAIS (jamais utilisé)
// await db.execute(`SELECT * FROM users WHERE id = ${userId}`);
```

#### XSS (Cross-Site Scripting)
- Échappement automatique avec React/JSX
- Validation et sanitization des entrées
- Headers CSP configurés

### 4. Headers de Sécurité HTTP

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; ...
```

### 5. Protection CSRF

- Cookies `SameSite=Strict`
- Vérification origin/referer
- Architecture moderne (SPA + API)

### 6. Gestion des Secrets

```bash
# .env (JAMAIS commité)
DATABASE_URL="postgresql://..."
SESSION_SECRET="..."

# .env.example (dans le repo)
DATABASE_URL=
SESSION_SECRET=
```

## Installation

### Prérequis

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Étapes

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd WutheringDatabase
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

4. **Créer la base de données**
```bash
createdb wuthering_db
```

5. **Pousser le schéma**
```bash
npm run db:push
```

6. **Peupler la base (optionnel)**
```bash
npx tsx server/seed.ts
```

7. **Démarrer en développement**
```bash
npm run dev
```

## Configuration

### Variables d'environnement requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `SESSION_SECRET` | Clé secrète sessions (32+ caractères aléatoires) | `super-secret-key-32-chars-min` |
| `NODE_ENV` | Environnement | `development` ou `production` |
| `PORT` | Port du serveur | `3000` |

### Génération de secrets sécurisés

```bash
# Générer un SESSION_SECRET fort
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Utilisation

### Développement

```bash
npm run dev          # Démarre le serveur dev (port 3000)
npm run check        # Vérifie TypeScript
npm run db:push      # Met à jour la DB
npm run db:seed      # Remplit la DB avec des données
```

### Production

```bash
npm run build        # Compile frontend + backend
npm start            # Lance en production
```

### Tests de sécurité

```bash
npm audit
npm audit --audit-level=high
```

## Technologies

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **TailwindCSS** + **shadcn/ui**
- **Wouter** (routing)
- **TanStack Query** (data fetching)

### Backend
- **Express.js** + **TypeScript**
- **Node.js**
- **Drizzle ORM** (requêtes préparées)
- **bcrypt** (hachage mots de passe)
- **express-session** (gestion sessions)
- **helmet** (headers sécurité)

### Base de données
- **PostgreSQL** (production-ready)
- **pg** (driver)

## Conformité RGPD

### Minimisation des données

Nous collectons **UNIQUEMENT** :
- Email (authentification)
- Prénom & Nom (personnalisation)
- Mot de passe (hashé)

Nous ne collectons **JAMAIS** :
- Date de naissance
- Adresse postale
- Numéro de téléphone
- Données sensibles

### Consentement explicite

- Case à cocher **décochée par défaut**
- Texte clair sur l'utilisation des données
- Impossible de s'inscrire sans cocher

### Droits des utilisateurs

- **Droit d'accès** : Consultation des données
- **Droit de rectification** : Modification du profil
- **Droit à l'effacement** : Suppression du compte
- **Droit à la portabilité** : Export des données
- **Droit d'opposition** : Refus du traitement

### Pages légales

- `/legal` : Mentions légales complètes
- `/privacy` : Politique de confidentialité détaillée

## Audit de Sécurité

### Checklist (90%+ requis)

- [x] Mots de passe hashés avec bcrypt
- [x] Validation stricte (12+ caractères)
- [x] Sessions sécurisées (HttpOnly, Secure, SameSite)
- [x] Timeout de session (30 min)
- [x] Système de rôles (USER, ADMIN)
- [x] Protection IDOR (vérification ownership)
- [x] Requêtes préparées (SQL injection)
- [x] Échappement des données (XSS)
- [x] Headers de sécurité (X-Frame-Options, CSP, etc.)
- [x] HTTPS configuré
- [x] Secrets en .env (pas dans le code)
- [x] .gitignore configuré
- [x] Formulaire RGPD conforme
- [x] Consentement explicite
- [x] Mentions légales + Confidentialité
- [x] npm audit clean

### Résultats

```bash
$ npm audit
found 0 vulnerabilities
```

## Documentation supplémentaire

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [RGPD - CNIL](https://www.cnil.fr/fr/reglement-europeen-protection-donnees)
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [Helmet.js](https://helmetjs.github.io/)

## Auteur

Projet académique - Module Sécurité des Applications Web  
2025

## Licence

Ce projet est réalisé à des fins pédagogiques uniquement.

Wuthering Waves est une marque déposée de Kuro Games.

---

**Note de sécurité** : Ce projet implémente des mesures de sécurité de niveau production, mais reste un projet académique. Pour un déploiement réel, un audit de sécurité professionnel est recommandé.
