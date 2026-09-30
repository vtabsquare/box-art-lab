import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";

import { PackagingProvider } from "@/context/PackagingContext";
import { PricingProvider } from "@/context/PricingContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { GoogleOAuthProvider } from '@react-oauth/google';

// Lazy loaded page components to improve performance and code splitting
const QRLandingPage = lazy(() => import("./pages/QRLandingPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const Home = lazy(() => import("./pages/Home"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const StudioPage = lazy(() => import("./pages/StudioPage"));
const ThankYouPage = lazy(() => import("./pages/ThankYouPage"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const PageLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
  </div>
);

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const App = () => {
  const appContent = (
    <QueryClientProvider client={queryClient}>
        <PricingProvider>
          <PackagingProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                {/* Skip navigation — first focusable element for keyboard users */}
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-amber-500 focus:text-white focus:rounded-xl focus:font-semibold focus:shadow-lg"
                >
                  Skip to main content
                </a>
                <div id="main-content">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<QRLandingPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                      <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
                      <Route path="/studio" element={<ProtectedRoute><StudioPage /></ProtectedRoute>} />
                      <Route path="/thank-you" element={<ProtectedRoute><ThankYouPage /></ProtectedRoute>} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </PackagingProvider>
        </PricingProvider>
    </QueryClientProvider>
  );

  // Wrap with GoogleOAuthProvider only when a client ID is configured
  // This enables Google Sign-In (SSO) as an alternative to email OTP
  if (GOOGLE_CLIENT_ID) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {appContent}
      </GoogleOAuthProvider>
    );
  }

  return appContent;
};

export default App;
