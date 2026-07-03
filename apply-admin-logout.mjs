import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const layoutPath = path.join(projectRoot, 'app', 'admin', 'layout.tsx');
const componentDir = path.join(
  projectRoot,
  'app',
  'admin',
  'components',
  'admin'
);
const componentPath = path.join(componentDir, 'AdminLogoutButton.tsx');

const componentSource = `'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/');
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      aria-label="Keluar dari halaman admin dan kembali ke beranda"
      className="fixed right-4 top-4 z-[100] inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 shadow-lg backdrop-blur-md transition hover:border-red-400/50 hover:bg-red-500/20 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 md:right-6 md:top-6"
    >
      <LogOut size={18} aria-hidden="true" />
      <span>Keluar</span>
    </button>
  );
}
`;

if (!fs.existsSync(layoutPath)) {
  console.error(`File tidak ditemukan: ${layoutPath}`);
  console.error('Jalankan script ini dari folder utama proyek katalog-teknik.');
  process.exit(1);
}

let layout = fs.readFileSync(layoutPath, 'utf8');

const importSingle =
  "import AdminLogoutButton from './components/admin/AdminLogoutButton';";
const importDouble =
  'import AdminLogoutButton from "./components/admin/AdminLogoutButton";';

if (!layout.includes(importSingle) && !layout.includes(importDouble)) {
  const importMatches = [...layout.matchAll(/^import .*?;?\s*$/gm)];

  if (importMatches.length === 0) {
    console.error('Tidak menemukan blok import pada app/admin/layout.tsx.');
    console.error('Tidak ada kode lama yang diubah.');
    process.exit(1);
  }

  const lastImport = importMatches[importMatches.length - 1];
  const insertPosition = lastImport.index + lastImport[0].length;

  layout =
    layout.slice(0, insertPosition) +
    `\n${importSingle}` +
    layout.slice(insertPosition);
}

if (!layout.includes('<AdminLogoutButton />')) {
  const childrenMarker = '{children}';
  const childrenPosition = layout.lastIndexOf(childrenMarker);

  if (childrenPosition === -1) {
    console.error(
      'Tidak menemukan {children} pada app/admin/layout.tsx.'
    );
    console.error(
      'Komponen tombol belum ditambahkan dan layout lama tidak disimpan.'
    );
    process.exit(1);
  }

  const lineStart = layout.lastIndexOf('\n', childrenPosition) + 1;
  const indentation =
    layout.slice(lineStart, childrenPosition).match(/^\s*/)?.[0] ?? '';

  layout =
    layout.slice(0, childrenPosition) +
    `<AdminLogoutButton />\n${indentation}` +
    layout.slice(childrenPosition);
}

fs.mkdirSync(componentDir, { recursive: true });
fs.writeFileSync(componentPath, componentSource, 'utf8');
fs.writeFileSync(layoutPath, layout, 'utf8');

console.log('Tombol Keluar berhasil ditambahkan.');
console.log('');
console.log('File baru:');
console.log('app/admin/components/admin/AdminLogoutButton.tsx');
console.log('');
console.log('File yang diperbarui:');
console.log('app/admin/layout.tsx');
console.log('');
console.log('Perubahan pada layout hanya:');
console.log('1. Import AdminLogoutButton');
console.log('2. <AdminLogoutButton /> sebelum {children}');
