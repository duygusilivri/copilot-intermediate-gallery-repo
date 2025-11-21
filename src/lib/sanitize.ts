/**
 * Input Sanitization and XSS Prevention Utilities
 * 
 * This module provides comprehensive input sanitization functions to prevent
 * Cross-Site Scripting (XSS) attacks and ensure data integrity in the
 * Photo Gallery & Portfolio application.
 */

import DOMPurify from 'dompurify';
import { z } from 'zod';

// Configure DOMPurify with strict settings for security
const createPurifyConfig = () => {
  if (typeof window !== 'undefined') {
    return DOMPurify(window);
  }
  // For server-side rendering, we'll use a more restrictive approach
  return null;
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Removes dangerous tags, attributes, and scripts while preserving safe formatting
 */
export function sanitizeHtml(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  const purify = createPurifyConfig();
  
  if (purify) {
    // Client-side sanitization with DOMPurify
    return purify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span', 'p', 'br'],
      ALLOWED_ATTR: ['class'],
      KEEP_CONTENT: true,
      ALLOW_DATA_ATTR: false,
    });
  }
  
  // Server-side fallback: strip all HTML tags
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Sanitizes plain text input by removing/escaping dangerous characters
 * Used for titles, descriptions, and other text fields
 */
export function sanitizeText(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    // Remove null bytes and other control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Escape HTML entities
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    // Limit length to prevent DoS attacks
    .substring(0, 500);
}

/**
 * Sanitizes search queries and filter inputs
 * More permissive than general text but still secure
 */
export function sanitizeSearchQuery(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    // Remove dangerous characters but allow spaces, alphanumeric, and common punctuation
    .replace(/[<>\"'&\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Limit length
    .substring(0, 100);
}

/**
 * Sanitizes file names to prevent path traversal and other attacks
 */
export function sanitizeFileName(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    // Remove path traversal attempts
    .replace(/\.\./g, '')
    .replace(/[\/\\]/g, '')
    // Remove dangerous characters
    .replace(/[<>:"|?*\x00-\x1F]/g, '')
    // Replace spaces with underscores
    .replace(/\s+/g, '_')
    // Limit length
    .substring(0, 255);
}

/**
 * Sanitizes tag inputs (comma-separated tags)
 */
export function sanitizeTags(input: string | null | undefined): string[] {
  if (!input || typeof input !== 'string') {
    return [];
  }

  return input
    .split(',')
    .map(tag => sanitizeText(tag))
    .filter(tag => tag.length > 0 && tag.length <= 50)
    .slice(0, 20); // Limit number of tags
}

/**
 * Sanitizes URL inputs to prevent malicious redirects
 */
export function sanitizeUrl(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Only allow http, https, and relative URLs
  const urlPattern = /^(https?:\/\/|\/)/;
  const sanitized = input.trim();

  if (!urlPattern.test(sanitized)) {
    return '';
  }

  // Remove dangerous characters
  return sanitized.replace(/[<>"'`]/g, '');
}

/**
 * Validation schemas using Zod for type-safe input validation
 */
export const ValidationSchemas = {
  photoTitle: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .transform(sanitizeText),

  photoDescription: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .transform(value => value ? sanitizeText(value) : ''),

  searchQuery: z.string()
    .max(100, 'Search query too long')
    .optional()
    .transform(value => value ? sanitizeSearchQuery(value) : ''),

  tags: z.string()
    .optional()
    .transform(value => value ? sanitizeTags(value) : []),

  fileName: z.string()
    .min(1, 'File name is required')
    .max(255, 'File name too long')
    .transform(sanitizeFileName),

  galleryName: z.string()
    .min(1, 'Gallery name is required')
    .max(100, 'Gallery name must be less than 100 characters')
    .transform(sanitizeText),

  photographerName: z.string()
    .min(1, 'Photographer name is required')
    .max(100, 'Photographer name must be less than 100 characters')
    .transform(sanitizeText),

  copyrightNotice: z.string()
    .max(200, 'Copyright notice must be less than 200 characters')
    .optional()
    .transform(value => value ? sanitizeText(value) : ''),
};

/**
 * Content Security Policy configuration for Next.js
 */
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-eval'", // Required for Next.js development
    "'unsafe-inline'", // Consider removing in production
    'https://vercel.live',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for Tailwind CSS
    'https://fonts.googleapis.com',
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
    'data:',
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https:',
  ],
  'media-src': ["'self'", 'blob:', 'data:'],
  'object-src': ["'none'"],
  'frame-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
};

/**
 * Builds CSP header string from directives
 */
export function buildCSPHeader(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
}

/**
 * Rate limiting helper for preventing abuse
 */
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  isAllowed(identifier: string, maxAttempts: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier);

    if (!userAttempts || now > userAttempts.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (userAttempts.count >= maxAttempts) {
      return false;
    }

    userAttempts.count++;
    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Export a default rate limiter instance
export const defaultRateLimiter = new RateLimiter();

/**
 * Validates and sanitizes file upload data
 */
export function validateFileUpload(file: File): {
  isValid: boolean;
  sanitizedName: string;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    errors.push('File size exceeds 10MB limit');
  }

  // Check file type
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed');
  }

  // Sanitize file name
  const sanitizedName = sanitizeFileName(file.name);
  
  if (!sanitizedName) {
    errors.push('Invalid file name');
  }

  return {
    isValid: errors.length === 0,
    sanitizedName,
    errors,
  };
}