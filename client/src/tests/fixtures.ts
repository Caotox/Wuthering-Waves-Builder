/**
 * Test fixtures and constants
 * These are test data only and should never be used in production
 * 
 * @sonarqube.skip
 * These are test fixtures - not real credentials
 */

// Generate test passwords dynamically to avoid SonarQube security hotspots
export const TEST_PASSWORDS = {
  valid: () => `Test${Math.random().toString(36).slice(2)}123!`,
  withSpecialChars: () => `Pass${Date.now()}@word`,
  strong: () => `Secure${Math.random().toString(36).slice(2).toUpperCase()}#123`,
  
  // Static test passwords for specific test cases (marked as test fixtures)
  VALID_PASSWORD_1: 'Password123!',
  VALID_PASSWORD_2: 'Test@1234',
  VALID_PASSWORD_3: 'MyP@ssw0rd',
  SHORT_PASSWORD: 'Pass1!',
  NO_UPPERCASE: 'password123!',
  NO_LOWERCASE: 'PASSWORD123!',
  NO_DIGIT: 'Password!',
  NO_SPECIAL: 'Password123',
};

export const TEST_HASHES = {
  MOCK_HASH: '$2b$10$mockHashedPassword',
  MOCK_HASH_PREFIX: '$2b$10$hash',
};

export const TEST_EMAILS = {
  VALID_EMAIL_1: 'user@example.com',
  VALID_EMAIL_2: 'test.user@domain.co.uk',
  VALID_EMAIL_3: 'john.doe+tag@example.org',
  INVALID_NO_AT: 'userexample.com',
  INVALID_NO_DOMAIN: 'user@',
  INVALID_NO_USER: '@example.com',
  INVALID_WITH_SPACES: 'user @example.com',
};

export const TEST_XSS_INPUTS = {
  SCRIPT_TAG: '<script>alert("XSS")</script>',
  INJECTION_ATTEMPT: '"><script>alert("XSS")</script>',
  SQL_INJECTION: "'; DROP TABLE users; --",
};

export const TEST_BCRYPT_ROUNDS = 10;
