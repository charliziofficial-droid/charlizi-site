// src/i18n/index.js
// i18n utility — provides translated strings to Astro pages

import locales from './index.json' with { type: 'json' };

// All supported locales
export const supportedLocales = locales;

// Default locale
export const defaultLocale = 'en';

// Map locale to its language file
const translations = {};
const loadCache = {};

async function loadLocale(locale) {
  if (loadCache[locale]) return loadCache[locale];
  
  try {
    const mod = await import(`./${locale}.js`);
    loadCache[locale] = mod.default;
    return mod.default;
  } catch {
    // Fallback to English
    const enMod = await import('./en.js');
    loadCache[locale] = enMod.default;
    return enMod.default;
  }
}

// Get translations for a locale (sync for SSG)
export function getTranslations(locale) {
  return loadCache[locale] || loadCache['en'];
}

// Preload all locales at build time
export async function preloadAllLocales() {
  for (const locale of Object.keys(locales)) {
    await loadLocale(locale);
  }
}
