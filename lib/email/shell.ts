// ============================================================
// SINZU branded email shell.
//
// Uses inline styles + table layout — the boring stuff that
// makes emails render correctly in Gmail, Outlook, Apple Mail,
// mobile clients, etc. Fancy CSS breaks in Outlook, so we keep
// it to what's supported everywhere.
//
// Uses the deployed URL for images so the logo shows in emails
// (email clients can't inline base64 for images reliably).
// ============================================================

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://sinzu.shop';

export interface ShellArgs {
  preheader?: string; // hidden preview text shown in inbox lists
  body: string; // HTML for the main email body
}

export function emailShell({ preheader = '', body }: ShellArgs): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>SINZU</title>
<style>
  body,table,td,a{ -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table,td{ mso-table-lspace:0pt; mso-table-rspace:0pt; }
  img{ -ms-interpolation-mode:bicubic; border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
  body{ margin:0; padding:0; width:100% !important; background:#faf3de; font-family:'Helvetica Neue',Arial,sans-serif; color:#1a1200; }
  .headline{ font-family:Georgia,'Times New Roman',serif; }
  a{ color:#8b6914; text-decoration:underline; }
  @media only screen and (max-width:600px){
    .container{ width:100% !important; }
    .p-32{ padding:24px !important; }
    .h1{ font-size:22px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#faf3de;">
  <!-- preheader (hidden) -->
  <div style="display:none;font-size:1px;color:#faf3de;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader}
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#faf3de;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(139,105,20,0.08);">

        <!-- Gold accent bar -->
        <tr><td style="height:4px;background:linear-gradient(90deg,#a8862a,#e2c471,#f5e7a3,#e2c471,#a8862a);font-size:0;line-height:0;">&nbsp;</td></tr>

        <!-- Logo -->
        <tr><td align="center" style="padding:36px 24px 8px 24px;background:#ffffff;">
          <img src="${SITE}/sinzu-logo-square.png" alt="SINZU LLC" width="96" height="96" style="display:block;width:96px;height:96px;">
        </td></tr>

        <!-- Wordmark -->
        <tr><td align="center" style="padding:0 24px 8px 24px;">
          <div class="headline" style="font-family:Georgia,serif;font-size:26px;letter-spacing:6px;color:#1a1200;font-weight:600;">$INZU</div>
        </td></tr>

        <!-- Body -->
        <tr><td class="p-32" style="padding:32px 40px;">
          ${body}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid #f0e5c9;background:#fdfaf4;">
          <table role="presentation" width="100%">
            <tr><td align="center" style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;color:#8b6914;line-height:1.7;">
              <strong style="color:#5c4210;">SINZU LLC</strong><br>
              Northtown Mall · Blaine, MN<br>
              Opening Aug 10, 2026 at Mall of America<br>
              <a href="tel:+16124878228" style="color:#8b6914;text-decoration:none;">+1 (612) 487-8228</a> &nbsp;·&nbsp;
              <a href="mailto:hello@sinzu.shop" style="color:#8b6914;text-decoration:none;">hello@sinzu.shop</a><br><br>
              <a href="${SITE}" style="color:#8b6914;">${SITE.replace(/^https?:\/\//, '')}</a>
              &nbsp;·&nbsp;
              <a href="${SITE}/shop" style="color:#8b6914;">Shop</a>
              &nbsp;·&nbsp;
              <a href="${SITE}/faq" style="color:#8b6914;">FAQ</a>
            </td></tr>
          </table>
        </td></tr>

      </table>

      <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;">
        <tr><td align="center" style="padding:16px 24px;font-size:11px;color:#a89968;font-family:'Helvetica Neue',Arial,sans-serif;line-height:1.6;">
          © ${new Date().getFullYear()} SINZU LLC. All rights reserved.<br>
          You&rsquo;re receiving this because you shopped or subscribed at ${SITE.replace(/^https?:\/\//, '')}.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Convenience: a gold "button" element for CTAs inside body content. */
export function emailButton(href: string, label: string): string {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
      <tr><td align="center" bgcolor="#1a1200" style="border-radius:999px;">
        <a href="${href}" style="display:inline-block;padding:14px 30px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#e2c471 !important;text-decoration:none;border-radius:999px;">${label}</a>
      </td></tr>
    </table>
  `;
}

/** Convenience: a horizontal divider styled with a gold gradient. */
export const goldDivider = `
  <div style="height:1px;margin:24px 0;background:linear-gradient(90deg,transparent,#e2c471,transparent);"></div>
`;
