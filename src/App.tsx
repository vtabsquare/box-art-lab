import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { PackagingProvider } from "@/context/PackagingContext";
import { PricingProvider } from "@/context/PricingContext";
import QRLandingPage from "./pages/QRLandingPage";
import RegisterPage from "./pages/RegisterPage";
import Home from "./pages/Home";
import ProductsPage from "./pages/ProductsPage";
import StudioPage from "./pages/StudioPage";
import ThankYouPage from "./pages/ThankYouPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <PricingProvider>
        <PackagingProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<QRLandingPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/studio" element={<StudioPage />} />
                <Route path="/thank-you" element={<ThankYouPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </PackagingProvider>
      </PricingProvider>
  </QueryClientProvider>
);

export default App;
