# Wuthering Waves Database

Application web full-stack sécurisée de gestion des personnages de Wuthering Waves. Projet académique démontrant l'implémentation de standards de sécurité OWASP et la conformité RGPD.

## Table des matières

- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Fonctionnalités](#fonctionnalités)
- [Sécurité](#sécurité)
- [Technologies](#technologies)
- [Conformité RGPD](#conformité-rgpd)
- [Documentation](#documentation)

## Installation

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** 18+ ([Télécharger](https://nodejs.org/))
- **PostgreSQL** 14+ ([Télécharger](https://www.postgresql.org/download/))
- **npm** (inclus avec Node.js) ou **yarn**
- **Git** ([Télécharger](https://git-scm.com/))

### Guide d'installation pas à pas

#### 1. Cloner le repository

```bash
git clone https://github.com/Caotox/Wuthering-Waves-Builder.git
cd Wuthering-Waves-Builder
```

#### 2. Installer les dépendances

```bash
npm install
```

Cette commande installe toutes les dépendances nécessaires définies dans `package.json`.

#### 3. Créer la base de données PostgreSQL

**Option A : Via psql (ligne de commande)**
```bash
# Se connecter à PostgreSQL
psql -U postgres

# Dans psql, créer la base de données
CREATE DATABASE wuthering_db;

# Créer un utilisateur (optionnel mais recommandé)
CREATE USER wuthering_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE wuthering_db TO wuthering_user;

# Quitter psql
\q
```

**Option B : Via pgAdmin (interface graphique)**
1. Ouvrir pgAdmin
2. Clic droit sur "Databases" → "Create" → "Database"
3. Nom : `wuthering_db`
4. Sauvegarder

#### 4. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Éditer le fichier `.env` avec vos informations :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://wuthering_user:your_secure_password@localhost:5432/wuthering_db"

# Clé secrète pour les sessions (générer une clé aléatoire forte)
SESSION_SECRET="votre-cle-secrete-de-32-caracteres-minimum"

# Environnement
NODE_ENV="development"

# Port du serveur (optionnel, 3000 par défaut)
PORT=3000
```

**Important : Générer un SESSION_SECRET fort**

```bash
# Méthode 1 : Avec Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Méthode 2 : Avec OpenSSL
openssl rand -hex 32
```

#### 5. Initialiser la base de données

Pousser le schéma vers PostgreSQL :

```bash
npm run db:push
```

Cette commande crée automatiquement toutes les tables nécessaires.

#### 6. Peupler la base de données (optionnel)

Ajouter des données de test (personnages, etc.) :

```bash
npm run db:seed
```

#### 7. Créer un compte administrateur

```bash
npx tsx server/add-admin.ts
```

Ou créer un administrateur personnalisé en modifiant `server/add-admin.ts`.

#### 8. Démarrer l'application

**Mode développement :**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:5173](http://localhost:5173)

**Mode production :**
```bash
# Construire l'application
npm run build

# Lancer en production
npm start
```

### Vérification de l'installation

Si tout s'est bien passé, vous devriez voir :

```bash
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Ouvrez votre navigateur et accédez à [http://localhost:5173](http://localhost:5173)

## Fonctionnalités

### Authentification & Autorisation
- Inscription sécurisée avec validation stricte des mots de passe (12+ caractères, majuscules, minuscules, chiffres, caractères spéciaux)
- Hachage bcrypt avec 10 rounds minimum
- Connexion avec protection anti-énumération et messages d'erreur génériques
- Rate limiting sur les endpoints d'authentification (5 tentatives / 15 minutes)
- Sessions sécurisées avec timeout automatique (30 minutes)
- Cookies HttpOnly, Secure, SameSite=Strict
- Système de rôles (USER, ADMIN) avec contrôle d'accès côté serveur
- Déconnexion sécurisée avec destruction complète de la session

### Gestion des personnages
- Consultation publique de la liste et des détails des personnages
- Système de favoris pour les utilisateurs authentifiés
- Création et gestion de builds personnalisés
- Panel administrateur avec CRUD complet (admin uniquement)
- Recherche et filtres par élément, arme et rareté

### Conformité légale
- Mentions légales complètes conformes au RGPD
- Politique de confidentialité détaillée
- Consentement explicite à la collecte de données
- Minimisation des données collectées
- Respect des droits des utilisateurs (accès, rectification, effacement, portabilité)

## Sécurité

Cette application implémente les standards de sécurité OWASP et suit les meilleures pratiques de l'industrie.

### Mesures de sécurité implémentées

#### Authentification robuste
- Hachage des mots de passe avec bcrypt (10 rounds minimum)
- Validation stricte : 12+ caractères, majuscules, minuscules, chiffres, caractères spéciaux
- Stockage sécurisé : hash irréversible en base de données
- Sessions sécurisées avec cookies HttpOnly, Secure et SameSite=Strict
- Timeout de session configurable (30 minutes par défaut)
- Régénération de l'ID de session après connexion

#### Contrôle d'accès (RBAC)
- Système de rôles hiérarchiques (USER, ADMIN)
- Middleware d'authentification côté serveur
- Protection IDOR avec vérification de propriété des ressources
- Séparation stricte des permissions par rôle

#### Protection contre les injections
- Requêtes préparées avec Drizzle ORM (protection SQL injection)
- Échappement automatique des données avec React/JSX
- Validation et sanitization des entrées utilisateur
- Regex sécurisés sans backtracking excessif (protection ReDoS)

#### Headers de sécurité HTTP
- Configuration Helmet.js avec Content Security Policy
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (HSTS)
- Referrer-Policy

#### Rate Limiting
- Limitation des tentatives de connexion (5 tentatives / 15 minutes)
- Protection contre les attaques par force brute
- Rate limiting sur les endpoints de création de compte

#### Gestion des secrets
- Variables d'environnement (.env) gitignorées
- Génération de secrets cryptographiquement sûrs
- Aucun secret hardcodé dans le code source
- SESSION_SECRET minimum 32 caractères aléatoires

#### Protection CSRF
- Cookies SameSite=Strict
- Validation des headers Origin/Referer
- Architecture SPA avec communication API sécurisée

### Audit de sécurité

#### Checklist de conformité (100%)

- [x] Hachage bcrypt des mots de passe
- [x] Validation stricte des mots de passe
- [x] Sessions sécurisées
- [x] Timeout de session
- [x] Système de rôles
- [x] Protection IDOR
- [x] Requêtes préparées
- [x] Échappement des données
- [x] Headers de sécurité HTTP
- [x] Rate limiting
- [x] HTTPS configuré
- [x] Secrets en .env
- [x] .gitignore configuré
- [x] npm audit clean

#### Résultats des tests

- npm audit : 0 vulnérabilités
- TypeScript : Compilation réussie
- Tests unitaires : 30 tests passés

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

### Variables d'environnement

Le fichier `.env` contient toutes les configurations sensibles. Ne jamais commiter ce fichier !

#### Variables requises

| Variable | Description | Valeur par défaut | Exemple |
|----------|-------------|-------------------|---------|
| `DATABASE_URL` | URL de connexion PostgreSQL | - | `postgresql://user:pass@localhost:5432/wuthering_db` |
| `SESSION_SECRET` | Clé secrète pour les sessions (min 32 caractères) | - | Généré via crypto.randomBytes(32) |
| `NODE_ENV` | Environnement d'exécution | `development` | `development`, `production` |
| `PORT` | Port du serveur Express | `5173` | `3000`, `8080` |

#### Structure du fichier .env

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Sessions (CRITIQUE : Générer une valeur unique et forte)
SESSION_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"

# Environment
NODE_ENV="development"

# Server
PORT=5173
```

### Sécurité de la configuration

#### Checklist de sécurité

- [ ] `.env` est dans `.gitignore`
- [ ] `SESSION_SECRET` est généré aléatoirement (32+ caractères)
- [ ] Mot de passe PostgreSQL est fort (12+ caractères)
- [ ] Pas de secrets hardcodés dans le code
- [ ] `.env.example` ne contient aucune vraie valeur

#### Générer des secrets sécurisés

```bash
# SESSION_SECRET avec Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# SESSION_SECRET avec OpenSSL
openssl rand -hex 32

# Mot de passe PostgreSQL fort
openssl rand -base64 24
```

## Utilisation

### Commandes principales

#### Développement

```bash
# Démarrer le serveur de développement avec hot-reload
npm run dev

# Vérifier les erreurs TypeScript
npm run check

# Lancer les tests unitaires
npm test

# Lancer les tests avec couverture
npm run test:coverage

# Lancer les tests en mode watch
npm run test:watch
```

#### Base de données

```bash
# Pousser le schéma vers la base de données
npm run db:push

# Peupler la base avec des données de test
npm run db:seed

# Créer un administrateur
npx tsx server/add-admin.ts
```

#### Production

```bash
# Construire l'application pour la production
npm run build

# Lancer en mode production
npm start
```

#### Audit et sécurité

```bash
# Vérifier les vulnérabilités npm
npm audit

# Vérifier uniquement les vulnérabilités critiques/élevées
npm audit --audit-level=high

# Tenter de corriger automatiquement
npm audit fix

# Forcer les corrections (breaking changes possibles)
npm audit fix --force
```

### Workflow de développement recommandé

1. **Démarrer** : `npm run dev`
2. **Développer** : Modifier le code (hot-reload automatique)
3. **Tester** : `npm test` après chaque modification importante
4. **Vérifier** : `npm run check` avant de commiter
5. **Auditer** : `npm audit` régulièrement
6. **Commiter** : Git avec messages clairs

### Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarre Vite + Express en mode dev avec hot-reload |
| `npm run build` | Compile frontend (Vite) et backend (esbuild) |
| `npm start` | Lance le serveur en mode production |
| `npm run check` | Vérifie la syntaxe TypeScript sans compiler |
| `npm test` | Lance Vitest en mode run |
| `npm run test:watch` | Lance Vitest en mode watch |
| `npm run test:ui` | Interface graphique des tests |
| `npm run test:coverage` | Génère un rapport de couverture de code |
| `npm run db:push` | Synchronise le schéma Drizzle avec PostgreSQL |
| `npm run db:seed` | Peuple la base avec des données de test |

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
