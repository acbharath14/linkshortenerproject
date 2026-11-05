import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { rateLimiter } from '@/lib/rate-limit';

/**
 * Real integration tests for rate limiter
 * Tests the ACTUAL rateLimiter instance from lib/rate-limit.ts
 *
 * Deduplicated 2026-11-04: the enforcement/response-structure/scenario
 * tests were folded into the parameterized tests below. The six vacuous
 * tests (defined / limit method / promise / resolve / no-throw / typed
 * result) were deliberately left untouched. Every merged assertion survives.
 */

describe('Rate Limiter - Real Implementation', () => {
  // Test with the actual rateLimiter instance
  // This will use in-memory limiter if Upstash env vars are not set

  beforeEach(() => {
    // Clear any previous state
    vi.clearAllMocks();
  });

  describe('Basic Rate Limiting', () => {
    it('rateLimiter should be defined', () => {
      expect(rateLimiter).toBeDefined();
    });

    it('should have a limit method', () => {
      expect(typeof rateLimiter.limit).toBe('function');
    });

    it('should allow requests within the limit with a well-formed, decrementing response', async () => {
      const clientId = `test-within-limit-${Date.now()}`;

      const first = await rateLimiter.limit(clientId);
      expect(first.success).toBe(true);
      expect(first).toHaveProperty('success');
      expect(first).toHaveProperty('remaining');
      expect(typeof first.success).toBe('boolean');
      expect(typeof first.remaining).toBe('number');
      expect(first.remaining).toBeGreaterThanOrEqual(0);

      const second = await rateLimiter.limit(clientId);
      expect(second.success).toBe(true);
      expect(second.remaining).toBeLessThan(first.remaining);
      expect(second.remaining).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Rate Limit Enforcement', () => {
    it('should enforce the limit: success=false, remaining=0 and resetTime present', async () => {
      const clientId = `test-client-exceeded-${Date.now()}`;

      // Drive this client past the limit
      let lastResult = await rateLimiter.limit(clientId);
      for (let i = 0; i < 50 && lastResult.success; i++) {
        lastResult = await rateLimiter.limit(clientId);
      }

      expect(lastResult.success).toBe(false);
      expect(lastResult.remaining).toBe(0);
      expect(lastResult.resetTime).toBeDefined();
      expect(lastResult.resetTime).toBeGreaterThan(Date.now());

      // Real-world: rapid spam burst against one client
      const spamClient = `spam-client-${Date.now()}`;
      const results = [];
      for (let i = 0; i < 20; i++) {
        results.push(await rateLimiter.limit(spamClient));
      }

      // Some should succeed, some should fail
      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      // At least some should be successful (before hitting limit)
      expect(successful).toBeGreaterThan(0);

      // At least some should be rate limited
      expect(failed).toBeGreaterThan(0);
    }, { timeout: 2000 });
  });

  describe('Different Clients', () => {
    it('should track different clients separately', async () => {
      const clientA = `client-a-${Date.now()}`;
      const clientB = `client-b-${Date.now()}`;

      // Make requests for client A
      const resultA1 = await rateLimiter.limit(clientA);
      const resultA2 = await rateLimiter.limit(clientA);

      // Make requests for client B
      const resultB1 = await rateLimiter.limit(clientB);
      const resultB2 = await rateLimiter.limit(clientB);

      // Client A should have fewer remaining than before
      expect(resultA2.remaining).toBeLessThan(resultA1.remaining);

      // Client B should have fewer remaining than before
      expect(resultB2.remaining).toBeLessThan(resultB1.remaining);

      // Both should have >= 0 remaining (within limit)
      expect(resultA2.remaining).toBeGreaterThanOrEqual(0);
      expect(resultB2.remaining).toBeGreaterThanOrEqual(0);

      // Separate clients do not interfere with each other
      // (was: "should reset for different time windows")
      const anotherClient = `another-${Date.now()}`;
      const result2 = await rateLimiter.limit(anotherClient);
      expect(result2.success).toBe(true);
    });
  });

  describe('Type Safety', () => {
    it('should return typed result object', async () => {
      const clientId = `test-types-${Date.now()}`;
      const result = await rateLimiter.limit(clientId);
      
      // Should have correct types
      expect(typeof result.success).toBe('boolean');
      expect(typeof result.remaining).toBe('number');
      
      // Optional fields
      if ('resetTime' in result && result.resetTime) {
        expect(typeof result.resetTime).toBe('number');
      }
    });
  });

  describe('Edge Cases', () => {
    it.each([
      ['empty client ID', ''],
      ['very long client ID', 'x'.repeat(1000)],
      ['special characters in client ID', 'client-!@#$%^&*()_+-=[]{}|;:,.<>?']
    ])('should handle %s', async (_label, clientId) => {
      const result = await rateLimiter.limit(clientId);
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('remaining');
    });

    it('should handle rapid sequential requests', async () => {
      const clientId = `rapid-${Date.now()}`;

      // Fire multiple requests quickly
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(rateLimiter.limit(clientId));
      }

      const results = await Promise.all(promises);

      // Should have mix of success and rate limited
      expect(results.length).toBe(10);
      expect(results.some((r) => r.success)).toBe(true);
    }, { timeout: 2000 });
  });

  describe('Async Behavior', () => {
    it('should return a promise', () => {
      const result = rateLimiter.limit('test-promise');
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve successfully', async () => {
      const result = await rateLimiter.limit(`test-resolve-${Date.now()}`);
      expect(result).toBeDefined();
      expect(result.success !== undefined).toBe(true);
    });

    it('should not throw on normal usage', async () => {
      const clientId = `test-no-throw-${Date.now()}`;
      
      await expect(rateLimiter.limit(clientId)).resolves.toBeDefined();
    });
  });
});
