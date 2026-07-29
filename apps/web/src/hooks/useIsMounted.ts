import { useEffect, useState } from 'react';

export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // oxlint-disable-next-line react/react-compiler
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  return isMounted;
}
