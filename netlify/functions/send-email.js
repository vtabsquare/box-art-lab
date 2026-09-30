/**
 * Netlify Serverless Function: send-email
 *
 * Proxies email requests to the Brevo API using a server-side API key.
 * This keeps BREVO_API_KEY out of the client-side JavaScript bundle.
 *
 * Environment variable required (set in Netlify dashboard, NOT prefixed with VITE_):
 *   BREVO_API_KEY=your_brevo_api_key_here
 */

// ── Constants ────────────────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 8 MB cap — generous enough for base64-encoded PDF attachments (~2–3 MB PDF → ~4 MB base64)
const MAX_BODY_BYTES = 8 * 1024 * 1024;
const MAX_RECIPIENTS = 3;

// ── Input validation ─────────────────────────────────────────────────────────
/**
 * Validates the incoming email payload.
 * Returns an array of error strings; empty array means valid.
 */
function validatePayload(payload) {
  const errors = [];

  // sender
  if (!payload.sender || typeof payload.sender !== 'object') {
    errors.push('Missing sender object');
  } else {
    if (!payload.sender.email || !EMAIL_REGEX.test(payload.sender.email)) {
      errors.push('Invalid or missing sender.email');
    }
    if (payload.sender.name && typeof payload.sender.name !== 'string') {
      errors.push('sender.name must be a string');
    }
  }

  // to
  if (!Array.isArray(payload.to) || payload.to.length === 0) {
    errors.push('Missing or empty recipient list (to)');
  } else if (payload.to.length > MAX_RECIPIENTS) {
    errors.push(`Too many recipients — maximum is ${MAX_RECIPIENTS}`);
  } else {
    for (const recipient of payload.to) {
      if (!recipient.email || !EMAIL_REGEX.test(recipient.email)) {
        errors.push('Invalid or missing recipient email');
        break;
      }
    }
  }

  // subject
  if (!payload.subject || typeof payload.subject !== 'string' || !payload.subject.trim()) {
    errors.push('Missing or empty subject');
  }

  // htmlContent
  if (!payload.htmlContent || typeof payload.htmlContent !== 'string') {
    errors.push('Missing or invalid htmlContent');
  }

  // attachment (optional) — must be an array if present
  if (payload.attachment !== undefined) {
    if (!Array.isArray(payload.attachment)) {
      errors.push('attachment must be an array');
    } else {
      for (const att of payload.attachment) {
        if (!att.content || typeof att.content !== 'string') {
          errors.push('Each attachment must have a content string');
          break;
        }
        if (!att.name || typeof att.name !== 'string') {
          errors.push('Each attachment must have a name string');
          break;
        }
      }
    }
  }

  return errors;
}

// ── Payload sanitisation ─────────────────────────────────────────────────────
/**
 * Returns a sanitised copy of the payload containing only known Brevo fields.
 * Prevents injection of unexpected API parameters.
 */
function sanitizePayload(payload) {
  const safe = {
    sender: {
      name: String(payload.sender.name || '').slice(0, 100),
      email: String(payload.sender.email),
    },
    to: payload.to.map((r) => ({
      email: String(r.email),
      ...(r.name ? { name: String(r.name).slice(0, 100) } : {}),
    })),
    subject: String(payload.subject).slice(0, 500),
    htmlContent: String(payload.htmlContent),
  };

  if (payload.attachment && Array.isArray(payload.attachment)) {
    safe.attachment = payload.attachment.map((a) => ({
      content: String(a.content),
      name: String(a.name).slice(0, 200),
    }));
  }

  return safe;
}

// ── Handler ──────────────────────────────────────────────────────────────────
export const handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) {
    console.error('[send-email] BREVO_API_KEY not configured in environment');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Email service not configured on the server.' }),
    };
  }

  // Guard against oversized payloads (PDF attachments in base64)
  const bodyLength = Buffer.byteLength(event.body || '', 'utf8');
  if (bodyLength > MAX_BODY_BYTES) {
    return {
      statusCode: 413,
      body: JSON.stringify({ error: 'Request payload too large' }),
    };
  }

  // Parse JSON body
  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  // Validate required fields and formats
  const validationErrors = validatePayload(payload);
  if (validationErrors.length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request', details: validationErrors }),
    };
  }

  // Sanitise — only forward known, safe fields to Brevo
  const safePayload = sanitizePayload(payload);

  // Forward to Brevo
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(safePayload),
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    return {
      statusCode: response.ok ? 200 : response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response.ok ? { success: true } : responseData),
    };
  } catch (error) {
    console.error('[send-email] Brevo API call failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to contact email provider.' }),
    };
  }
};
