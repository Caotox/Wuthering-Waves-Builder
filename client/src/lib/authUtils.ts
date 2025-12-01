export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

/**
 * Valide qu'un mot de passe respecte les critères de sécurité
 * - Au moins 8 caractères
 * - Au moins une majuscule
 * - Au moins une minuscule
 * - Au moins un chiffre
 * - Au moins un caractère spécial
 */
export function isValidPassword(password: string): boolean {
  if (!password || password.length < 8) {
    return false;
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

/**
 * Valide qu'un email a un format correct
 */
export function isValidEmail(email: string): boolean {
  if (!email) {
    return false;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && !email.includes(' ');
}

/**
 * Échappe les caractères HTML dangereux pour prévenir XSS
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;');
}

/**
 * Sanitise une entrée utilisateur en retirant les balises HTML
 */
export function sanitizeInput(input: string): string {
  return input.replaceAll(/<[^>]+>/g, '');
}
