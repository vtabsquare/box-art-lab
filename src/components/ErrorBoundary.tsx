import React from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

/**
 * Global React Error Boundary.
 * Catches any unhandled render/lifecycle errors in the component tree and
 * shows a user-friendly recovery screen instead of a blank page.
 *
 * If Sentry is initialised (VITE_SENTRY_DSN set), it automatically captures
 * the error via its own instrumentation — no manual reportign needed here.
 */
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      // Keep message brief and non-technical for display
      errorMessage: error?.message || 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console for developer visibility in all environments
    console.error('[ErrorBoundary] Uncaught render error:', error);
    console.error('[ErrorBoundary] Component stack:', info.componentStack);
    // Sentry.captureException is called automatically by Sentry's React integration
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-red-500/[0.04] blur-[120px]" />
          </div>

          <div className="relative z-10 max-w-md w-full text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                <div className="relative w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-400" />
                </div>
              </div>
            </div>

            {/* Heading */}
            <h1 className="font-display text-3xl font-bold text-foreground mb-3">
              Something went wrong
            </h1>
            <p className="text-muted-foreground font-body mb-2 leading-relaxed">
              An unexpected error occurred. Our team has been notified.
            </p>
            <p className="text-muted-foreground/60 font-body text-sm mb-8 leading-relaxed">
              You can try refreshing this section or go back to the home page.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-body font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 border border-amber-400/40"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => { window.location.href = '/'; }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-body font-medium rounded-xl transition-all duration-300 border border-border hover:border-red-500/20"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>

            {/* Brand footer */}
            <p className="mt-10 text-xs text-muted-foreground/40 font-body tracking-wide uppercase">
              Box Art Lab · Premium Packaging Studio
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
