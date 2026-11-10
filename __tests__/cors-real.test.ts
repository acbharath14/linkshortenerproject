import { describe, it, expect } from 'vitest';
import { withCorsHeaders, handleCorsPreFlight } from '@/lib/cors';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Real integration tests for CORS utilities
 * Tests the ACTUAL functions from lib/cors.ts
 *
 * Deduplicated 2026-11-04: the per-origin tests, Real-world API Scenarios,
 * Origins Validation and the Content-Type preservation test were folded
 * into the parameterized tests below. Every original assertion survives.
 */

const allowedOriginRows: Array<[string, string, string]> = [
  ['http://localhost:3000', 'GET', 'http://localhost:3000/api/test'],
  ['http://localhost:3001', 'GET', 'http://localhost:3000/api/test'],
  ['http://localhost:3000', 'POST', 'http://localhost:3000/api/shorten'],
  ['http://localhost:3000', 'GET', 'http://localhost:3000/api/shorten/abc123'],
  ['http://localhost:3000', 'DELETE', 'http://localhost:3000/api/shorten/manage/123']
];
if (process.env.NEXT_PUBLIC_APP_URL) {
  allowedOriginRows.push([process.env.NEXT_PUBLIC_APP_URL, 'GET', 'http://localhost:3000/api/test']);
}

describe('CORS Utilities - Real Implementation', () => {
  describe('withCorsHeaders()', () => {
    it.each(allowedOriginRows)(
      'echoes allowed origin %s in Access-Control-Allow-Origin for %s %s',
      (origin, method, url) => {
        const request = new NextRequest(new URL(url), {
          method,
          headers: { origin }
        });
        const response = new NextResponse('test');

        const corsResponse = withCorsHeaders(request, response);
        const allowOrigin = corsResponse.headers.get('Access-Control-Allow-Origin');

        expect(allowOrigin).toBe(origin);
      }
    );

    it('handles requests from disallowed origins', () => {
      const request = new NextRequest(new URL('http://localhost:3000/api/test'), {
        headers: { origin: 'http://malicious-site.com' }
      });
      const response = new NextResponse('test');

      const corsResponse = withCorsHeaders(request, response);

      // Should still have header (implementation-dependent on whether to allow or deny)
      expect(corsResponse.headers.has('Access-Control-Allow-Origin')).toBe(true);
    });

    it('handles requests without an origin header', () => {
      const request = new NextRequest(new URL('http://localhost:3000/api/test'));
      const response = new NextResponse('test');

      const corsResponse = withCorsHeaders(request, response);

      expect(corsResponse.headers.has('Access-Control-Allow-Origin')).toBe(true);
    });

    it('always sets Allow-Methods, Allow-Headers and Max-Age', () => {
      const request = new NextRequest(new URL('http://localhost:3000/api/test'));
      const response = new NextResponse('test');

      const corsResponse = withCorsHeaders(request, response);

      expect(corsResponse.headers.has('Access-Control-Allow-Origin')).toBe(true);
      expect(corsResponse.headers.has('Access-Control-Allow-Methods')).toBe(true);

      const methods = corsResponse.headers.get('Access-Control-Allow-Methods');
      expect(methods).toContain('GET');
      expect(methods).toContain('POST');
      expect(methods).toContain('PUT');
      expect(methods).toContain('DELETE');
      expect(methods).toContain('PATCH');
      expect(methods).toContain('OPTIONS');

      const headers = corsResponse.headers.get('Access-Control-Allow-Headers');
      expect(headers).toBeDefined();
      expect(headers?.toLowerCase()).toContain('content-type');

      const maxAge = corsResponse.headers.get('Access-Control-Max-Age');
      expect(maxAge).toBeDefined();
      // Should be a reasonable cache time (24 hours = 86400 seconds)
      const maxAgeNum = parseInt(maxAge || '0');
      expect(maxAgeNum).toBeGreaterThan(0);
    });

    it('preserves response body and status code, returning a NextResponse', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/api/test'));
      const testData = JSON.stringify({ id: '123', name: 'Test Link' });
      const response = new NextResponse(testData);

      const corsResponse = withCorsHeaders(request, response);
      expect(corsResponse).toBeInstanceOf(NextResponse);
      const body = await corsResponse.text();
      expect(body).toBe(testData);

      const created = new NextResponse('test', { status: 201 });
      const createdCors = withCorsHeaders(request, created);
      expect(createdCors.status).toBe(201);
    });
  });

  describe('handleCorsPreFlight()', () => {
    it('handles OPTIONS preflight with 204, empty body and CORS headers', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/api/test'), {
        method: 'OPTIONS',
        headers: { origin: 'http://localhost:3000' }
      });

      const response = handleCorsPreFlight(request);

      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(204);

      expect(response.headers.has('Access-Control-Allow-Origin')).toBe(true);
      expect(response.headers.has('Access-Control-Allow-Methods')).toBe(true);
      expect(response.headers.has('Access-Control-Allow-Headers')).toBe(true);

      const methods = response.headers.get('Access-Control-Allow-Methods');
      expect(methods).toContain('GET');
      expect(methods).toContain('POST');
      expect(methods).toContain('PUT');
      expect(methods).toContain('DELETE');
      expect(methods).toContain('PATCH');

      const body = await response.text();
      expect(body).toBe('');

      // Origin from the request is respected
      const otherOrigin = 'http://localhost:3001';
      const otherRequest = new NextRequest(new URL('http://localhost:3000/api/test'), {
        method: 'OPTIONS',
        headers: { origin: otherOrigin }
      });
      const otherResponse = handleCorsPreFlight(otherRequest);
      expect(otherResponse.headers.get('Access-Control-Allow-Origin')).toBe(otherOrigin);

      // Real-world: preflight for complex requests
      const complexRequest = new NextRequest(new URL('http://localhost:3000/api/shorten'), {
        method: 'OPTIONS',
        headers: {
          origin: 'http://localhost:3000',
          'access-control-request-method': 'POST',
          'access-control-request-headers': 'content-type, authorization'
        }
      });
      const complexResponse = handleCorsPreFlight(complexRequest);
      expect(complexResponse.status).toBe(204);
      expect(complexResponse.headers.has('Access-Control-Allow-Headers')).toBe(true);
    });
  });

  describe('Header Preservation', () => {
    it('preserves existing response headers, including Content-Type', () => {
      const request = new NextRequest(new URL('http://localhost:3000/api/test'));
      const response = new NextResponse(JSON.stringify({ test: 'data' }), {
        headers: { 'Content-Type': 'application/json' }
      });
      response.headers.set('X-Custom-Header', 'custom-value');

      const corsResponse = withCorsHeaders(request, response);

      expect(corsResponse.headers.get('X-Custom-Header')).toBe('custom-value');
      expect(corsResponse.headers.get('Content-Type')).toContain('application/json');
      expect(corsResponse.headers.has('Access-Control-Allow-Origin')).toBe(true);
    });
  });
});
