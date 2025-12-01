import { describe, it, expect } from 'vitest';
import { isValidPassword, isValidEmail } from '@/lib/authUtils';
import { TEST_PASSWORDS, TEST_EMAILS } from '@/tests/fixtures';

describe('authUtils', () => {
  describe('isValidPassword', () => {
    it('accepte un mot de passe valide', () => {
      expect(isValidPassword(TEST_PASSWORDS.VALID_PASSWORD_1)).toBe(true);
      expect(isValidPassword(TEST_PASSWORDS.VALID_PASSWORD_2)).toBe(true);
      expect(isValidPassword(TEST_PASSWORDS.VALID_PASSWORD_3)).toBe(true);
    });

    it('rejette un mot de passe trop court', () => {
      expect(isValidPassword(TEST_PASSWORDS.SHORT_PASSWORD)).toBe(false);
    });

    it('rejette un mot de passe sans majuscule', () => {
      expect(isValidPassword(TEST_PASSWORDS.NO_UPPERCASE)).toBe(false);
    });

    it('rejette un mot de passe sans minuscule', () => {
      expect(isValidPassword(TEST_PASSWORDS.NO_LOWERCASE)).toBe(false);
    });

    it('rejette un mot de passe sans chiffre', () => {
      expect(isValidPassword(TEST_PASSWORDS.NO_DIGIT)).toBe(false);
    });

    it('rejette un mot de passe sans caractère spécial', () => {
      expect(isValidPassword(TEST_PASSWORDS.NO_SPECIAL)).toBe(false);
    });

    it('rejette une chaîne vide', () => {
      expect(isValidPassword('')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('accepte un email valide', () => {
      expect(isValidEmail(TEST_EMAILS.VALID_EMAIL_1)).toBe(true);
      expect(isValidEmail(TEST_EMAILS.VALID_EMAIL_2)).toBe(true);
      expect(isValidEmail(TEST_EMAILS.VALID_EMAIL_3)).toBe(true);
    });

    it('rejette un email sans @', () => {
      expect(isValidEmail(TEST_EMAILS.INVALID_NO_AT)).toBe(false);
    });

    it('rejette un email sans domaine', () => {
      expect(isValidEmail(TEST_EMAILS.INVALID_NO_DOMAIN)).toBe(false);
    });

    it('rejette un email sans nom d\'utilisateur', () => {
      expect(isValidEmail(TEST_EMAILS.INVALID_NO_USER)).toBe(false);
    });

    it('rejette une chaîne vide', () => {
      expect(isValidEmail('')).toBe(false);
    });

    it('rejette un email avec espaces', () => {
      expect(isValidEmail(TEST_EMAILS.INVALID_WITH_SPACES)).toBe(false);
      expect(isValidEmail('user@exam ple.com')).toBe(false);
    });
  });
});
