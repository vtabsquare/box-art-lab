 
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { fetchLivePricing, invalidatePricingCache, LivePricingMap } from '@/lib/pricingService';

interface PricingContextValue {
  pricing: LivePricingMap;
  loading: boolean;
  lastUpdated: Date | null;
  refresh: () => void;
}

const PricingContext = createContext<PricingContextValue>({
  pricing: {},
  loading: true,
  lastUpdated: null,
  refresh: () => {},
});

export const PricingProvider = ({ children }: { children: ReactNode }) => {
  const [pricing, setPricing] = useState<LivePricingMap>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    if (forceRefresh) invalidatePricingCache();
    const data = await fetchLivePricing();
    setPricing(data);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  // Fetch on mount
  useEffect(() => {
    load();
  }, [load]);

  return (
    <PricingContext.Provider value={{ pricing, loading, lastUpdated, refresh: () => load(true) }}>
      {children}
    </PricingContext.Provider>
  );
};

export const usePricing = () => useContext(PricingContext);
