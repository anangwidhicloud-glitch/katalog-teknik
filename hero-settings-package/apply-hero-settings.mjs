import fs from 'node:fs';
import path from 'node:path';

const targetFile = path.resolve(process.cwd(), 'app', '(main)', 'page.tsx');

if (!fs.existsSync(targetFile)) {
  console.error(`File tidak ditemukan: ${targetFile}`);
  console.error('Jalankan file ini dari folder utama proyek katalog-teknik.');
  process.exit(1);
}

let source = fs.readFileSync(targetFile, 'utf8');
const originalSource = source;

if (source.includes("useSheetData('Settings')") || source.includes('useSheetData("Settings")')) {
  console.error('Integrasi Settings pada hero tampaknya sudah pernah diterapkan. Tidak ada perubahan dilakukan.');
  process.exit(1);
}

function replaceOnce(label, pattern, replacement) {
  const matches = source.match(pattern);

  if (!matches) {
    console.error(`Bagian kode tidak ditemukan: ${label}`);
    console.error('Tidak ada perubahan yang disimpan. Pastikan page.tsx masih sama dengan versi repositori saat paket ini dibuat.');
    process.exit(1);
  }

  source = source.replace(pattern, replacement);
}

replaceOnce(
  'array words lama',
  /^const words[ \t]*=[ \t]*\["Standar Dunia",[ \t]*"Kualitas Premium",[ \t]*"Daya Tahan Tinggi",[ \t]*"Brand Terpercaya"\];\r?\n/m,
  ''
);

replaceOnce(
  'state activeCat',
  /(const \[activeCat, setActiveCat\] = useState\("All Produk"\);\r?\n)/,
  `$1
  const { data: settings } = useSheetData('Settings');

  const content = settings.reduce<Record<string, string>>((result, item: any) => {
    if (item.key) {
      result[item.key] = item.value ?? '';
    }

    return result;
  }, {});

  const defaultWords = [
    "Standar Dunia",
    "Kualitas Premium",
    "Daya Tahan Tinggi",
    "Brand Terpercaya",
  ];

  const sheetWords = [
    content.hero_word_1,
    content.hero_word_2,
    content.hero_word_3,
    content.hero_word_4,
  ]
    .map((word) => word?.trim())
    .filter((word): word is string => Boolean(word));

  const words = sheetWords.length > 0 ? sheetWords : defaultWords;
  const rotationSpeed = Math.max(Number(content.hero_rotation_speed) || 3000, 1000);
`
);

replaceOnce(
  'timer hero lama',
  /\/\/ Timer untuk teks berganti di Hero\r?\n[ \t]*useEffect\(\(\) => \{\r?\n[ \t]*const timer = setInterval\(\(\) => setIndex\(\(prev\) => \(prev \+ 1\) % words\.length\), 3000\);\r?\n[ \t]*return \(\) => clearInterval\(timer\);\r?\n[ \t]*\}, \[\]\);/,
  `// Timer untuk teks berganti di Hero
  useEffect(() => {
    setIndex(0);

    if (words.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, rotationSpeed);

    return () => clearInterval(timer);
  }, [words.length, rotationSpeed]);`
);

replaceOnce(
  'badge hero',
  /(^[ \t]*)AUTHORIZED DISTRIBUTOR RESMI([ \t]*$)/m,
  '$1{content.hero_badge || "AUTHORIZED DISTRIBUTOR RESMI"}$2'
);

replaceOnce(
  'judul hero',
  /<h1 className="text-6xl md:text-8xl font-bold mb-4">Temukan Solusi<\/h1>/,
  '<h1 className="text-6xl md:text-8xl font-bold mb-4">{content.hero_title || "Temukan Solusi"}</h1>'
);

replaceOnce(
  'kata dinamis dan akhiran hero',
  /\{words\[index\]\} Peralatan Anda/,
  '{words[index]} {content.hero_suffix || "Peralatan Anda"}'
);

replaceOnce(
  'deskripsi hero',
  /(^[ \t]*)Menyediakan automotive service equipment kelas dunia dan hand tools berstandar internasional untuk efisiensi maksimal\.([ \t]*$)/m,
  '$1{content.hero_description || "Menyediakan automotive service equipment kelas dunia dan hand tools berstandar internasional untuk efisiensi maksimal."}$2'
);

replaceOnce(
  'tombol Lihat Produk',
  /(^[ \t]*)Lihat Produk([ \t]*$)/m,
  '$1{content.hero_button_product || "Lihat Produk"}$2'
);

replaceOnce(
  'tombol Hubungi Kami',
  /(^[ \t]*)Hubungi Kami([ \t]*$)/m,
  '$1{content.hero_button_contact || "Hubungi Kami"}$2'
);

if (source === originalSource) {
  console.error('Tidak ada perubahan yang dibuat.');
  process.exit(1);
}

fs.writeFileSync(targetFile, source, 'utf8');

console.log('Berhasil memperbarui app/(main)/page.tsx.');
console.log('Hanya koneksi tulisan hero ke tab Settings yang ditambahkan.');
