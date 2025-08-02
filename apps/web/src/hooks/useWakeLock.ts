import * as React from 'react';

// Source: https://github.com/jorisre/react-screen-wake-lock/blob/main/src/use-wake-lock.ts
// Modified to fix this issue: https://github.com/jorisre/react-screen-wake-lock/issues/281

const warn = (content: string) => {
  console.warn('[react-screen-wake-lock]: ' + content);
};

export interface WakeLockOptions {
  onError?: (error: Error) => void;
  onRequest?: () => void;
  onRelease?: EventListener;
  reacquireOnPageVisible?: boolean;
}

export const useWakeLock = ({
  onError,
  onRequest,
  onRelease,
  reacquireOnPageVisible = false,
}: WakeLockOptions | undefined = {}) => {
  const [released, setReleased] = React.useState<boolean | undefined>();
  const wakeLock = React.useRef<WakeLockSentinel | null>(null);
  const wasWakeLockRequested = React.useRef(false);

  // https://caniuse.com/mdn-api_wakelock
  const isSupported = typeof window !== 'undefined' && 'wakeLock' in navigator;

  const request = React.useCallback(
    async (type: WakeLockType = 'screen') => {
      const isWakeLockAlreadyDefined = wakeLock.current != null;
      if (!isSupported) {
        warn(
          "Calling the `request` function has no effect, Wake Lock Screen API isn't supported",
        );
        return;
      }
      if (isWakeLockAlreadyDefined) {
        warn(
          'Calling `request` multiple times without `release` has no effect',
        );
        return;
      }

      try {
        wakeLock.current = await navigator.wakeLock.request(type);
        wasWakeLockRequested.current = true;

        wakeLock.current.onrelease = (e: Event) => {
          // Default to `true` - `released` API is experimental: https://caniuse.com/mdn-api_wakelocksentinel_released
          setReleased(wakeLock.current?.released || true);
          onRelease?.(e);
          wakeLock.current = null;
        };

        onRequest?.();
        setReleased(wakeLock.current.released || false);
      } catch (error: unknown) {
        onError?.(error as Error);
      }
    },
    [isSupported, onRequest, onError, onRelease],
  );

  const release = React.useCallback(async () => {
    const isWakeLockUndefined = wakeLock.current === null;
    if (!isSupported) {
      warn(
        "Calling the `release` function has no effect, Wake Lock Screen API isn't supported",
      );
      return;
    }

    if (isWakeLockUndefined) {
      warn('Calling `release` before `request` has no effect.');
      return;
    }

    if (wakeLock.current) {
      await wakeLock.current.release();
      wasWakeLockRequested.current = false;
    }
  }, [isSupported]);

  React.useEffect(() => {
    if (reacquireOnPageVisible) {
      const handleVisibilityChange = async () => {
        if (
          wakeLock.current === null &&
          document.visibilityState === 'visible' &&
          wasWakeLockRequested.current
        ) {
          try {
            await request();
          } catch (error: unknown) {
            onError?.(error as Error);
          }
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange,
        );
      };
    }
    return undefined;
  }, [reacquireOnPageVisible, request, onError]);

  return {
    isSupported,
    request,
    released,
    release,
    type: wakeLock.current?.type || undefined,
  };
};
