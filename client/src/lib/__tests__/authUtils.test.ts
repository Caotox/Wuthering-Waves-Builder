import { describe, it, expect } from 'vitest';
import { isValidPassword, isValidEmail } from '@/lib/authUtils';

describe('authUtils', () => {
  describe('isValidPassword', () => {
    it('accepte un mot de passe valide', () => {
      expect(isValidPassword('Password123!')).toBe(true);
      expect(isValidPassword('Test@1234')).toBe(true);
      expect(isValidPassword('MyP@ssw0rd')).toBe(true);
    });

    it('rejette un mot de passe trop court', () => {
      expect(isValidPassword('Pass1!')).toBe(false);
    });

    it('rejette un mot de passe sans majuscule', () => {
      expect(isValidPassword('password123!')).toBe(false);
    });

    it('rejette un mot de passe sans minuscule', () => {
      expect(isValidPassword('PASSWORD123!')).toBe(false);
    });

    it('rejette un mot de passe sans chiffre', () => {
      expect(isValidPassword('Password!')).toBe(false);
    });

    it('rejette un mot de passe sans caractère spécial', () => {
      expect(isValidPassword('Password123')).toBe(false);
    });

    it('rejette une chaîne vide', () => {
      expect(isValidPassword('')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('accepte un email valide', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@domain.co.uk')).toBe(true);
      expect(isValidEmail('john.doe+tag@example.org')).toBe(true);
    });

    it('rejette un email sans @', () => {
      expect(isValidEmail('userexample.com')).toBe(false);
    });

    it('rejette un email sans domaine', () => {
      expect(isValidEmail('user@')).toBe(false);
    });

    it('rejette un email sans nom d\'utilisateur', () => {
      expect(isValidEmail('@example.com')).toBe(false);
    });

    it('rejette une chaîne vide', () => {
      expect(isValidEmail('')).toBe(false);
    });

    it('rejette un email avec espaces', () => {
      expect(isValidEmail('user @example.com')).toBe(false);
      expect(isValidEmail('user@exam ple.com')).toBe(false);
    });
  });
});
