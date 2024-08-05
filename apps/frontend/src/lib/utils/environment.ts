// @ts-ignore
export const isWeb = window && typeof window.__TAURI_INTERNALS__ === 'undefined';
// @ts-ignore
export const isDesktop = !isWeb && !('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);