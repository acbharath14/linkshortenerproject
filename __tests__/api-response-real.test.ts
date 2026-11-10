import { describe, it, expect } from 'vitest';
import {
  apiSuccess,
  apiError,
  apiBadRequest,
  apiUnauthorized,
  apiForbidden,
  apiNotFound,
  apiConflict,
  apiTooManyRequests,
  apiInternalError
} from '@/lib/api-response';
import { NextResponse } from 'next/server';

/**
 * Real integration tests for API response utilities
 * Tests the ACTUAL functions from lib/api-response.ts
 *
 * Deduplicated 2026-11-04: the per-helper status/message tests, the
 * Real-world Scenarios and the duplicate content-type tests were folded
 * into the parameterized tests below. Every original assertion survives.
 */

type ErrorHelper = (message?: string, code?: string) => NextResponse;

const errorHelperCases: Array<[string, ErrorHelper, number, string, string | null]> = [
  ['apiBadRequest', apiBadRequest, 400, 'Bad request', 'Invalid URL format'],
  ['apiUnauthorized', apiUnauthorized, 401, 'Unauthorized', 'User not authenticated'],
  ['apiForbidden', apiForbidden, 403, 'Forbidden', 'Access denied'],
  ['apiNotFound', apiNotFound, 404, 'Not found', 'Link not found'],
  ['apiConflict', apiConflict, 409, 'Conflict', 'Alias already exists'],
  ['apiTooManyRequests', apiTooManyRequests, 429, 'Too many requests', 'Rate limit exceeded'],
  ['apiInternalError', apiInternalError, 500, 'Internal server error', null]
];

describe('API Response Utilities - Real Implementation', () => {
  describe('apiSuccess()', () => {
    it('creates {success:true, data} JSON responses: default 200, custom status honored', async () => {
      const data = { id: 'link-001', shortCode: 'abc123' };
      const response = apiSuccess(data);

      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toBe('application/json');

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toEqual(data);
      expect(body.error).toBeUndefined();

      // Custom status code honored
      const created = apiSuccess({ id: 'link-001' }, 201);
      expect(created.status).toBe(201);

      // Real-world: creating a link successfully
      const linkData = {
        id: 'link-001',
        shortCode: 'abc123',
        originalUrl: 'https://github.com/acbharath14/linkshortenerproject',
        shortUrl: 'http://localhost:3000/l/abc123'
      };
      const createdLink = apiSuccess(linkData, 201);
      const createdBody = await createdLink.json();
      expect(createdLink.status).toBe(201);
      expect(createdBody.data.shortCode).toBe('abc123');
    });
  });

  describe('apiError()', () => {
    it('creates {success:false, error} responses: status passthrough, optional code', async () => {
      // Status passthrough
      const custom = apiError('Custom message', 418);
      expect(custom.status).toBe(418);
      const customBody = await custom.json();
      expect(customBody.success).toBe(false);
      expect(customBody.error).toBe('Custom message');
      expect(customBody.data).toBeUndefined();

      // Default status is 500
      const def = apiError('Something broke');
      expect(def.status).toBe(500);

      // Error code included when provided
      const coded = apiBadRequest('Invalid URL', 'INVALID_URL');
      const codedBody = await coded.json();
      expect(codedBody.code).toBe('INVALID_URL');

      // Error code omitted when absent
      const uncoded = apiBadRequest('Invalid URL');
      const uncodedBody = await uncoded.json();
      expect(uncodedBody.code).toBeUndefined();

      // Real-world: authorization failure
      const unauthorized = apiUnauthorized('No authentication token provided');
      const unauthorizedBody = await unauthorized.json();
      expect(unauthorized.status).toBe(401);
      expect(unauthorizedBody.success).toBe(false);

      // Real-world: duplicate alias conflict
      const conflict = apiConflict('Custom alias already in use');
      const conflictBody = await conflict.json();
      expect(conflict.status).toBe(409);
      expect(conflictBody.error).toContain('already in use');

      // Real-world: rate limiting
      const rateLimited = apiTooManyRequests('Too many requests. Please try again later.');
      const rateLimitedBody = await rateLimited.json();
      expect(rateLimited.status).toBe(429);
      expect(rateLimitedBody.error).toContain('Too many');
    });
  });

  describe('Error helpers', () => {
    it.each(errorHelperCases)(
      '%s returns %i with its default message and passes custom messages through',
      async (_name, helper, status, defaultMessage, customMessage) => {
        const response = helper();
        expect(response.status).toBe(status);
        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.error).toBe(defaultMessage);
        expect(body.data).toBeUndefined();

        if (customMessage) {
          const custom = helper(customMessage);
          expect(custom.status).toBe(status);
          const customBody = await custom.json();
          expect(customBody.success).toBe(false);
          expect(customBody.error).toBe(customMessage);
        } else {
          // apiInternalError default must not leak sensitive details
          expect(body.error).not.toContain('password');
          expect(body.error).not.toContain('database');
        }
      }
    );
  });

  describe('Response Structure Consistency', () => {
    it('success responses carry data (never error); error responses carry error (never data)', async () => {
      const successBody = await apiSuccess({ test: 'data' }).json();
      expect(successBody.success).toBe(true);
      expect(successBody.data).toBeDefined();
      expect(successBody.error).toBeUndefined();

      const errorResponses = [
        apiBadRequest(),
        apiUnauthorized(),
        apiForbidden(),
        apiNotFound(),
        apiConflict(),
        apiTooManyRequests(),
        apiInternalError()
      ];

      for (const response of errorResponses) {
        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.error).toBeDefined();
        expect(body.data).toBeUndefined();
      }
    });
  });

  describe('Content-Type Headers', () => {
    it('all responses use application/json content type', () => {
      const responses = [
        apiSuccess({ test: 'data' }),
        apiBadRequest(),
        apiUnauthorized(),
        apiForbidden(),
        apiNotFound(),
        apiConflict(),
        apiTooManyRequests(),
        apiInternalError()
      ];

      for (const response of responses) {
        expect(response.headers.get('content-type')).toBe('application/json');
      }
    });
  });
});
