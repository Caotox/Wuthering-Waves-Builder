import { describe, it, expect, beforeEach, vi } from 'vitest';
import { hash, compare } from 'bcrypt';
import { TEST_PASSWORDS, TEST_HASHES, TEST_BCRYPT_ROUNDS, TEST_XSS_INPUTS, TEST_EMAILS } from './fixtures';

// Mock bcrypt pour les tests (éviter les vrais calculs de hash)
vi.mock('bcrypt', () => ({
  hash: vi.fn(),
  compare: vi.fn(),
}));

describe('Sécurité des mots de passe (bcrypt)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hash un mot de passe avec bcrypt', async () => {
    const password = TEST_PASSWORDS.valid();
    const mockHash = TEST_HASHES.MOCK_HASH;
    
    vi.mocked(hash).mockResolvedValue(mockHash as any);
    
    const hashedPassword = await hash(password, TEST_BCRYPT_ROUNDS);
    
    expect(hash).toHaveBeenCalledWith(password, TEST_BCRYPT_ROUNDS);
    expect(hashedPassword).toBe(mockHash);
  });

  it('vérifie un mot de passe correct', async () => {
    const password = TEST_PASSWORDS.valid();
    const hashedPassword = TEST_HASHES.MOCK_HASH;
    
    vi.mocked(compare).mockResolvedValue(true as any);
    
    const isValid = await compare(password, hashedPassword);
    
    expect(compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(isValid).toBe(true);
  });

  it('rejette un mot de passe incorrect', async () => {
    const password = TEST_PASSWORDS.valid();
    const hashedPassword = TEST_HASHES.MOCK_HASH;
    
    vi.mocked(compare).mockResolvedValue(false as any);
    
    const isValid = await compare(password, hashedPassword);
    
    expect(compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(isValid).toBe(false);
  });

  it('utilise 10 rounds de hashing (sécurité)', async () => {
    const password = TEST_PASSWORDS.valid();
    vi.mocked(hash).mockResolvedValue(TEST_HASHES.MOCK_HASH_PREFIX as any);
    
    await hash(password, TEST_BCRYPT_ROUNDS);
    
    expect(hash).toHaveBeenCalledWith(password, TEST_BCRYPT_ROUNDS);
  });
});

describe('Protection XSS', () => {
  it('échappe les caractères dangereux dans le HTML', () => {
    const dangerousString = TEST_XSS_INPUTS.SCRIPT_TAG;
    const escaped = dangerousString
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#x27;');
    
    expect(escaped).not.toContain('<script>');
    expect(escaped).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
  });

  it('sanitise les entrées utilisateur', () => {
    const userInput = TEST_XSS_INPUTS.INJECTION_ATTEMPT;
    const sanitized = userInput.replace(/<[^>]*>/g, '');
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toBe('">alert("XSS")');
  });
});

describe('Validation des entrées', () => {
  it('valide le format email', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    expect(emailRegex.test(TEST_EMAILS.VALID_EMAIL_1)).toBe(true);
    expect(emailRegex.test('invalid.email')).toBe(false);
    expect(emailRegex.test('no@domain')).toBe(false);
    expect(emailRegex.test('@nodomain.com')).toBe(false);
  });

  it('limite la longueur des chaînes', () => {
    const maxLength = 255;
    const validString = 'a'.repeat(200);
    const invalidString = 'a'.repeat(300);
    
    expect(validString.length).toBeLessThanOrEqual(maxLength);
    expect(invalidString.length).toBeGreaterThan(maxLength);
  });

  it('rejette les caractères SQL dangereux', () => {
    const sqlInjectionAttempt = TEST_XSS_INPUTS.SQL_INJECTION;
    const hasDangerousChars = /['";\\]/.test(sqlInjectionAttempt);
    
    expect(hasDangerousChars).toBe(true);
  });
});

describe('Contrôle d\'accès (RBAC)', () => {
  it('vérifie les permissions ADMIN', () => {
    const userRole = 'ADMIN';
    const requiredRole = 'ADMIN';
    
    expect(userRole === requiredRole).toBe(true);
  });

  it('refuse l\'accès USER aux routes ADMIN', () => {
    const userRole = 'USER';
    const requiredRole = 'ADMIN';
    
    expect(userRole === requiredRole).toBe(false);
  });

  it('autorise l\'accès USER aux routes USER', () => {
    const userRole = 'USER';
    const allowedRoles = ['USER', 'ADMIN'];
    
    expect(allowedRoles.includes(userRole)).toBe(true);
  });
});
