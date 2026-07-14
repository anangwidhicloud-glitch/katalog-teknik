import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const analyticsDir = path.join(root, 'app', 'admin', 'analytics');
const pagePath = path.join(analyticsDir, 'page.tsx');
const internalPath = path.join(analyticsDir, 'InternalTrafficAnalytics.tsx');
const productPath = path.join(analyticsDir, 'ProductAnalytics.tsx');
const backupPath = path.join(analyticsDir, `page.before-merge-${Date.now()}.tsx.bak`);

if (!fs.existsSync(path.join(root, 'package.json'))) {
  throw new Error('Jalankan installer dari root project yang memiliki package.json.');
}
if (!fs.existsSync(pagePath)) {
  throw new Error('File app/admin/analytics/page.tsx tidak ditemukan.');
}

fs.mkdirSync(analyticsDir, { recursive: true });
const currentPage = fs.readFileSync(pagePath, 'utf8');
fs.copyFileSync(pagePath, backupPath);

// Halaman saat ini adalah analytics kunjungan internal.
let internalSource = currentPage.replace(
  'export default function AnalyticsPage()',
  'export default function InternalTrafficAnalytics()',
);
fs.writeFileSync(internalPath, internalSource, 'utf8');

// Ambil analytics produk asli dari checkpoint Git yang masih lengkap.
let productSource;
try {
  productSource = execFileSync(
    'git',
    ['show', 'b8ccf65:app/admin/analytics/page.tsx'],
    { cwd: root, encoding: 'utf8', windowsHide: true },
  );
} catch {
  throw new Error(
    'Gagal mengambil analytics produk dari commit b8ccf65. Pastikan project ini repository Git katalog-teknik dan commit tersebut tersedia.',
  );
}

productSource = productSource.replace(
  'export default function AnalyticsPage()',
  'export default function ProductAnalytics()',
);
fs.writeFileSync(productPath, productSource, 'utf8');

const wrapper = `'use client';

import { useState } from 'react';
import InternalTrafficAnalytics from './InternalTrafficAnalytics';
import ProductAnalytics from './ProductAnalytics';

type AnalyticsTab = 'produk' | 'kunjungan';

export default function AnalyticsPage() {
  const [tab, setTab] = useState<AnalyticsTab>('produk');

  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-2xl border border-white/10 bg-slate-950/60 p-1">
        <button
          type="button"
          onClick={() => setTab('produk')}
          className={
            tab === 'produk'
              ? 'rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950'
              : 'rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white'
          }
        >
          Analytics Produk
        </button>
        <button
          type="button"
          onClick={() => setTab('kunjungan')}
          className={
            tab === 'kunjungan'
              ? 'rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950'
              : 'rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white'
          }
        >
          Analytics Kunjungan
        </button>
      </div>

      {tab === 'produk' ? <ProductAnalytics /> : <InternalTrafficAnalytics />}
    </div>
  );
}
`;

fs.writeFileSync(pagePath, wrapper, 'utf8');

console.log('Berhasil menggabungkan Analytics Produk dan Analytics Kunjungan.');
console.log(`Backup halaman sebelumnya: ${path.relative(root, backupPath)}`);
console.log('Jalankan: npm run dev');
