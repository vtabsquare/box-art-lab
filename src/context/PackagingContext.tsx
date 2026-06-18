 
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PackagingState, defaultState, DesignConfig, BoxDimensions, Industry } from '@/lib/designRules';

interface PackagingContextType {
  state: PackagingState;
  update: (partial: Partial<PackagingState>) => void;
  textureUrl: string | null;
  setTextureUrl: (url: string | null) => void;
}

const PackagingContext = createContext<PackagingContextType | undefined>(undefined);

export const PackagingProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PackagingState>(defaultState);
  const [textureUrl, setTextureUrl] = useState<string | null>(null);

  const update = (partial: Partial<PackagingState>) => {
    setState((s) => ({ ...s, ...partial }));
  };

  return (
    <PackagingContext.Provider value={{ state, update, textureUrl, setTextureUrl }}>
      {children}
    </PackagingContext.Provider>
  );
};

export const usePackaging = () => {
  const context = useContext(PackagingContext);
  if (context === undefined) {
    throw new Error('usePackaging must be used within a PackagingProvider');
  }
  return context;
};
