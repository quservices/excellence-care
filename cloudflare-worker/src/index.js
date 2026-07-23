/* ═══════════════════════════════════════════════════════════════════
   Exelance Care — Cloudflare Worker

   Endpoint:  POST https://<worker>.workers.dev/
   Volání:    z prohlížeče po úspěšné rezervaci (index.html)
   Akce:      odešle 2 emaily přes Resend HTTP API
              1) klientovi — luxusní potvrzení
              2) majiteli  — notifikace s kontakty

   Secrets (wrangler secret put):
   - RESEND_API_KEY  (re_…)
   ═══════════════════════════════════════════════════════════════════ */

import TPL_CLIENT from '../templates/client.html';
import TPL_OWNER  from '../templates/owner.html';

/* ═══ KONFIGURACE ═══ */
const ALLOWED_ORIGINS = [
  'https://exelance-care.web.app',
  'https://exelance-care.firebaseapp.com',
  'http://localhost:5500',     // local dev
  'http://127.0.0.1:5500',
];

// Odesílatel — TESTOVACÍ. Po koupi domény a verifikaci v Resendu sem dej:
//   'Exelance Care <rezervace@tvoje-domena.cz>'
const EMAIL_FROM    = 'Exelance Care <onboarding@resend.dev>';
const EMAIL_REPLYTO = 'exelance.care@seznam.cz';
const OWNER_EMAIL   = 'exelance.care@seznam.cz';

/* ═══ HELPERS ═══ */

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function render(tpl, vars) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => escapeHtml(vars[k]));
}

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin':  allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age':       '86400',
    'Vary':                          'Origin',
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

async function sendViaResend(apiKey, payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

/* ═══ MAIN HANDLER ═══ */
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    /* CORS preflight */
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    /* Health check */
    if (request.method === 'GET') {
      return json({ status: 'ok', service: 'exelance-care-mailer' }, 200, origin);
    }

    if (request.method !== 'POST') {
      return json({ error: 'method not allowed' }, 405, origin);
    }

    /* Origin check — pouze z naší domény */
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return json({ error: 'forbidden origin' }, 403, origin);
    }

    /* Parse */
    let data;
    try {
      data = await request.json();
    } catch {
      return json({ error: 'invalid json' }, 400, origin);
    }

    /* Validace povinných polí */
    const required = ['rezervace_id', 'jmeno', 'telefon', 'email', 'sluzba', 'termin'];
    const missing  = required.filter(k => !data[k]);
    if (missing.length) {
      return json({ error: 'missing fields', fields: missing }, 400, origin);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return json({ error: 'invalid email' }, 400, origin);
    }

    /* Formátování pro šablonu */
    const dt        = new Date(data.termin);
    const fmtDate   = new Intl.DateTimeFormat('cs-CZ', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }).format(dt);
    const fmtTime   = new Intl.DateTimeFormat('cs-CZ', {
      hour: '2-digit', minute: '2-digit',
    }).format(dt);
    const odeslanoV = new Intl.DateTimeFormat('cs-CZ', {
      dateStyle: 'short', timeStyle: 'short',
    }).format(new Date());

    const vars = {
      rezervace_id: data.rezervace_id,
      jmeno:        data.jmeno,
      telefon:      data.telefon,
      email:        data.email,
      sluzba:       data.sluzba,
      kategorie:    data.kategorie || '',
      cena:         data.cena      || '—',
      trvani:       data.trvani    || `${data.duration ?? 30} min`,
      termin_datum: fmtDate,
      termin_cas:   fmtTime,
      zprava:       data.zprava || 'Bez poznámky.',
      odeslano_v:   odeslanoV,
    };

    const htmlClient = render(TPL_CLIENT, vars);
    const htmlOwner  = render(TPL_OWNER,  vars);

    /* Paralelní odeslání */
    const [clientRes, ownerRes] = await Promise.allSettled([
      sendViaResend(env.RESEND_API_KEY, {
        from:     EMAIL_FROM,
        to:       data.email,
        reply_to: EMAIL_REPLYTO,
        subject:  `Potvrzení rezervace · ${data.sluzba} · ${fmtDate}`,
        html:     htmlClient,
        tags:     [{ name: 'type', value: 'client_confirmation' }],
      }),
      sendViaResend(env.RESEND_API_KEY, {
        from:     EMAIL_FROM,
        to:       OWNER_EMAIL,
        reply_to: data.email,
        subject:  `🔔 Nová rezervace · ${data.jmeno} · ${fmtDate} ${fmtTime}`,
        html:     htmlOwner,
        tags:     [{ name: 'type', value: 'owner_notification' }],
      }),
    ]);

    const result = {
      client: clientRes.status === 'fulfilled'
        ? { ok: clientRes.value.ok, id: clientRes.value.body?.id, error: clientRes.value.body?.message }
        : { ok: false, error: String(clientRes.reason) },
      owner:  ownerRes.status === 'fulfilled'
        ? { ok: ownerRes.value.ok, id: ownerRes.value.body?.id, error: ownerRes.value.body?.message }
        : { ok: false, error: String(ownerRes.reason) },
    };

    return json(result, 200, origin);
  },
};
