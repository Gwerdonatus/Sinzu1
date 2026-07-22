import { NextRequest, NextResponse } from 'next/server';
import { Client, Environment } from 'square';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '@/lib/email/send';
import { welcomeEmail } from '@/lib/email/templates';

export const dynamic = 'force-dynamic';

// ============================================================
// Email signup — saves subscribers to Square Customers.
// Adds a "Newsletter" reference so you can filter later in the
// Square Dashboard (Customers → filter by reference).
//
// Later you can pipe these to Klaviyo/Mailchimp — swap the
// Square client for the email service SDK, no other changes.
// ============================================================

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment:
    process.env.SQUARE_ENVIRONMENT === 'production'
      ? Environment.Production
      : Environment.Sandbox,
});

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json() as { email?: string; source?: string };
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // Skip duplicates — search first
    const { result: search } = await client.customersApi.searchCustomers({
      query: {
        filter: {
          emailAddress: { exact: email.toLowerCase() },
        },
      },
    });

    if (search.customers && search.customers.length > 0) {
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }

    await client.customersApi.createCustomer({
      idempotencyKey: uuidv4(),
      emailAddress: email.toLowerCase(),
      referenceId: `newsletter-${source || 'site'}`,
      note: `Subscribed via ${source || 'site'} on ${new Date().toISOString().slice(0, 10)}`,
    });

    // Fire welcome email in background — don't block the response.
    const welcome = welcomeEmail();
    sendEmail({ to: email, ...welcome }).catch((e) =>
      console.error('[welcome-email] failed:', e)
    );

    return NextResponse.json({ ok: true, alreadySubscribed: false });
  } catch (e: any) {
    console.error('Subscribe error:', e?.result?.errors || e);
    return NextResponse.json({ error: 'Could not subscribe. Please try again.' }, { status: 500 });
  }
}
