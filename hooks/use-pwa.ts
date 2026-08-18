import { useEffect } from 'react';
import { Platform } from 'react-native';

export function usePWA() {
  useEffect(() => {
    if (
      Platform.OS !== 'web' ||
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator)
    ) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const baseUrl = '/budgeting-app';

        const registration =
          await navigator.serviceWorker.register(
            `${baseUrl}/sw.js`,
            {
              scope: `${baseUrl}/`,
            }
          );

        console.log(
          'PWA service worker registered:',
          registration.scope
        );
      } catch (error) {
        console.error(
          'PWA service worker registration failed:',
          error
        );
      }
    };

    if (document.readyState === 'loading') {
      window.addEventListener(
        'load',
        registerServiceWorker,
        { once: true }
      );

      return () => {
        window.removeEventListener(
          'load',
          registerServiceWorker
        );
      };
    }

    registerServiceWorker();
  }, []);
}