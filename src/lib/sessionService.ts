// sessionService.ts
// Handles authenticated session lifecycle: create, validate, expire, clear.

import { logAuditEvent } from './auditLogger';

const SESSION_KEY = 'bal_session';
const DEFAULT_SESSION_DURATION_MS = 24 * 60 * 60 * 1000;       // 24 hours
const EXTENDED_SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days ("Remember device")

export interface SessionData {
  name: string;
  email: string;
  mobile: string;
  location: string;
  expiresAt: number;
  /** True when user opted into 30-day "remember this device" */
  rememberDevice?: boolean;
}

export interface SetSessionOptions {
  /** Extend session to 30 days instead of the default 24 hours */
  rememberDevice?: boolean;
}

/**
 * Create a new authenticated session after successful login (OTP or SSO).
 * Also writes legacy individual keys so existing reads still work.
 */
export function setSession(
  data: { name: string; email: string; mobile: string; location: string },
  options?: SetSessionOptions
): void {
  const durationMs = options?.rememberDevice
    ? EXTENDED_SESSION_DURATION_MS
    : DEFAULT_SESSION_DURATION_MS;

  const session: SessionData = {
    ...data,
    expiresAt: Date.now() + durationMs,
    rememberDevice: options?.rememberDevice ?? false,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  // Keep legacy keys for backward compatibility with existing code
  localStorage.setItem('user_name', data.name);
  localStorage.setItem('user_email', data.email);
  localStorage.setItem('user_mobile', data.mobile);
  localStorage.setItem('user_location', data.location);
}

/**
 * Read and validate the current session.
 * Returns null if missing or expired (and clears stale data on expiry).
 */
export function getSession(): SessionData | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const session: SessionData = JSON.parse(raw);

    if (Date.now() > session.expiresAt) {
      logAuditEvent('SESSION_EXPIRED', session.email);
      clearSession(true);
      return null;
    }

    return session;
  } catch {
    clearSession();
    return null;
  }
}

/**
 * Returns true if a valid, non-expired session exists.
 */
export function isAuthenticated(): boolean {
  return getSession() !== null;
}

/**
 * Destroy the session (logout). Removes all keys including legacy ones.
 * @param isExpiry - true if called because of expiry, false if explicit user logout
 */
export function clearSession(isExpiry: boolean = false): void {
  const session = getSession();
  if (session && !isExpiry) {
    logAuditEvent('LOGOUT', session.email);
  }

  localStorage.removeItem(SESSION_KEY);
  // Legacy keys
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_mobile');
  localStorage.removeItem('user_location');
  // Also clear any alternate key formats used in StudioPage
  localStorage.removeItem('userEmail');
  localStorage.removeItem('registeredEmail');
  localStorage.removeItem('userName');
}
