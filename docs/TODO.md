# 📋 TODO - Wuthering Waves Builder

**Projet** : Wuthering Waves Database  
**Statut actuel** : 92% conforme (60/65 critères)  
**Date** : 28 novembre 2025

---

## ✅ COMPLÉTÉ (92%)

### Authentification & Sécurité
- [x] Système d'authentification avec bcrypt (10 rounds)
- [x] Validation stricte mots de passe (12+ caractères, complexité)
- [x] Sessions sécurisées (HttpOnly, Secure, SameSite=Strict, 30min)
- [x] Middlewares isAuthenticated et isAdmin
- [x] Protection IDOR (vérification ownership)
- [x] Messages d'erreur génériques

### Injections & Validation
- [x] Drizzle ORM avec requêtes préparées (SQL Injection)
- [x] React auto-escape (Protection XSS)
- [x] Validation Zod sur toutes les routes
- [x] Schemas stricts pour updates

### Contrôle d'Accès
- [x] Système de rôles USER/ADMIN
- [x] Routes admin protégées
- [x] Panel administration complet
- [x] Prévention auto-modification rôle admin

### RGPD & Conformité
- [x] Minimisation des données (email, nom, prénom uniquement)
- [x] Consentement explicite (checkbox non pré-cochée)
- [x] Page mentions légales (/legal)
- [x] Page politique de confidentialité (/privacy)
- [x] Cascade delete (favoris, builds)

### Headers & Configuration
- [x] Helmet 8.1.0 avec tous les headers
- [x] X-Content-Type-Options: nosniff
- [x] X-Frame-Options: DENY
- [x] Content-Security-Policy configuré
- [x] HSTS avec preload

### Documentation
- [x] README.md complet
- [x] RAPPORT_AUDIT_SECURITE.md (17/17 critères)
- [x] CONFORMITE_CAHIER_DES_CHARGES.md
- [x] .gitignore configuré
- [x] .env.example documenté

### Git & Repository
- [x] Repository initialisé proprement
- [x] Commits atomiques par fonctionnalité
- [x] Historique propre (Jours 1-6)
- [x] Push sur GitHub réussi

---

## ⚠️ EN COURS / À FAIRE (8%)

### 1. HTTPS Local (Priorité HAUTE) ⏰ 10 minutes

**Pourquoi** : Conformité checklist (critère 1.7), cookie Secure testable localement

**Étapes** :

```bash
# Installer mkcert
brew install mkcert  # macOS
# ou : choco install mkcert  # Windows
# ou : apt install mkcert  # Linux

# Créer autorité de certification locale
mkcert -install

# Générer certificats pour localhost
cd /Users/tonio/Downloads/WutheringDatabase
mkcert localhost 127.0.0.1 ::1
```

**Modifications code** :

```typescript
// vite.config.ts
import fs from 'fs';

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem')
    },
    port: 6500
  }
});
```

**Commit** :
```bash
git add localhost*.pem vite.config.ts
git commit -m "feat(dev): HTTPS local avec mkcert

- Certificat auto-signé pour développement
- Cookie Secure activé même en local
- Configuration Vite pour HTTPS
- Port 6500 avec https://localhost:6500"
```

**Validation** :
- [ ] Accéder à https://localhost:6500 (pas http://)
- [ ] Pas d'avertissement sécurité
- [ ] Cookie avec flag Secure visible dans DevTools

---

### 2. Déploiement Production (Priorité HAUTE) ⏰ 30 minutes

**Pourquoi** : Critère obligatoire cahier des charges, nécessaire pour validation

**Option A : Railway (RECOMMANDÉ)**

1. **Créer compte** : https://railway.app (connexion GitHub)

2. **Nouveau projet** :
   - New Project → Deploy from GitHub
   - Sélectionner `Caotox/Wuthering-Waves-Builder`
   - Autoriser accès repository

3. **Ajouter PostgreSQL** :
   - Add Service → Database → PostgreSQL
   - Attendre provisioning (2-3 min)
   - `DATABASE_URL` auto-généré

4. **Variables d'environnement** :
   ```
   DATABASE_URL=${RAILWAY_POSTGRES_URL}  # Auto-linked
   SESSION_SECRET=<générer avec : node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
   NODE_ENV=production
   PORT=6500
   ```

5. **Deploy** :
   - Trigger deploy
   - Attendre build (3-5 min)
   - HTTPS automatique avec certificat Let's Encrypt

6. **Tester** :
   - Ouvrir URL (ex: wuthering-waves-builder-production.up.railway.app)
   - Vérifier certificat SSL (🔒 dans barre d'adresse)
   - Créer compte test
   - Vérifier fonctionnalités

**Option B : Render**

1. Compte sur https://render.com
2. New → Web Service
3. Connect repository GitHub
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Add PostgreSQL database
7. Environment variables (mêmes que Railway)
8. Deploy

**Commit après déploiement** :
```bash
git commit -m "deploy: configuration production Railway

- Application déployée sur Railway
- PostgreSQL production configuré
- Variables d'environnement sécurisées
- HTTPS automatique actif
- URL: <url-production>

Fixes: Conformité critère 8.1 (déploiement)"
```

**Validation** :
- [ ] Application accessible via HTTPS
- [ ] Certificat SSL valide (pas d'avertissement)
- [ ] Inscription/connexion fonctionnent
- [ ] Panel admin accessible
- [ ] Headers sécurité présents (vérifier avec curl)

---

### 3. Rate Limiting (Priorité MOYENNE) ⏰ 15 minutes

**Pourquoi** : Protection brute force, recommandé dans audit (non bloquant)

**Installation** :
```bash
npm install express-rate-limit
```

**Code** :

```typescript
// server/app.ts
import rateLimit from 'express-rate-limit';

// Rate limiter pour authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  message: 'Trop de tentatives. Réessayez dans 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Appliquer sur les routes auth
app.use('/api/login', authLimiter);
app.use('/api/register', authLimiter);
```

**Commit** :
```bash
git add package.json server/app.ts
git commit -m "feat(security): rate limiting sur auth routes

- express-rate-limit installé
- 5 tentatives max par 15 min
- Protection contre brute force
- Messages d'erreur après limite atteinte"
```

**Validation** :
- [ ] Tenter 6 connexions avec mauvais mot de passe → Bloqué
- [ ] Attendre 15 min → Déblocage automatique

---

### 4. Tests de Sécurité (Priorité BASSE) ⏰ 30 minutes

**Pourquoi** : Bonus, améliore la qualité du code

**Installation** :
```bash
npm install --save-dev vitest @vitest/ui supertest @types/supertest
```

**Fichiers à créer** :

```typescript
// tests/security.test.ts
import { describe, test, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server/app';

describe('Security Tests', () => {
  test('should reject weak passwords', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        email: 'test@test.com',
        password: '123',
        firstName: 'Test',
        lastName: 'User',
        consent: true
      });
    expect(response.status).toBe(400);
  });

  test('should prevent IDOR on builds', async () => {
    // TODO: Tenter d'accéder au build d'un autre utilisateur
  });

  test('should escape XSS in build notes', async () => {
    // TODO: Poster <script>alert('XSS')</script>
  });
});
```

**Commit** :
```bash
git add tests/ vitest.config.ts package.json
git commit -m "test: tests de sécurité automatisés

- Vitest configuré
- Tests validation mot de passe
- Tests protection IDOR (TODO)
- Tests XSS (TODO)"
```

---

### 5. Améliorations UX (Priorité TRÈS BASSE)

**Fonctionnalités bonus** :

- [ ] Système de builds avancé (templates, filtres par rôle)
- [ ] Export builds en JSON
- [ ] Recherche/tri des personnages
- [ ] Mode sombre
- [ ] Notifications toast améliorées
- [ ] Loading states sur les formulaires

---

## 📊 STATUT PAR CATÉGORIE

| Catégorie | Complété | À faire | Total | % |
|-----------|----------|---------|-------|---|
| Auth & Sessions | 11/11 | 0 | 11 | 100% |
| Contrôle Accès | 6/6 | 0 | 6 | 100% |
| Injections | 6/6 | 0 | 6 | 100% |
| RGPD | 10/10 | 0 | 10 | 100% |
| Headers Sécurité | 6/6 | 0 | 6 | 100% |
| Architecture | 8/9 | 1 (HTTPS local) | 9 | 89% |
| Déploiement | 3/5 | 2 (deploy + HTTPS prod) | 5 | 60% |
| Tests | 5/5 | 0 | 5 | 100% |
| Documentation | 5/5 | 0 | 5 | 100% |
| **TOTAL** | **60/63** | **3** | **63** | **95%** |

---

## 🎯 PLAN D'ACTION RECOMMANDÉ

### Avant la soutenance (OBLIGATOIRE)

1. ✅ **HTTPS Local** (10 min) - Critère checklist
2. ✅ **Déploiement** (30 min) - Critère obligatoire cahier des charges

**→ Score après : 98% (62/63)**

### Si temps restant (OPTIONNEL)

3. ⭐ **Rate Limiting** (15 min) - Sécurité renforcée
4. ⭐ **Tests** (30 min) - Qualité code

**→ Score final : 100% (63/63)**

---

## 📝 CHECKLIST SOUTENANCE

### Préparation démo
- [ ] Compte User créé : `user@test.com`
- [ ] Compte Admin créé : `admin@test.com`
- [ ] 3-4 personnages en favoris
- [ ] 2-3 builds créés
- [ ] Navigateur avec DevTools ouvert (onglet Network + Application)

### Points à montrer
1. **Authentification** :
   - [ ] Inscription avec mot de passe faible → Rejet
   - [ ] Inscription avec mot de passe fort → Succès
   - [ ] Connexion avec User

2. **Contrôle d'accès** :
   - [ ] Tenter accès /admin en User → Rejet 403
   - [ ] Connexion Admin → Accès panel admin

3. **Sécurité** :
   - [ ] Cookies dans DevTools (HttpOnly, Secure, SameSite)
   - [ ] Headers de sécurité (Network → Response Headers)
   - [ ] Page /legal et /privacy

4. **Code** :
   - [ ] Montrer bcrypt dans `server/auth.ts`
   - [ ] Montrer Drizzle ORM dans `server/storage.ts`
   - [ ] Montrer middleware isAdmin

5. **RGPD** :
   - [ ] Checkbox consentement décochée
   - [ ] Minimisation données (4 champs seulement)
   - [ ] Pages légales complètes

---

## 🔗 RESSOURCES

### Documentation
- [README.md](../README.md) - Documentation complète
- [RAPPORT_AUDIT_SECURITE.md](../RAPPORT_AUDIT_SECURITE.md) - Audit 17/17
- [CONFORMITE_CAHIER_DES_CHARGES.md](../CONFORMITE_CAHIER_DES_CHARGES.md) - 92%

### Liens externes
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [RGPD - CNIL](https://www.cnil.fr/fr/reglement-europeen-protection-donnees)
- [Railway Docs](https://docs.railway.app/)
- [mkcert](https://github.com/FiloSottile/mkcert)

---

**Dernière mise à jour** : 28 novembre 2025  
**Prochaine action** : Configurer HTTPS local avec mkcert
