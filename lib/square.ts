// ============================================================
// Server-side Square client. NEVER import this file from a
// 'use client' component — the access token must stay on the server.
//
// The client is created lazily: importing this file must never
// throw, or `next build` fails with a confusing stack trace when
// env vars aren't wired up yet on the host (e.g. Vercel).
// Configuration problems surface at request time instead, with a
// message that says exactly which variable is missing.
// ============================================================
import { Client, Environment } from 'square';

export const SQUARE_ENV: 'production' | 'sandbox' =
  process.env.SQUARE_ENVIRONMENT === 'production' ? 'production' : 'sandbox';

export const LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || '';

/** Thrown when env vars are missing — distinct from a Square API failure. */
export class SquareConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SquareConfigError';
  }
}

/** Returns a list of misconfigured env vars, empty when everything is set. */
export function configProblems(): string[] {
  const problems: string[] = [];
  if (!process.env.SQUARE_ACCESS_TOKEN) {
    problems.push('SQUARE_ACCESS_TOKEN is not set (server-side secret).');
  }
  if (!LOCATION_ID) {
    problems.push('NEXT_PUBLIC_SQUARE_LOCATION_ID is not set.');
  }
  if (!process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID) {
    problems.push('NEXT_PUBLIC_SQUARE_APPLICATION_ID is not set (the card form needs it).');
  }

  // The app ID prefix tells us which Square environment the keys were
  // copied from. A sandbox app ID paired with SQUARE_ENVIRONMENT=production
  // (or vice versa) always ends in a 401 from Square, which is otherwise
  // very hard to diagnose from the outside.
  const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || '';
  const appIdEnv = appId.startsWith('sandbox-') ? 'sandbox' : appId ? 'production' : null;
  if (appIdEnv && appIdEnv !== SQUARE_ENV) {
    problems.push(
      `Environment mismatch: SQUARE_ENVIRONMENT=${SQUARE_ENV} but ` +
        `NEXT_PUBLIC_SQUARE_APPLICATION_ID looks like a ${appIdEnv} key. ` +
        `All four Square values must come from the same environment.`
    );
  }
  if (process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT &&
      process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT !== SQUARE_ENV) {
    problems.push(
      `NEXT_PUBLIC_SQUARE_ENVIRONMENT (${process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT}) ` +
        `does not match SQUARE_ENVIRONMENT (${SQUARE_ENV}).`
    );
  }
  return problems;
}

let _client: Client | null = null;

export function getSquareClient(): Client {
  const problems = configProblems();
  if (problems.length) {
    throw new SquareConfigError(
      `Square is not configured correctly:\n  - ${problems.join('\n  - ')}\n` +
        `Fix these in .env.local (local) or your host's environment variables (production).`
    );
  }
  if (!_client) {
    _client = new Client({
      accessToken: process.env.SQUARE_ACCESS_TOKEN!,
      environment: SQUARE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
    });
  }
  return _client;
}

/**
 * Turns a Square SDK error into a sentence that names the likely cause.
 * A bare "Response status code was not ok: 401" tells the client nothing.
 */
export function explainSquareError(error: any): string {
  if (error instanceof SquareConfigError) return error.message;

  const status = error?.statusCode;
  const detail = error?.errors?.[0]?.detail || error?.result?.errors?.[0]?.detail;

  if (status === 401) {
    return (
      `Square rejected the access token (401 UNAUTHORIZED) while running against the ` +
      `${SQUARE_ENV} environment. The token in SQUARE_ACCESS_TOKEN is either expired, ` +
      `revoked, or belongs to the other environment — a sandbox token cannot read a ` +
      `production catalog. Copy the ${SQUARE_ENV} access token from ` +
      `https://developer.squareup.com/apps and restart the server.`
    );
  }
  if (status === 403) {
    return (
      `Square returned 403 FORBIDDEN. The access token is valid but is missing the ` +
      `permissions this site needs: ITEMS_READ, INVENTORY_READ, ORDERS_WRITE, PAYMENTS_WRITE.` +
      (detail ? ` Square said: ${detail}` : '')
    );
  }
  if (status === 404 && detail?.includes('location')) {
    return (
      `Square could not find location "${LOCATION_ID}". Check ` +
      `NEXT_PUBLIC_SQUARE_LOCATION_ID against the locations in your ${SQUARE_ENV} account.`
    );
  }
  return detail || error?.message || 'Unknown Square error';
}

// Lazy API proxies — these keep the existing `import { catalogApi } from '@/lib/square'`
// call sites working while deferring client construction to first use.
function lazyApi<K extends keyof Client>(name: K): Client[K] {
  return new Proxy({} as any, {
    get(_target, prop) {
      const api = getSquareClient()[name] as any;
      const value = api[prop];
      return typeof value === 'function' ? value.bind(api) : value;
    },
  });
}

export const catalogApi = lazyApi('catalogApi');
export const ordersApi = lazyApi('ordersApi');
export const paymentsApi = lazyApi('paymentsApi');
export const inventoryApi = lazyApi('inventoryApi');
export const locationsApi = lazyApi('locationsApi');
