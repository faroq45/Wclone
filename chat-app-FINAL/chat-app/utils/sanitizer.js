/**
 * Utility functions for input sanitization and XSS prevention
 */

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} text - The text to sanitize
 * @returns {string} - Sanitized text safe for HTML rendering
 */
const escapeHtml = (text) => {
  if (typeof text !== "string") return text;
  
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char]);
};

/**
 * Sanitizes user input by trimming and escaping
 * @param {string} input - The input to sanitize
 * @returns {string} - Sanitized input
 */
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return escapeHtml(input.trim());
};

/**
 * Validates username format
 * @param {string} username - Username to validate
 * @returns {boolean} - True if valid
 */
const isValidUsername = (username) => {
  if (!username || typeof username !== "string") return false;
  // Allow alphanumeric, underscore, hyphen, 3-20 characters
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - {isValid: boolean, message: string}
 */
const isValidPassword = (password) => {
  if (!password || typeof password !== "string") {
    return { isValid: false, message: "Password is required" };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters" };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: "Password is too long" };
  }
  
  return { isValid: true, message: "Password is valid" };
};

module.exports = {
  escapeHtml,
  sanitizeInput,
  isValidUsername,
  isValidPassword,
};
