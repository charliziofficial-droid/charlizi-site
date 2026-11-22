// Functional test of the tier-price gate: simulate the Pages Function handler
// with a stubbed environment and confirm the allow/deny behaviour.
const fs = require('fs');
const path = require('path');

async function main() {
  // Bundle the real handler.
  const { execSync } = require('child_process');
  execSync(
    'npx --yes esbuild@0.24.0 functions/api/tier-prices.ts --bundle --format=esm --platform=neutral --outfile=tmp/_gate.mjs',
    { stdio: 'pipe' }
  );

  const { pathToFileURL } = require('url');
  const mod = await import(pathToFileURL(path.resolve('tmp/_gate.mjs')).href + '?t=' + Date.now());
  const { onRequestGet } = mod;

  const call = async (qs, headers = {}) => {
    const req = new Request('https://charlizi.com/api/tier-prices' + qs, { headers });
    const res = await onRequestGet({ request: req, env: {} });
    let body = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    return { status: res.status, headers: res.headers, body };
  };

  const results = [];
  const check = (label, actual, expected) => {
    const pass = actual === expected;
    results.push(pass);
    console.log((pass ? 'PASS  ' : 'FAIL  ') + label.padEnd(52) + 'got ' + actual + ', want ' + expected);
  };

  // 1. No email -> must refuse
  let r = await call('');
  check('no email -> 403 registration_required', r.status, 403);
  check('  error code', r.body && r.body.error, 'registration_required');

  // 2. Malformed email -> refuse
  r = await call('?email=notanemail');
  check('bad email -> 403', r.status, 403);

  // 3. Email with no TLD -> refuse
  r = await call('?email=a@b');
  check('email without TLD -> 403', r.status, 403);

  // 4. Valid email -> full table
  r = await call('?email=buyer%40example.com');
  check('valid email -> 200', r.status, 200);
  const styles = r.body && r.body.table ? Object.keys(r.body.table).length : 0;
  check('  returns all 145 styles', styles, 145);
  check('  M004 has step tiers', !!(r.body.table.M004 && r.body.table.M004.tiers.length), true);
  check('  cache is private', r.headers.get('Cache-Control'), 'private, max-age=600');
  check('  noindex header', /noindex/.test(r.headers.get('X-Robots-Tag') || ''), true);

  // 5. ?sku= narrows
  r = await call('?email=buyer%40example.com&sku=m004');
  check('sku narrowing -> 1 style', r.body && Object.keys(r.body.table).length, 1);
  check('  sku key uppercased to M004', !!(r.body.table && r.body.table.M004), true);

  // 6. Unknown sku -> 404
  r = await call('?email=buyer%40example.com&sku=ZZZZ');
  check('unknown sku -> 404', r.status, 404);

  // 7. CORS pinned to our origin, not wildcard
  r = await call('?email=buyer%40example.com', { Origin: 'https://evil.example' });
  const acao = r.headers.get('Access-Control-Allow-Origin');
  check('CORS not wildcard for foreign origin', acao === '*', false);

  // 8. OPTIONS preflight handled
  const pre = await mod.onRequestOptions({ request: new Request('https://charlizi.com/api/tier-prices', { headers: { Origin: 'https://charlizi.com' } }), env: {} });
  check('OPTIONS -> 204/200', pre.status === 204 || pre.status === 200, true);

  const failed = results.filter((x) => !x).length;
  console.log('\n' + (failed === 0 ? 'ALL GATE TESTS PASSED' : failed + ' TEST(S) FAILED'));
  process.exitCode = failed === 0 ? 0 : 1;
}

main().catch((e) => {
  console.error('TEST HARNESS ERROR:', e.message);
  process.exitCode = 1;
});
