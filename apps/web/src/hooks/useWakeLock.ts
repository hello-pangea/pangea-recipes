import { useCallback, useRef, useState } from 'react';

export interface WakeLockOptions {
  onError?: (error: Error) => void;
  onRequest?: () => void;
  onRelease?: EventListener;
}

export const useWakeLock = ({
  onError,
  onRequest,
  onRelease,
}: WakeLockOptions | undefined = {}) => {
  const [released, setReleased] = useState<boolean | undefined>();
  const wakeLock = useRef<WakeLockSentinel | null>(null);

  // https://caniuse.com/mdn-api_wakelock
  const isSupported = typeof window !== 'undefined' && 'wakeLock' in navigator;

  const request = useCallback(
    async (type: WakeLockType = 'screen') => {
      const isWakeLockAlreadyDefined = wakeLock.current != null;
      if (!isSupported) {
        // Calling the `request` function has no effect, Wake Lock Screen API isn't supported
        return;
      }
      if (isWakeLockAlreadyDefined) {
        // Calling `request` multiple times without `release` has no effect
        return;
      }

      try {
        wakeLock.current = await navigator.wakeLock.request(type);

        wakeLock.current.onrelease = (e: Event) => {
          // Default to `true` - `released` API is experimental: https://caniuse.com/mdn-api_wakelocksentinel_released
          setReleased(wakeLock.current?.released ?? true);
          if (onRelease) {
            onRelease(e);
          }
          wakeLock.current = null;
        };

        if (onRequest) {
          onRequest();
        }
        setReleased(wakeLock.current.released);
      } catch (error) {
        if (onError) {
          onError(error as Error);
        }
      }
    },
    [isSupported, onRequest, onError, onRelease],
  );

  const release = useCallback(async () => {
    const isWakeLockUndefined = wakeLock.current == null;
    if (!isSupported) {
      // Calling the `release` function has no effect, Wake Lock Screen API isn't supported
      return;
    }

    if (isWakeLockUndefined) {
      // Calling `release` before `request` has no effect.
      return;
    }

    if (wakeLock.current) {
      await wakeLock.current.release();
    }
  }, [isSupported]);

  return {
    isSupported,
    request,
    released,
    release,
    type: wakeLock.current?.type,
  };
};
