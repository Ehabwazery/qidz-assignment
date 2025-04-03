import React, { createContext, useContext } from 'react';
import { rootStore, RootStoreType } from '../stores';

const StoreContext = createContext<RootStoreType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StoreContext.Provider value={rootStore}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): RootStoreType => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store;
};
