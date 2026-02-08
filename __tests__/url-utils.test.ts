import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * Test for Link Shortener URL validation and generation logic
 */
describe('Link Shortener - URL Utilities', () => {
  describe('Valid URLs for shortening', () => {
    it('should validate HTTP URLs', () => {
      const url = 'http://github.com/acbharath14/linkeshortenerproject';
      const isValid = url.startsWith('http://') || url.startsWith('https://');
      expect(isValid).toBe(true);
    });

    it('should validate HTTPS URLs', () => {
      const url = 'https://www.linkedin.com/in/bharath-acb/';
      const isValid = url.startsWith('http://') || url.startsWith('https://');
      expect(isValid).toBe(true);
    });
  });

  describe('Invalid URLs', () => {
    it('should reject FTP URLs', () => {
      const url = 'ftp://example.com';
      const isValid = url.startsWith('http://') || url.startsWith('https://');
      expect(isValid).toBe(false);
    });

    it('should reject URLs without protocol', () => {
      const url = 'example.com';
      const isValid = url.startsWith('http://') || url.startsWith('https://');
      expect(isValid).toBe(false);
    });
  });

  describe('Short code generation', () => {
    const generateShortCode = (length: number = 8): string => {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    it('should generate short codes of correct length', () => {
      const code = generateShortCode(8);
      expect(code).toHaveLength(8);
    });

    it('should generate unique short codes', () => {
      const codes = new Set();
      for (let i = 0; i < 100; i++) {
        codes.add(generateShortCode());
      }
      expect(codes.size).toBe(100); // All should be unique
    });

    it('should only contain valid characters', () => {
      const code = generateShortCode(8);
      const validChars = /^[a-zA-Z0-9]+$/;
      expect(code).toMatch(validChars);
    });
  });
});
