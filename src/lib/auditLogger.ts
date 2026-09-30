// src/lib/auditLogger.ts

export type AuditEvent = 
  | 'LOGIN_SUCCESS' 
  | 'LOGIN_FAILED' 
  | 'QUOTE_SENT' 
  | 'PDF_EXPORTED' 
  | 'LOGOUT' 
  | 'SESSION_EXPIRED';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  event: AuditEvent;
  userEmail: string;
  details?: Record<string, any>;
}

const AUDIT_LOG_KEY = 'bal_audit_logs';
const MAX_LOGS = 1000;

export function logAuditEvent(event: AuditEvent, userEmail: string, details?: Record<string, any>) {
  try {
    const newEntry: AuditLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      event,
      userEmail,
      details,
    };

    // Also log to console for monitoring/Sentry capture
    console.info(`[AUDIT] ${event} - ${userEmail}`, details || '');

    // Retrieve existing logs
    const existingRaw = localStorage.getItem(AUDIT_LOG_KEY);
    let logs: AuditLogEntry[] = [];
    if (existingRaw) {
      logs = JSON.parse(existingRaw);
    }

    // Prepend new log and enforce limit
    logs.unshift(newEntry);
    if (logs.length > MAX_LOGS) {
      logs = logs.slice(0, MAX_LOGS);
    }

    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to write audit log', err);
  }
}

export function getAuditLogs(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearAuditLogs(): void {
  localStorage.removeItem(AUDIT_LOG_KEY);
}
