import React, { createContext, useContext } from 'react';
import { rootStore, RootStoreType } from '../stores';
import AuthStore from '../stores/AuthStore';
import MoviesStore from '../stores/MoviesStore';

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

// Helper hooks for individual stores
export const useAuthStore = (): AuthStore => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useAuthStore must be used within a StoreProvider');
  }
  return store.authStore;
};

export const useMoviesStore = (): MoviesStore => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useMoviesStore must be used within a StoreProvider');
  }
  return store.moviesStore;
};
