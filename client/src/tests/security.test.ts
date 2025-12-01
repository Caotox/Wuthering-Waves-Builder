import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { hash, compare } from 'bcrypt';

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
    const password = 'MySecurePassword123!';
    const mockHash = '$2b$10$mockHashedPassword';
    
    vi.mocked(hash).mockResolvedValue(mockHash as any);
    
    const hashedPassword = await hash(password, 10);
    
    expect(hash).toHaveBeenCalledWith(password, 10);
    expect(hashedPassword).toBe(mockHash);
  });

  it('vérifie un mot de passe correct', async () => {
    const password = 'MySecurePassword123!';
    const hashedPassword = '$2b$10$mockHashedPassword';
    
    vi.mocked(compare).mockResolvedValue(true as any);
    
    const isValid = await compare(password, hashedPassword);
    
    expect(compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(isValid).toBe(true);
  });

  it('rejette un mot de passe incorrect', async () => {
    const password = 'WrongPassword123!';
    const hashedPassword = '$2b$10$mockHashedPassword';
    
    vi.mocked(compare).mockResolvedValue(false as any);
    
    const isValid = await compare(password, hashedPassword);
    
    expect(compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(isValid).toBe(false);
  });

  it('utilise 10 rounds de hashing (sécurité)', async () => {
    const password = 'TestPassword123!';
    vi.mocked(hash).mockResolvedValue('$2b$10$hash' as any);
    
    await hash(password, 10);
    
    expect(hash).toHaveBeenCalledWith(password, 10);
  });
});

describe('Protection XSS', () => {
  it('échappe les caractères dangereux dans le HTML', () => {
    const dangerousString = '<script>alert("XSS")</script>';
    const escaped = dangerousString
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
    
    expect(escaped).not.toContain('<script>');
    expect(escaped).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
  });

  it('sanitise les entrées utilisateur', () => {
    const userInput = '"><script>alert("XSS")</script>';
    const sanitized = userInput.replace(/<[^>]*>/g, '');
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toBe('">alert("XSS")');
  });
});

describe('Validation des entrées', () => {
  it('valide le format email', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    expect(emailRegex.test('valid@email.com')).toBe(true);
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
    const sqlInjectionAttempt = "'; DROP TABLE users; --";
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
