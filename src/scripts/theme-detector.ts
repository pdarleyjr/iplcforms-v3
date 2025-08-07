/**
 * Theme Detection Script
 * This script detects and applies the user's theme preference.
 * It must run before page render to prevent FOUC (Flash of Unstyled Content).
 */

export function initTheme() {
  const getThemePreference = () => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  
  const isDark = getThemePreference() === 'dark';
  document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
 
  if (typeof localStorage !== 'undefined') {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }
}

// Auto-initialize if this script is loaded directly
if (typeof window !== 'undefined') {
  initTheme();
}