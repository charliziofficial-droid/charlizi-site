// Data loader — reads from JSON files (editable via Decap CMS)
// Falls back to the TypeScript constants for compatibility

import type { ProductCategory } from './b2b';

// Helper: safe JSON import
async function loadJSON<T>(path: string, fallback: T): Promise<T> {
  try {
    const mod = await import(path, { with: { type: 'json' } });
    return mod.default as T;
  } catch {
    return fallback;
  }
}

export const loadSiteContent = () => loadJSON('./site-content.json', {
  brandName: 'Charlizi',
  heroTitle: 'Your Intimate Apparel OEM/ODM Partner',
  heroSubtitle: '200+ skilled workers. BSCI & OEKO-TEX certified.',
  workers: '200+', area: '5,000㎡', annualOutput: '5M+',
  monthlyContainers: '40+', founded: '2018',
  logoSvg: 'M12 3c-1 0-3 2-3 4s2 3 4 3 3-1 3-3-2-4-4-4z M4 21c0-4 4-8 8-8s8 4 8 8',
});

export const loadStats = () => loadJSON('./stats.json', { 
  title: 'Factory Capacity', 
  tagline: 'By the Numbers',
  stats: [{ amount: '200+', title: 'Workers', desc: '' }],
});

export const loadImages = () => loadJSON('./images.json', {
  heroImage: '/images/hero-image.png',
  defaultImage: '/images/default.png',
});

export const loadProducts = (): Promise<{ categories: ProductCategory[] }> =>
  loadJSON('./products.json', { categories: [] });

export const loadFAQs = () => loadJSON('./faq.json', { title: 'FAQ', items: [] });

export const loadCertifications = () => loadJSON('./certifications.json', {
  title: 'Certifications', certifications: [],
});

export const loadProductionSteps = () => loadJSON('./production-steps.json', {
  title: 'Production', steps: [],
});
