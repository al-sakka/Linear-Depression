import { useState, useEffect } from 'react';
import { useStore } from './store';

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    useStore.persist.rehydrate();
    setHydrated(true);
  }, []);
  return hydrated;
}
