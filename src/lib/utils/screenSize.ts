import { derived, writable } from 'svelte/store';

// must be defined here to avoid circular dependencies
export const screenSizeStore = writable({ width: window.innerWidth, height: window.innerHeight });

export const isSmallScreen = derived(screenSizeStore, $screenSize => $screenSize.width >= 640);
export const isMediumScreen = derived(screenSizeStore, $screenSize => $screenSize.width >= 768);
export const isLargeScreen = derived(screenSizeStore, $screenSize => $screenSize.width >= 1024);
export const isXLScreen = derived(screenSizeStore, $screenSize => $screenSize.width >= 1280);
export const isXXLScreen = derived(screenSizeStore, $screenSize => $screenSize.width >= 1536);
