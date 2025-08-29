import React, { createContext, useContext, useState } from 'react';

type Payload = any;
type SPCatchContextType = {
  payload: Payload | null;
  setPayload: (p: Payload | null) => void;
};

const SPCatchContext = createContext<SPCatchContextType | undefined>(undefined);

export const SPCatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [payload, setPayload] = useState<Payload | null>(null);
  return (
    <SPCatchContext.Provider value={{ payload, setPayload }}>
      {children}
    </SPCatchContext.Provider>
  );
};

export const useSPCatch = () => {
  const ctx = useContext(SPCatchContext);
  if (!ctx) throw new Error('useSPCatch must be used inside SPCatchProvider');
  return ctx;
};
