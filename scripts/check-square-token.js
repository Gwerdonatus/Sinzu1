#!/usr/bin/env node
// ============================================================
// Which environment does my Square access token belong to?
//
//   npm run check-token
//
// Sandbox and production tokens are indistinguishable by eye — both
// start with "EAAA" and both are 64 characters. This asks Square
// directly by trying the token against both environments and seeing
// which one accepts it.
//
// Reads SQUARE_ACCESS_TOKEN from .env.local. Never prints the token.
// ============================================================
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ENV_FILE = path.join(__dirname, '..', '.env.local');

if (!fs.existsSync(ENV_FILE)) {
  console.error('No .env.local found next to package.json. Create it from .env.example first.');
  process.exit(1);
}

const env = {};
for (const line of fs.readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
}

const token = env.SQUARE_ACCESS_TOKEN;
if (!token) {
  console.error('SQUARE_ACCESS_TOKEN is not set in .env.local.');
  process.exit(1);
}

const fingerprint = crypto.createHash('sha256').update(token).digest('hex').slice(0, 12);

console.log('');
console.log(`Token fingerprint : ${fingerprint}  (length ${token.length})`);
console.log(`Declared as       : SQUARE_ENVIRONMENT=${env.SQUARE_ENVIRONMENT || '(unset)'}`);
console.log(`Location ID       : ${env.NEXT_PUBLIC_SQUARE_LOCATION_ID || '(unset)'}`);
console.log('');
console.log('Asking Square which environment accepts this token...');
console.log('');

const HOSTS = {
  production: 'connect.squareup.com',
  sandbox: 'connect.squareupsandbox.com',
};

function listLocations(host) {
  return new Promise((resolve) => {
    const req = require('https').request(
      {
        host,
        path: '/v2/locations',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Square-Version': '2024-10-17',
          Accept: 'application/json',
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          let parsed = {};
          try {
            parsed = JSON.parse(body);
          } catch {}
          resolve({ status: res.statusCode, locations: parsed.locations || [] });
        });
      }
    );
    req.on('error', (e) => resolve({ status: 0, error: e.message, locations: [] }));
    req.end();
  });
}

(async () => {
  const results = {};
  for (const [name, host] of Object.entries(HOSTS)) {
    const r = await listLocations(host);
    results[name] = r;
    const verdict = r.status === 200 ? 'ACCEPTED' : `rejected (HTTP ${r.status || 'network error'})`;
    console.log(`  ${name.padEnd(11)} ${verdict}`);
    if (r.status === 200) {
      for (const l of r.locations) console.log(`              -> ${l.id}  "${l.name}"`);
    }
  }

  console.log('');
  const prodOk = results.production.status === 200;
  const sandOk = results.sandbox.status === 200;

  if (prodOk) {
    const declared = env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
    const match = results.production.locations.find((l) => l.id === declared);
    console.log('This is a PRODUCTION token.');
    if (match) {
      console.log(`Location ${declared} matches "${match.name}". This is correct — paste this same`);
      console.log('token into Vercel as SQUARE_ACCESS_TOKEN and redeploy without the build cache.');
    } else {
      console.log(`But NEXT_PUBLIC_SQUARE_LOCATION_ID (${declared}) is not one of the locations above.`);
      console.log('Copy the correct ID from the list and update it in .env.local and Vercel.');
    }
    process.exit(0);
  }

  if (sandOk) {
    console.log('This is a SANDBOX token. It cannot read your real catalog.');
    console.log('');
    console.log('Get the production one:');
    console.log('  1. https://developer.squareup.com/apps -> SINZU Website');
    console.log('  2. Switch the environment toggle to Production');
    console.log('  3. Left nav -> Credentials');
    console.log('  4. Confirm the tab at the top says Production, not Sandbox');
    console.log('  5. Production Access token -> Show -> copy');
    console.log('');
    console.log('Then re-run this check before touching Vercel.');
    process.exit(1);
  }

  console.log('Neither environment accepted this token — it is expired, revoked, or mistyped.');
  console.log('Generate a fresh production token in the Developer Console.');
  process.exit(1);
})();
