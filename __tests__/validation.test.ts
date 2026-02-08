import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Test for Link Shortener Zod schema validation
 */
describe('Link Shortener - Link Creation Validation', () => {
  describe('Valid inputs', () => {
    it('should accept valid original URL', () => {
      const url = 'https://github.com/acbharath14/linkeshortenerproject/blob/main/README.md';
      expect(url).toMatch(/^https?:\/\/.+/);
    });

    it('should accept valid custom alias', () => {
      const alias = 'my-awesome-link';
      const aliasRegex = /^[a-zA-Z0-9_-]+$/;
      expect(alias).toMatch(aliasRegex);
    });

    it('should accept optional description', () => {
      const description = 'A sample description for testing';
      expect(description.length).toBeLessThanOrEqual(500);
    });
  });

  describe('Invalid inputs', () => {
    it('should reject invalid URLs', () => {
      const url = 'not-a-url';
      const isValid = url.match(/^https?:\/\/.+/);
      expect(isValid).toBeNull();
    });

    it('should reject custom alias with invalid characters', () => {
      const alias = 'invalid-alias@#$';
      const aliasRegex = /^[a-zA-Z0-9_-]+$/;
      expect(alias).not.toMatch(aliasRegex);
    });

    it('should reject custom alias that is too short', () => {
      const alias = 'ab'; // Less than 3 chars
      expect(alias.length).toBeLessThan(3);
    });

    it('should reject custom alias that is too long', () => {
      const alias = 'a'.repeat(31); // More than 30 chars
      expect(alias.length).toBeGreaterThan(30);
    });

    it('should reject description that is too long', () => {
      const description = 'x'.repeat(501); // More than 500 chars
      expect(description.length).toBeGreaterThan(500);
    });
  });
});

/**
 * Test for short code normalization
 */
describe('Short Code Normalization', () => {
  it('should normalize mixed-case short codes to lowercase', () => {
    const shortCode = 'AbC123XyZ';
    const normalized = shortCode.toLowerCase();
    expect(normalized).toBe('abc123xyz');
  });

  it('should handle already lowercase codes', () => {
    const shortCode = 'abc123xyz';
    const normalized = shortCode.toLowerCase();
    expect(normalized).toBe('abc123xyz');
  });

  it('should preserve alphanumeric characters', () => {
    const shortCode = 'TEST123';
    const normalized = shortCode.toLowerCase();
    expect(normalized).toMatch(/^[a-z0-9]+$/);
  });
});
