// Simple in-memory rate limiter for link creation
// For production, consider using Upstash Redis for distributed rate limiting

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class InMemoryRateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowSeconds: number = 10) {
    this.maxRequests = maxRequests;
    this.windowMs = windowSeconds * 1000;
    
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  async limit(identifier: string): Promise<{ success: boolean; remaining: number }> {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired one
      this.store.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return { success: true, remaining: this.maxRequests - 1 };
    }

    if (entry.count >= this.maxRequests) {
      return { success: false, remaining: 0 };
    }

    // Increment count
    entry.count++;
    return { success: true, remaining: this.maxRequests - entry.count };
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// Export a singleton instance
export const rateLimiter = new InMemoryRateLimiter(10, 10);
