// src/utils/browser.js

export const isBrowser = () => typeof window !== 'undefined';

export const safeWindow = () => (isBrowser() ? window : undefined);

export const safeDocument = () => (isBrowser() ? document : undefined);

export const safeLocation = () => (isBrowser() ? window.location : undefined);

export const safeBrowserAction = (action, fallback = null) => {
  if (isBrowser()) {
    try {
      return action();
    } catch (error) {
      console.error('Browser action failed:', error);
      return fallback;
    }
  }
  return fallback;
};