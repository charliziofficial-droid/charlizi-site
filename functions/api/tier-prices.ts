// functions/api/tier-prices.ts
// Cloudflare Pages Function - tier unit price release endpoint.
//
// Why this endpoint exists:
//   Product detail HTML is public and crawlable. Once tier unit prices are written
//   into that HTML (even hidden by CSS, even in data-* attributes), anyone can read
//   them from view-source. So prices never appear in HTML at all; this endpoint
//   returns them on demand.
//
// Anti-scrape posture (pragmatic, no login system yet):
//   1. Requires a registered email (front end stores it in localStorage after a
//      successful inquiry submission).
//   2. Per-IP hourly rate limit via optional KV binding.
//   3. Returns the whole table, not single rows - unlocking the whole site after one
//      registration is a product decision, not a leak.
//   Real hard protection needs an account system; at this stage inquiry conversion
//   matters more than price secrecy.
//
// Price data location:
//   Generated at build time by scripts/gen_tier_prices_json.js into data/tier-prices.json
//   (repo root `data/`, NOT `public/` - anything under public/ is served as a static
//   asset and would be downloadable by anyone). The bundler inlines the JSON into
//   this function's bundle, so it is never reachable as a URL.
//
// Optional env:
//   TIER_PRICE_RATE_LIMIT  KV namespace binding. Rate limiting is skipped when unbound.

import PRICE_TABLE from '../../data/tier-prices.json';

interface Env {
  TIER_PRICE_RATE_LIMIT?: KVNamespace;
}

const ALLOWED_ORIGINS = ['https://charlizi.com', 'https://www.charlizi.com'];

function corsHeaders(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const onRequestOptions: PagesFunction<Env> = async ({ request }) => {
  return new Response(null, { headers: corsHeaders(request.headers.get('Origin')) });
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get('Origin');
  const cors = corsHeaders(origin);
  const url = new URL(request.url);

  // --- 1. Require a registered email ---
  const email = (url.searchParams.get('email') || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: 'registration_required' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors },
    });
  }

  // --- 2. Rate limit ---
  const kv = env.TIER_PRICE_RATE_LIMIT;
  if (kv) {
    try {
      const ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
      const key = `tpl:${await sha256Hex(ip)}`;
      const count = Number((await kv.get(key)) || 0);
      if (count >= 120) {
        return new Response(JSON.stringify({ ok: false, error: 'rate_limited' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors, 'Retry-After': '3600' },
        });
      }
      await kv.put(key, String(count + 1), { expirationTtl: 3600 });
    } catch {
      /* KV failure fails open - never block a genuine buyer from seeing prices */
    }
  }

  // --- 3. Return the price table (bundled, not a public asset) ---
  // Optional single-style narrowing keeps the common case small: ?sku=M004
  const sku = (url.searchParams.get('sku') || '').trim().toUpperCase();
  if (sku) {
    const rec = (PRICE_TABLE as Record<string, unknown>)[sku];
    if (!rec) {
      return new Response(JSON.stringify({ ok: false, error: 'not_found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors },
      });
    }
    return new Response(JSON.stringify({ ok: true, table: { [sku]: rec } }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'private, max-age=600',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
        ...cors,
      },
    });
  }

  return new Response(JSON.stringify({ ok: true, table: PRICE_TABLE }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'private, max-age=600',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      ...cors,
    },
  });
};
