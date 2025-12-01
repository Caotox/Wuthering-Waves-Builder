/**
 * Logger utility for server-side logging
 * Automatically handles production vs development environments
 */

const isProduction = process.env.NODE_ENV === 'production';

export const logger = {
  /**
   * Log an error message (only in development)
   */
  error: (message: string, error?: unknown) => {
    if (!isProduction) {
      if (error) {
        console.error(message, error);
      } else {
        console.error(message);
      }
    }
  },

  /**
   * Log an info message
   */
  info: (message: string) => {
    console.log(message);
  },

  /**
   * Log a warning message (only in development)
   */
  warn: (message: string) => {
    if (!isProduction) {
      console.warn(message);
    }
  },

  /**
   * Log a debug message (only in development)
   */
  debug: (message: string, data?: unknown) => {
    if (!isProduction) {
      if (data) {
        console.debug(message, data);
      } else {
        console.debug(message);
      }
    }
  },
};
