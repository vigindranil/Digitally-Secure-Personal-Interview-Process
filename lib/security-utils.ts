// lib/security-utils.ts

import DOMPurify from 'dompurify';
import Cookies from 'js-cookie';

/**
 * Sanitize string input to prevent XSS attacks
 * @param str - String to sanitize
 * @returns Sanitized string
 */
export const sanitizeString = (str: string): string => {
  if (typeof str !== 'string') return '';
  
  // Use DOMPurify to remove any malicious content
  return DOMPurify.sanitize(str, { 
    ALLOWED_TAGS: [],  // No HTML tags allowed
    ALLOWED_ATTR: []   // No attributes allowed
  });
};

/**
 * Sanitize HTML content while allowing specific safe tags
 * @param html - HTML string to sanitize
 * @param allowedTags - Array of allowed HTML tags
 * @returns Sanitized HTML string
 */
export const sanitizeHTML = (
  html: string, 
  allowedTags: string[] = ['b', 'i', 'em', 'strong', 'p', 'br']
): string => {
  if (typeof html !== 'string') return '';
  
  return DOMPurify.sanitize(html, { 
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: []
  });
};

/**
 * Safely parse and validate numeric ID
 * @param value - Value to parse
 * @returns Parsed number or null if invalid
 */
export const parseSecureId = (value: string | number): number | null => {
  const parsed = typeof value === 'string' ? parseInt(value, 10) : value;
  
  if (isNaN(parsed) || parsed <= 0 || !isFinite(parsed)) {
    return null;
  }
  
  return parsed;
};

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns True if valid email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (basic validation)
 * @param phone - Phone number to validate
 * @returns True if valid format
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

/**
 * Set secure cookie with proper flags
 * @param key - Cookie key
 * @param value - Cookie value
 * @param options - Additional cookie options
 */
export const setSecureCookie = (
  key: string, 
  value: string, 
  options: Cookies.CookieAttributes = {}
) => {
  const defaultOptions: Cookies.CookieAttributes = {
    path: '/',
    // secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    secure: true, // HTTPS only
    sameSite: 'strict', // CSRF protection
    expires: 1, // 1 day default expiry
  };

  Cookies.set(key, value, { ...defaultOptions, ...options });
};

/**
 * Get cookie value safely
 * @param key - Cookie key
 * @returns Cookie value or null
 */
export const getSecureCookie = (key: string): string | null => {
  return Cookies.get(key) || null;
};

/**
 * Remove cookie
 * @param key - Cookie key
 */
export const removeSecureCookie = (key: string) => {
  Cookies.remove(key, { path: '/' });
};

/**
 * Safe error logger - logs to console always
 * @param message - Error message
 * @param error - Error object (optional)
 */
export const safeLog = (message: string, error?: any) => {
  console.error(message, error);
  
  // Send to error tracking service if available
  // Example: Sentry, LogRocket, DataDog, etc.
  // if (typeof window !== 'undefined' && window.Sentry) {
  //   window.Sentry.captureException(error, { extra: { message } });
  // }
};

/**
 * Debounce function to prevent rapid successive calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function to limit execution frequency
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Generate a random CSRF token
 * @returns Random token string
 */
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate URL format
 * @param url - URL to validate
 * @returns True if valid URL
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize object by removing sensitive keys
 * @param obj - Object to sanitize
 * @param sensitiveKeys - Array of keys to remove
 * @returns Sanitized object
 */
export const sanitizeObject = <T extends Record<string, any>>(
  obj: T,
  sensitiveKeys: string[] = ['password', 'token', 'secret', 'apiKey']
): Partial<T> => {
  const sanitized = { ...obj };
  
  sensitiveKeys.forEach(key => {
    if (key in sanitized) {
      delete sanitized[key];
    }
  });
  
  return sanitized;
};

/**
 * Rate limiter for client-side operations
 * @param key - Unique key for the operation
 * @param limit - Maximum number of operations allowed
 * @param windowMs - Time window in milliseconds
 * @returns True if operation is allowed
 */
export const checkRateLimit = (
  key: string,
  limit: number = 10,
  windowMs: number = 60000
): boolean => {
  if (typeof window === 'undefined') return true;
  
  const now = Date.now();
  const storageKey = `rateLimit_${key}`;
  const stored = sessionStorage.getItem(storageKey);
  
  let attempts: number[] = stored ? JSON.parse(stored) : [];
  
  // Remove old attempts outside the window
  attempts = attempts.filter(timestamp => now - timestamp < windowMs);
  
  if (attempts.length >= limit) {
    return false; // Rate limit exceeded
  }
  
  // Add current attempt
  attempts.push(now);
  sessionStorage.setItem(storageKey, JSON.stringify(attempts));
  
  return true;
};

/**
 * Escape special characters in string for use in RegExp
 * @param str - String to escape
 * @returns Escaped string
 */
export const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Deep clone an object safely
 * @param obj - Object to clone
 * @returns Cloned object
 */
export const safeClone = <T>(obj: T): T => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    safeLog('Error cloning object:', error);
    return obj;
  }
};

/**
 * Validate and sanitize file upload
 * @param file - File object
 * @param allowedTypes - Array of allowed MIME types
 * @param maxSizeMB - Maximum file size in MB
 * @returns Validation result
 */
export const validateFile = (
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'application/pdf'],
  maxSizeMB: number = 5
): { valid: boolean; error?: string } => {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` 
    };
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { 
      valid: false, 
      error: `File size exceeds ${maxSizeMB}MB limit` 
    };
  }
  
  return { valid: true };
};