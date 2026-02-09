import { useEffect } from 'react';

/**
 * Hook that manages visual viewport dimensions and updates a CSS variable
 * for stable viewport height across fullscreen and mobile browser changes.
 */
export function useVisualViewport() {
  useEffect(() => {
    const updateViewportHeight = () => {
      // Use visualViewport when available (better for mobile/fullscreen)
      const height = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${height}px`);
    };

    // Initial update
    updateViewportHeight();

    // Listen to various resize events
    window.addEventListener('resize', updateViewportHeight);
    window.visualViewport?.addEventListener('resize', updateViewportHeight);
    window.visualViewport?.addEventListener('scroll', updateViewportHeight);

    // Handle fullscreen changes
    document.addEventListener('fullscreenchange', updateViewportHeight);
    document.addEventListener('webkitfullscreenchange', updateViewportHeight);

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.visualViewport?.removeEventListener('resize', updateViewportHeight);
      window.visualViewport?.removeEventListener('scroll', updateViewportHeight);
      document.removeEventListener('fullscreenchange', updateViewportHeight);
      document.removeEventListener('webkitfullscreenchange', updateViewportHeight);
    };
  }, []);
}
