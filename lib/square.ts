// ============================================================
// Server-side Square client. NEVER import this file from a
// 'use client' component — the access token must stay on the server.
// ============================================================
import { Client, Environment } from 'square';

const environment =
  process.env.SQUARE_ENVIRONMENT === 'production'
    ? Environment.Production
    : Environment.Sandbox;

if (!process.env.SQUARE_ACCESS_TOKEN) {
  throw new Error(
    'Missing SQUARE_ACCESS_TOKEN. Add it to .env.local (see .env.example).'
  );
}

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment,
});

export const { catalogApi, ordersApi, paymentsApi, inventoryApi, locationsApi } = client;

export const LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || '';

if (!LOCATION_ID) {
  throw new Error(
    'Missing NEXT_PUBLIC_SQUARE_LOCATION_ID. Add it to .env.local (see .env.example).'
  );
}

export default client;
