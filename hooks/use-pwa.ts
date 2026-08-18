import { useEffect } from 'react';
import { Platform } from 'react-native';

export function usePWA() {
  useEffect(() => {
    if (
      Platform.OS !== 'web' ||
      typeof navigator === 'undefined' ||
      !('serviceWorker' in navigator)
    ) {
      return;
    }

    window.addEventListener(
      'load',
      () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log(
              'PWA service worker registered:',
              registration.scope
            );
          })
          .catch((error) => {
            console.error(
              'PWA service worker registration failed:',
              error
            );
          });
      }
    );
  }, []);
}