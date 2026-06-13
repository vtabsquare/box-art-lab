// Brevo (Sendinblue) transactional email service for OTP verification
// API docs: https://developers.brevo.com/reference/sendtransacemail

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY || '';
const BREVO_SENDER_EMAIL = import.meta.env.VITE_BREVO_SENDER_EMAIL || 'noreply@boxartlab.com';
const BREVO_SENDER_NAME = import.meta.env.VITE_BREVO_SENDER_NAME || 'Box Art Lab';

// In-memory OTP store (for demo; in production use a backend)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationEmail(
  email: string,
  name: string
): Promise<{ success: boolean; code?: string; error?: string }> {
  const code = generateOTP();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Store OTP
  otpStore.set(email.toLowerCase(), { code, expiresAt });

  // If no API key, return the code directly (dev/demo mode)
  if (!BREVO_API_KEY) {
    console.warn('[Brevo] No API key found — running in demo mode. OTP:', code);
    return { success: true, code };
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
        to: [{ email, name }],
        subject: 'Your Box Art Lab Verification Code',
        htmlContent: `
          <div style="font-family: 'Inter', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 30px; background: linear-gradient(180deg, #0e0e14 0%, #14141e 100%); border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 14px; background: linear-gradient(135deg, #f59e0b, #d97706); margin-bottom: 16px;">
                <span style="font-size: 24px; font-weight: bold; color: white;">B</span>
              </div>
              <h1 style="font-size: 24px; font-weight: 700; background: linear-gradient(135deg, #f59e0b, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">Box Art Lab</h1>
              <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #71717a; margin-top: 4px;">Packaging Studio</p>
            </div>
            <p style="color: #d4d4d8; font-size: 15px; line-height: 1.6; margin-bottom: 8px;">Hi <strong style="color: #f4f4f5;">${name}</strong>,</p>
            <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 28px;">Please use the verification code below to confirm your identity:</p>
            <div style="text-align: center; padding: 24px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 12px; margin-bottom: 28px;">
              <p style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #f59e0b; margin: 0;">${code}</p>
            </div>
            <p style="color: #71717a; font-size: 12px; text-align: center;">This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 28px 0 20px;" />
            <p style="color: #52525b; font-size: 11px; text-align: center;">© ${new Date().getFullYear()} Box Art Lab. Premium Packaging & Printing Solutions.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send email');
    }

    return { success: true };
  } catch (error: any) {
    console.error('[Brevo] Email send error:', error);
    // Fallback: still return the code so the user can proceed in demo
    return { success: true, code, error: error.message };
  }
}

export function verifyOTP(email: string, code: string): boolean {
  const entry = otpStore.get(email.toLowerCase());
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return false;
  }
  if (entry.code !== code) return false;

  // Valid — remove after successful verification
  otpStore.delete(email.toLowerCase());
  return true;
}

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
  // If no API key, log and return success in demo mode
  if (!BREVO_API_KEY) {
    console.warn('[Brevo] No API key found — running in demo mode. Mock sending proposal email.');
    return { success: true };
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
        to: [{ email, name }],
        subject: `Your Packaging Proposal: ${productType} - Box Art Lab`,
        htmlContent: `
          <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 30px; background: linear-gradient(180deg, #0e0e14 0%, #14141e 100%); border-radius: 16px; border: 1px solid rgba(212, 175, 55, 0.15); color: #d4d4d8;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 14px; background: linear-gradient(135deg, #f59e0b, #d97706); margin-bottom: 16px;">
                <span style="font-size: 24px; font-weight: bold; color: white;">B</span>
              </div>
              <h1 style="font-size: 24px; font-weight: 700; background: linear-gradient(135deg, #f59e0b, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">Box Art Lab</h1>
              <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #71717a; margin-top: 4px;">Packaging Studio</p>
            </div>
            
            <p style="color: #d4d4d8; font-size: 15px; line-height: 1.6; margin-bottom: 8px;">Dear <strong style="color: #f4f4f5;">${name}</strong>,</p>
            <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">Thank you for requesting a quote from Box Art Lab. We are excited to help you bring your packaging design to life. Your custom specifications and investment summary are detailed below and attached as a PDF proposal.</p>
            
            <!-- Specs Card -->
            <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <h3 style="color: #f59e0b; font-size: 14px; font-weight: 700; text-transform: uppercase; margin-top: 0; margin-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 8px;">Specifications</h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #d4d4d8;">
                <tr>
                  <td style="padding: 6px 0; color: #71717a; width: 40%;">Category:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #f4f4f5;">${category}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #71717a;">Product Type:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #f4f4f5;">${productType}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #71717a;">Dimensions:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #f4f4f5;">${dimensions}</td>
                </tr>
              </table>
            </div>

            <!-- Pricing Card -->
            <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 20px; margin-bottom: 28px;">
              <h3 style="color: #f59e0b; font-size: 14px; font-weight: 700; text-transform: uppercase; margin-top: 0; margin-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 8px;">Investment Details</h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #d4d4d8; margin-bottom: 12px;">
                <tr>
                  <td style="padding: 6px 0; color: #71717a;">Base Material:</td>
                  <td style="padding: 6px 0; text-align: right; color: #f4f4f5;">₹${pricing.basePrice.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #71717a;">Size Adjustment:</td>
                  <td style="padding: 6px 0; text-align: right; color: #f4f4f5;">₹${pricing.sizeAdjustment.toFixed(2)}</td>
                </tr>
                ${pricing.designPremium > 0 ? `
                <tr>
                  <td style="padding: 6px 0; color: #71717a;">Custom Design Premium:</td>
                  <td style="padding: 6px 0; text-align: right; color: #f4f4f5;">₹${pricing.designPremium.toFixed(2)}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 6px 0; color: #71717a;">Industry Multiplier:</td>
                  <td style="padding: 6px 0; text-align: right; color: #f4f4f5;">×${pricing.multiplier}</td>
                </tr>
              </table>
              <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 12px; display: flex; justify-content: space-between; align-items: baseline;">
                <span style="font-size: 14px; font-weight: 700; color: #f4f4f5;">Estimated Unit Cost:</span>
                <span style="font-size: 22px; font-weight: 800; color: #f59e0b;">₹${pricing.totalCost.toFixed(2)} <span style="font-size: 11px; font-weight: normal; color: #71717a;">per unit</span></span>
              </div>
            </div>

            <p style="color: #a1a1aa; font-size: 13px; line-height: 1.6; margin-bottom: 24px; text-align: center; font-style: italic;">
              * Note: A detailed layout, structural dieline, and cost breakdown can be found in the attached PDF. Minimum order quantity may apply.
            </p>

            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 28px 0 20px;" />
            <p style="color: #52525b; font-size: 11px; text-align: center;">© ${new Date().getFullYear()} Box Art Lab. All rights reserved. Premium Packaging & Printing Solutions.</p>
          </div>
        `,
        attachment: [
          {
            content: pdfBase64,
            name: pdfFilename
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send email');
    }

    return { success: true };
  } catch (error: any) {
    console.error('[Brevo] Proposal email send error:', error);
    return { success: false, error: error.message };
  }
}
