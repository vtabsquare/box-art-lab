import * as Sentry from '@sentry/react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

// Initialize Sentry only when a DSN is provided.
// Set VITE_SENTRY_DSN in your .env (dev) or Netlify environment variables (prod).
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    // Capture 20% of transactions for performance monitoring
    tracesSampleRate: 0.2,
    // Tag errors with the deployment environment
    environment: import.meta.env.MODE,
    // Ignore common browser extension / third-party noise
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
    ],
  });
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
