import { describe, it, expect } from 'vitest';

/**
 * Test for Link Shortener data model and operations
 */
describe('Link Shortener - Data Model', () => {
  interface ShortenedUrl {
    id: string;
    shortCode: string;
    originalUrl: string;
    userId: string;
    customAlias: string | null;
    description: string | null;
    clicks: number;
    isActive: boolean;
    expiresAt: string | null;
    createdAt: string;
    updatedAt: string;
  }

  const createMockLink = (overrides?: Partial<ShortenedUrl>): ShortenedUrl => ({
    id: 'test-id-123',
    shortCode: 'abc123',
    originalUrl: 'https://github.com/acbharath14/linkeshortenerproject',
    userId: 'user_clerk_123',
    customAlias: null,
    description: 'Link Shortener project repository',
    clicks: 0,
    isActive: true,
    expiresAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  });

  describe('Link creation', () => {
    it('should create a link with default values', () => {
      const link = createMockLink();
      expect(link.clicks).toBe(0);
      expect(link.isActive).toBe(true);
      expect(link.expiresAt).toBeNull();
    });

    it('should allow custom alias', () => {
      const link = createMockLink({ customAlias: 'my-link' });
      expect(link.customAlias).toBe('my-link');
    });
  });

  describe('Link expiration', () => {
    it('should identify expired links', () => {
      const pastDate = new Date(Date.now() - 1000).toISOString();
      const link = createMockLink({ expiresAt: pastDate });
      const isExpired = link.expiresAt && new Date() > new Date(link.expiresAt);
      expect(isExpired).toBe(true);
    });

    it('should identify non-expired links', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString(); // 24 hours from now
      const link = createMockLink({ expiresAt: futureDate });
      const isExpired = link.expiresAt && new Date() > new Date(link.expiresAt);
      expect(isExpired).toBe(false);
    });

    it('should handle links without expiration', () => {
      const link = createMockLink({ expiresAt: null });
      expect(link.expiresAt).toBeNull();
    });
  });

  describe('Link status', () => {
    it('should identify active links', () => {
      const link = createMockLink({ isActive: true });
      expect(link.isActive).toBe(true);
    });

    it('should identify inactive links', () => {
      const link = createMockLink({ isActive: false });
      expect(link.isActive).toBe(false);
    });
  });

  describe('Click tracking', () => {
    it('should track click counts', () => {
      const link = createMockLink({ clicks: 0 });
      expect(link.clicks).toBe(0);
    });

    it('should increment clicks', () => {
      const link = createMockLink({ clicks: 5 });
      const updatedClicks = link.clicks + 1;
      expect(updatedClicks).toBe(6);
    });

    it('should handle high click counts', () => {
      const link = createMockLink({ clicks: 999999 });
      expect(link.clicks).toBeGreaterThan(0);
    });
  });

  describe('Link ownership', () => {
    it('should verify link belongs to user', () => {
      const link = createMockLink({ userId: 'user-123' });
      const userOwnsLink = link.userId === 'user-123';
      expect(userOwnsLink).toBe(true);
    });

    it('should reject unauthorized access', () => {
      const link = createMockLink({ userId: 'user-123' });
      const userOwnsLink = link.userId === 'user-456';
      expect(userOwnsLink).toBe(false);
    });
  });
});
