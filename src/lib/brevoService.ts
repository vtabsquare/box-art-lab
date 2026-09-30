// Brevo (Sendinblue) transactional email service
// Production: emails are sent via /.netlify/functions/send-email (server-side API key)
// Development / demo: falls back to demo mode (OTP shown on screen) if function unavailable

const BREVO_SENDER_EMAIL = import.meta.env.VITE_BREVO_SENDER_EMAIL || 'noreply@boxartlab.com';
const BREVO_SENDER_NAME = import.meta.env.VITE_BREVO_SENDER_NAME || 'Box Art Lab';

// Serverless function endpoint — API key lives server-side only
const EMAIL_FUNCTION_URL = '/.netlify/functions/send-email';

// Hosted publicly so all email clients (including mobile Gmail) will load it reliably
const BEEPAC_LOGO_URL = 'https://files.catbox.moe/s3y01f.webp';

// ── In-memory OTP store (client-side, per-session) ──────────────────────────
const otpStore = new Map<string, { code: string; expiresAt: number }>();

// ── OTP verification rate limiting ──────────────────────────────────────────
// Tracks failed verification attempts per email to prevent brute-force guessing.
// Stored in memory — resets on page refresh (acceptable for this architecture).
const otpFailures = new Map<string, { count: number; lockedUntil: number }>();
const MAX_OTP_ATTEMPTS = 5;
const OTP_LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export interface OTPLockoutInfo {
  locked: boolean;
  remainingMs: number;
  attemptsLeft: number;
}

/**
 * Returns current lockout status for an email.
 * Automatically clears expired lockouts.
 */
export function getOTPLockoutInfo(email: string): OTPLockoutInfo {
  const key = email.toLowerCase();
  const record = otpFailures.get(key);

  if (!record) {
    return { locked: false, remainingMs: 0, attemptsLeft: MAX_OTP_ATTEMPTS };
  }

  if (record.count >= MAX_OTP_ATTEMPTS) {
    const remainingMs = record.lockedUntil - Date.now();
    if (remainingMs > 0) {
      return { locked: true, remainingMs, attemptsLeft: 0 };
    }
    // Lockout expired — auto-clear
    otpFailures.delete(key);
    return { locked: false, remainingMs: 0, attemptsLeft: MAX_OTP_ATTEMPTS };
  }

  return {
    locked: false,
    remainingMs: 0,
    attemptsLeft: MAX_OTP_ATTEMPTS - record.count,
  };
}

/** Record one failed OTP verification attempt. Sets lockout on MAX_OTP_ATTEMPTS. */
function recordOTPFailure(email: string): void {
  const key = email.toLowerCase();
  const existing = otpFailures.get(key);
  const count = (existing?.count ?? 0) + 1;
  otpFailures.set(key, {
    count,
    lockedUntil:
      count >= MAX_OTP_ATTEMPTS
        ? Date.now() + OTP_LOCKOUT_MS
        : (existing?.lockedUntil ?? 0),
  });
}

/**
 * Clear all failed attempts for an email (call when a new OTP is sent,
 * so the user starts a fresh verification session).
 */
export function resetOTPAttempts(email: string): void {
  otpFailures.delete(email.toLowerCase());
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ── Internal: proxy email request through Netlify function ──────────────────
async function callEmailFunction(
  payload: object
): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch(EMAIL_FUNCTION_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return { ok: false, error: (data as any).error || `HTTP ${response.status}` };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}

// ── sendVerificationEmail ────────────────────────────────────────────────────
export async function sendVerificationEmail(
  email: string,
  name: string
): Promise<{ success: boolean; code?: string; error?: string }> {
  const code = generateOTP();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Store OTP locally for verification
  otpStore.set(email.toLowerCase(), { code, expiresAt });

  // Clear any previous failure count so the new OTP gets a fresh slate
  resetOTPAttempts(email);

  const payload = {
    sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
    to: [{ email, name }],
    subject: 'Your Box Art Lab Verification Code',
    htmlContent: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 30px; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="${BEEPAC_LOGO_URL}" alt="Beepac Logo" style="height: 60px; width: auto; margin-bottom: 16px;" />
        </div>
        <p style="color: #111111; font-size: 16px; line-height: 1.6; margin-bottom: 12px; text-align: left;">Hi <strong>${name}</strong>,</p>
        <p style="color: #444444; font-size: 15px; line-height: 1.6; margin-bottom: 28px; text-align: left;">Please use the verification code below to confirm your identity:</p>
        <div style="text-align: center; padding: 24px; background-color: #f9f9f9; border: 1px solid #eeeeee; border-radius: 12px; margin-bottom: 28px;">
          <p style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #f59e0b; margin: 0;">${code}</p>
        </div>
        <p style="color: #777777; font-size: 13px; text-align: center;">This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 32px 0 24px;" />
        <p style="color: #999999; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Box Art Lab. Premium Packaging & Printing Solutions.</p>
      </div>
    `,
  };

  const result = await callEmailFunction(payload);

  if (result.ok) {
    return { success: true };
  }

  // Function unavailable or failed — demo/dev fallback: show code on screen
  console.warn('[Brevo] Email function unavailable — demo mode. OTP:', code);
  return { success: true, code, error: result.error };
}

// ── verifyOTP ────────────────────────────────────────────────────────────────
export function verifyOTP(email: string, code: string): boolean {
  const key = email.toLowerCase();

  // Reject immediately if the account is locked out
  const lockInfo = getOTPLockoutInfo(email);
  if (lockInfo.locked) return false;

  const entry = otpStore.get(key);
  if (!entry) {
    recordOTPFailure(email);
    return false;
  }
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(key);
    recordOTPFailure(email);
    return false;
  }
  if (entry.code !== code) {
    recordOTPFailure(email);
    return false;
  }

  // Valid — one-time use: remove from store and clear failure count
  otpStore.delete(key);
  resetOTPAttempts(email);
  return true;
}

// ── sendProposalEmail ────────────────────────────────────────────────────────
export async function sendProposalEmail({
  email,
  name,
  category,
  productType,
  dimensions,
  pricing,
  pdfBase64,
  pdfFilename,
}: {
  email: string;
  name: string;
  category: string;
  productType: string;
  dimensions: string;
  pricing: {
    basePrice: number;
    sizeAdjustment: number;
    designPremium: number;
    totalCost: number;
    multiplier: number;
  };
  pdfBase64: string;
  pdfFilename: string;
}): Promise<{ success: boolean; error?: string }> {
  const payload = {
    sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
    to: [{ email, name }],
    subject: `Your Packaging Proposal: ${productType} - Box Art Lab`,
    htmlContent: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 48px 40px; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); color: #333333;">
        <div style="text-align: center; margin-bottom: 40px;">
          <img src="${BEEPAC_LOGO_URL}" alt="Beepac Logo" style="height: 60px; width: auto; margin-bottom: 16px;" />
        </div>
        
        <p style="color: #111111; font-size: 16px; line-height: 1.6; margin-bottom: 12px; text-align: left;">Dear Customer,</p>
        <p style="color: #444444; font-size: 15px; line-height: 1.6; margin-bottom: 32px; text-align: left;">Thank you for requesting a quote from Box Art Lab. We are excited to help you bring your packaging design to life. Your custom specifications and investment summary are detailed below and attached as a PDF proposal.</p>
        
        <!-- Specs Card -->
        <div style="background-color: #fcfcfc; border: 1px solid #f0f0f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h3 style="color: #f59e0b; font-size: 14px; font-weight: 700; text-transform: uppercase; margin-top: 0; margin-bottom: 16px; border-bottom: 1px solid #f0f0f0; padding-bottom: 12px;">Specifications</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333333;">
            <tr>
              <td style="padding: 8px 0; color: #666666; width: 40%; text-align: left;">Category:</td>
              <td style="padding: 8px 0; font-weight: 600; color: #111111; text-align: left;">${category}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666666; text-align: left;">Product Type:</td>
              <td style="padding: 8px 0; font-weight: 600; color: #111111; text-align: left;">${productType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666666; text-align: left;">Dimensions:</td>
              <td style="padding: 8px 0; font-weight: 600; color: #111111; text-align: left;">${dimensions}</td>
            </tr>
          </table>
        </div>

        <!-- Pricing Card -->
        <div style="background-color: #fcfcfc; border: 1px solid #f0f0f0; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
          <h3 style="color: #f59e0b; font-size: 14px; font-weight: 700; text-transform: uppercase; margin-top: 0; margin-bottom: 16px; border-bottom: 1px solid #f0f0f0; padding-bottom: 12px;">Investment Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333333; margin-bottom: 16px;">
            <tr>
              <td style="padding: 8px 0; color: #666666; text-align: left;">Base Material:</td>
              <td style="padding: 8px 0; text-align: right; color: #111111; font-weight: 500;">₹${pricing.basePrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666666; text-align: left;">Size Adjustment:</td>
              <td style="padding: 8px 0; text-align: right; color: #111111; font-weight: 500;">₹${pricing.sizeAdjustment.toFixed(2)}</td>
            </tr>
            ${pricing.designPremium > 0 ? `
            <tr>
              <td style="padding: 8px 0; color: #666666; text-align: left;">Custom Design Premium:</td>
              <td style="padding: 8px 0; text-align: right; color: #111111; font-weight: 500;">₹${pricing.designPremium.toFixed(2)}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 8px 0; color: #666666; text-align: left;">Industry Multiplier:</td>
              <td style="padding: 8px 0; text-align: right; color: #111111; font-weight: 500;">×${pricing.multiplier}</td>
            </tr>
          </table>
          <div style="border-top: 2px solid #f0f0f0; padding-top: 16px; display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-size: 15px; font-weight: 700; color: #111111; text-align: left;">Estimated Unit Cost:</span>
            <span style="font-size: 24px; font-weight: 800; color: #f59e0b; text-align: right;">₹${pricing.totalCost.toFixed(2)} <span style="font-size: 12px; font-weight: 600; color: #888888; text-transform: uppercase;">per unit</span></span>
          </div>
        </div>

        <p style="color: #666666; font-size: 13px; line-height: 1.6; margin-bottom: 24px; text-align: center; font-style: italic; background-color: #fdfae6; border: 1px solid #faedc8; border-radius: 8px; padding: 12px;">
          * Note: A detailed layout, structural dieline, and cost breakdown can be found in the attached PDF. Minimum order quantity may apply.
        </p>

        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 32px 0 24px;" />
        <p style="color: #999999; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Box Art Lab. All rights reserved. Premium Packaging & Printing Solutions.</p>
      </div>
    `,
    attachment: [
      {
        content: pdfBase64,
        name: pdfFilename,
      },
    ],
  };

  const result = await callEmailFunction(payload);

  if (result.ok) {
    return { success: true };
  }

  console.error('[Brevo] Proposal email send error:', result.error);
  return { success: false, error: result.error };
}
