# Tests Unitaires - Wuthering Waves Database

## Vue d'ensemble

Le projet contient **30 tests unitaires** couvrant les aspects critiques de sécurité et les composants React.

### Statistiques
- [OK] **30 tests** passent avec succès
- **12 tests de sécurité**
- **13 tests de validation**
- ⚛️ **5 tests de composants React**

## Exécution des tests

### Lancer tous les tests
```bash
npm test
```

### Mode watch (relance automatique)
```bash
npm run test:watch
```

### Interface graphique
```bash
npm run test:ui
```

### Avec couverture de code
```bash
npm run test:coverage
```

## 📁 Structure des tests

```
client/src/
├── components/
│ └── __tests__/
│ └── navbar.test.tsx # Tests du composant Navbar
├── lib/
│ └── __tests__/
│ └── authUtils.test.ts # Tests des fonctions de validation
└── tests/
 ├── setup.ts # Configuration globale
 └── security.test.ts # Tests de sécurité

vitest.config.ts # Configuration Vitest
```

## Tests implémentés

### 1. Tests de sécurité (security.test.ts)

#### Hachage de mots de passe (bcrypt)
- [OK] Hash avec 10 rounds
- [OK] Vérification de mot de passe correct
- [OK] Rejet de mot de passe incorrect

#### Protection XSS
- [OK] Échappement des caractères dangereux (`<script>`, etc.)
- [OK] Sanitisation des entrées utilisateur

#### Validation des entrées
- [OK] Format email valide
- [OK] Limite de longueur des chaînes
- [OK] Détection de caractères SQL dangereux

#### Contrôle d'accès (RBAC)
- [OK] Vérification des permissions ADMIN
- [OK] Refus d'accès USER aux routes ADMIN
- [OK] Autorisation d'accès USER aux routes USER

### 2. Tests de validation (authUtils.test.ts)

#### Validation de mot de passe
- [OK] Accepte un mot de passe valide (8+ chars, maj, min, chiffre, spécial)
- [OK] Rejette si trop court (< 8 caractères)
- [OK] Rejette si manque majuscule
- [OK] Rejette si manque minuscule
- [OK] Rejette si manque chiffre
- [OK] Rejette si manque caractère spécial

#### Validation d'email
- [OK] Accepte un email valide
- [OK] Rejette si manque @
- [OK] Rejette si manque domaine
- [OK] Rejette si manque nom d'utilisateur
- [OK] Rejette si contient des espaces

### 3. Tests de composants (navbar.test.tsx)

#### Navbar
- [OK] Affiche le logo et le titre
- [OK] Affiche les liens pour utilisateur authentifié
- [OK] Affiche le lien admin pour administrateur
- [OK] Affiche le menu utilisateur
- [OK] Affiche le bouton menu mobile

## 🔧 Technologies utilisées

- **Vitest** - Framework de test rapide (compatible Vite)
- **@testing-library/react** - Tests de composants React
- **@testing-library/jest-dom** - Matchers personnalisés
- **jsdom** - Environnement DOM pour les tests

## Couverture de code

Les tests couvrent :
- [OK] Composants UI critiques (Navbar)
- [OK] Fonctions de validation (authUtils)
- [OK] Mécanismes de sécurité (bcrypt, XSS, SQL injection)
- [OK] Contrôle d'accès (RBAC)

## Bonnes pratiques

1. **Tests isolés** : Chaque test est indépendant
2. **Mocks** : Utilisation de `vi.mock()` pour les dépendances
3. **Cleanup** : Nettoyage automatique après chaque test
4. **Assertions claires** : Messages d'erreur explicites
5. **Organisation** : Tests groupés par fonctionnalité

## Tests de sécurité

Les tests vérifient que :
- Les mots de passe sont hashés avec bcrypt (10 rounds)
- Les entrées utilisateur sont validées
- Les caractères dangereux sont échappés (protection XSS)
- Les injections SQL sont détectées
- Le RBAC fonctionne correctement

## Ajouter de nouveaux tests

### Exemple : Tester un composant
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('MonComposant', () => {
 it('affiche le contenu', () => {
 render(<MonComposant />);
 expect(screen.getByText('Mon texte')).toBeInTheDocument();
 });
});
```

### Exemple : Tester une fonction
```typescript
import { describe, it, expect } from 'vitest';
import { maFonction } from '@/lib/utils';

describe('maFonction', () => {
 it('retourne le bon résultat', () => {
 expect(maFonction('input')).toBe('output');
 });
});
```

## 🐛 Debugging

Pour déboguer un test spécifique :
```bash
# Lancer un seul fichier
npm test -- navbar.test.tsx

# Mode debug avec logs
npm test -- --reporter=verbose

# Interface UI pour explorer les tests
npm run test:ui
```

## [OK] CI/CD

Les tests peuvent être intégrés dans un pipeline CI/CD :
```yaml
# Exemple GitHub Actions
- name: Run tests
 run: npm test
 
- name: Check coverage
 run: npm run test:coverage
```

## Ressources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
