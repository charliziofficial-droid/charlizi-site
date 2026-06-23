const fs = require('fs');
const path = require('path');

const categories = [
  { slug: 'bra-sets', name: 'Bra Sets', color: '#8B5CF6' },
  { slug: 'bras', name: 'Bras', color: '#EC4899' },
  { slug: 'plus-size-bras', name: 'Plus Size Bras', color: '#7C3AED' },
  { slug: 'panties', name: 'Panties', color: '#F59E0B' },
  { slug: 'silicone-bras', name: 'Silicone Bras', color: '#06B6D4' },
  { slug: 'shapewear', name: 'Shapewear', color: '#10B981' },
  { slug: 'sleepwear', name: 'Sleepwear & Dresses', color: '#3B82F6' },
];

const outDir = path.resolve(__dirname, '../public/factory/images');

categories.forEach(cat => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f8f6f3" />
      <stop offset="100%" style="stop-color:#ede8e0" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${cat.color};stop-opacity:0.12" />
      <stop offset="100%" style="stop-color:${cat.color};stop-opacity:0.04" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <circle cx="400" cy="290" r="200" fill="url(#accent)"/>
  <ellipse cx="400" cy="280" rx="80" ry="110" fill="white" opacity="0.5" stroke="${cat.color}30" stroke-width="1"/>
  <path d="M340 230 Q370 190 400 220 Q430 190 460 230 L470 370 Q400 380 330 370 Z" fill="white" stroke="${cat.color}50" stroke-width="1.5" opacity="0.8"/>
  <text x="400" y="470" text-anchor="middle" font-family="Inter, sans-serif" font-size="24" font-weight="600" fill="#1a1a2e">${cat.name}</text>
  <text x="400" y="500" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" fill="#8b8b8b">OEM / ODM Manufacturer</text>
  <text x="400" y="550" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#ccc" letter-spacing="4">CHARLIZI FACTORY</text>
</svg>`;
  const filePath = path.join(outDir, cat.slug + '.svg');
  // Also copy to .webp version (just copy svg content for now)
  fs.writeFileSync(filePath, svg);
  console.log('Created: ' + cat.slug + '.svg (' + svg.length + ' bytes)');
});

console.log('Done - created ' + categories.length + ' SVG product images');
