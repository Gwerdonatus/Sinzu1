// ============================================================
// Email sending — Resend (https://resend.com).
//
// SETUP (one-time):
//   1. Sign up at resend.com and add your domain (sinzu.shop)
//   2. Add the DNS records Resend gives you (SPF + DKIM + verify)
//   3. Generate an API key and add these env vars:
//        RESEND_API_KEY=re_xxxxx
//        MAIL_FROM="SINZU <hello@sinzu.shop>"
//        MAIL_REPLY_TO=hello@sinzu.shop
//        OWNER_EMAIL=hello@sinzu.shop        // notifications for owner
//
// If RESEND_API_KEY isn't set (e.g. during first local dev), we
// log the email to the console and continue — the site never
// breaks because email is unavailable.
// ============================================================

import { Resend } from 'resend';

const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.MAIL_FROM || 'SINZU <hello@sinzu.shop>';
const REPLY_TO = process.env.MAIL_REPLY_TO || 'hello@sinzu.shop';

const resend = API_KEY ? new Resend(API_KEY) : null;

export interface SendEmailArgs {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(args: SendEmailArgs): Promise<{ ok: boolean; error?: string }> {
  if (!resend) {
    console.log('[email:disabled]', args.subject, '→', args.to);
    return { ok: true };
  }
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text,
      replyTo: args.replyTo || REPLY_TO,
    });
    if (error) {
      console.error('[email:error]', error);
      return { ok: false, error: error.message };
    }
    console.log('[email:sent]', data?.id, args.subject);
    return { ok: true };
  } catch (e: any) {
    console.error('[email:exception]', e);
    return { ok: false, error: e.message };
  }
}

export const OWNER_EMAIL = process.env.OWNER_EMAIL || 'hello@sinzu.shop';
