import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageRoot = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/, '$1'));
const sourceRoot = packageRoot;

function copy(relativePath) {
  const source = path.join(sourceRoot, relativePath);
  const destination = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });

  if (fs.existsSync(destination) && relativePath === 'app/admin/analytics/page.tsx') {
    fs.copyFileSync(destination, `${destination}.bak-before-internal-analytics`);
  }

  fs.copyFileSync(source, destination);
  console.log(`OK  ${relativePath}`);
}

if (!fs.existsSync(path.join(root, 'package.json'))) {
  throw new Error('Jalankan installer dari root project yang berisi package.json.');
}

[
  'app/(main)/components/InternalAnalyticsTracker.tsx',
  'app/api/analytics/track/route.ts',
  'app/api/admin/analytics/route.ts',
  'app/admin/analytics/page.tsx',
  'database/ensure-site-analytics-table.sql',
].forEach(copy);

const layoutPath = path.join(root, 'app/(main)/layout.tsx');
if (!fs.existsSync(layoutPath)) {
  throw new Error('File app/(main)/layout.tsx tidak ditemukan.');
}

let layout = fs.readFileSync(layoutPath, 'utf8');
fs.copyFileSync(layoutPath, `${layoutPath}.bak-before-internal-analytics`);

if (!layout.includes("InternalAnalyticsTracker")) {
  const importLine = "import InternalAnalyticsTracker from './components/InternalAnalyticsTracker';\n";
  const lastImportIndex = layout.lastIndexOf("import ");
  const importEnd = layout.indexOf('\n', lastImportIndex) + 1;
  layout = layout.slice(0, importEnd) + importLine + layout.slice(importEnd);

  const marker = '<HiddenAdminAccess />';
  if (layout.includes(marker)) {
    layout = layout.replace(marker, `${marker}\n      <InternalAnalyticsTracker />`);
  } else {
    const headerMarker = '<Header />';
    if (!layout.includes(headerMarker)) {
      throw new Error('Tidak menemukan titik pemasangan tracker di layout.');
    }
    layout = layout.replace(headerMarker, `${headerMarker}\n      <InternalAnalyticsTracker />`);
  }

  fs.writeFileSync(layoutPath, layout);
  console.log('OK  app/(main)/layout.tsx (tracker ditambahkan)');
} else {
  console.log('SKIP app/(main)/layout.tsx (tracker sudah ada)');
}

console.log('\nSELESAI. Jalankan SQL database/ensure-site-analytics-table.sql di Neon SQL Editor.');
