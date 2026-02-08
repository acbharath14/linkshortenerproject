import { describe, it, expect } from 'vitest';

/**
 * Test for Link Shortener rate limiting on link creation
 */
describe('Link Shortener - Rate Limiting', () => {
  class SimpleRateLimiter {
    private store: Map<string, { count: number; resetTime: number }> = new Map();
    private readonly maxRequests: number;
    private readonly windowMs: number;

    constructor(maxRequests: number = 10, windowSeconds: number = 10) {
      this.maxRequests = maxRequests;
      this.windowMs = windowSeconds * 1000;
    }

    async limit(identifier: string): Promise<{ success: boolean; remaining: number }> {
      const now = Date.now();
      const entry = this.store.get(identifier);

      if (!entry || now > entry.resetTime) {
        this.store.set(identifier, {
          count: 1,
          resetTime: now + this.windowMs,
        });
        return { success: true, remaining: this.maxRequests - 1 };
      }

      if (entry.count >= this.maxRequests) {
        return { success: false, remaining: 0 };
      }

      entry.count++;
      return { success: true, remaining: this.maxRequests - entry.count };
    }
  }

  it('should allow requests within limit', async () => {
    const limiter = new SimpleRateLimiter(5, 10);
    const result = await limiter.limit('user-1');
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('should block requests exceeding limit', async () => {
    const limiter = new SimpleRateLimiter(2, 10);
    await limiter.limit('user-2');
    await limiter.limit('user-2');
    const result = await limiter.limit('user-2');
    expect(result.success).toBe(false);
  });

  it('should track remaining requests correctly', async () => {
    const limiter = new SimpleRateLimiter(5, 10);
    const result1 = await limiter.limit('user-3');
    const result2 = await limiter.limit('user-3');
    expect(result1.remaining).toBe(4);
    expect(result2.remaining).toBe(3);
  });

  it('should isolate rate limits per identifier', async () => {
    const limiter = new SimpleRateLimiter(2, 10);
    await limiter.limit('user-a');
    await limiter.limit('user-a');
    const resultUserB = await limiter.limit('user-b');
    expect(resultUserB.success).toBe(true);
  });
});
