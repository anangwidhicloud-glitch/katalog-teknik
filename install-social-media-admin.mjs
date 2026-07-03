import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = process.cwd();
const packageRoot = path.dirname(
  fileURLToPath(import.meta.url),
);
const templateRoot = path.join(
  packageRoot,
  'templates',
);

const packageJson = path.join(
  projectRoot,
  'package.json',
);

if (!fs.existsSync(packageJson)) {
  console.error(
    'package.json tidak ditemukan. Jalankan installer dari folder utama proyek.',
  );
  process.exit(1);
}

const timestamp = new Date()
  .toISOString()
  .replace(/[:.]/g, '-');

const backupRoot = path.join(
  projectRoot,
  `.social-media-backup-${timestamp}`,
);

let backupCreated = false;

function walk(directory) {
  const results = [];

  if (!fs.existsSync(directory)) {
    return results;
  }

  for (const entry of fs.readdirSync(
    directory,
    { withFileTypes: true },
  )) {
    if (
      entry.name === 'node_modules' ||
      entry.name === '.next' ||
      entry.name.startsWith(
        '.social-media-backup-',
      )
    ) {
      continue;
    }

    const fullPath = path.join(
      directory,
      entry.name,
    );

    if (entry.isDirectory()) {
      results.push(...walk(fullPath));
    } else {
      results.push(fullPath);
    }
  }

  return results;
}

function backupFile(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return;
  }

  const relative = path.relative(
    projectRoot,
    targetPath,
  );

  const backupPath = path.join(
    backupRoot,
    relative,
  );

  fs.mkdirSync(path.dirname(backupPath), {
    recursive: true,
  });

  fs.copyFileSync(targetPath, backupPath);
  backupCreated = true;
}

function writeFileSafely(targetPath, content) {
  backupFile(targetPath);
  fs.mkdirSync(path.dirname(targetPath), {
    recursive: true,
  });
  fs.writeFileSync(targetPath, content, 'utf8');
}

function findFooterFile() {
  const sourceFiles = walk(
    path.join(projectRoot, 'app'),
  ).filter((file) =>
    /\.(tsx|jsx)$/.test(file),
  );

  const exactMatch = sourceFiles.find(
    (file) => {
      const source = fs.readFileSync(
        file,
        'utf8',
      );

      return source.includes(
        'Kunjungi Sosial Media Kami',
      );
    },
  );

  if (exactMatch) {
    return exactMatch;
  }

  return sourceFiles.find((file) => {
    const source = fs.readFileSync(
      file,
      'utf8',
    ).toLowerCase();

    const labels = [
      'tiktok',
      'facebook',
      'youtube',
      'instagram',
    ].filter((label) =>
      source.includes(label),
    );

    return (
      labels.length === 4 &&
      file.toLowerCase().includes('footer')
    );
  });
}

function ensureClientDirective(source) {
  if (
    /^\s*['"]use client['"];?/m.test(source)
  ) {
    return source;
  }

  return `'use client';\n\n${source}`;
}

function addUseSheetDataImport(
  source,
  footerPath,
) {
  if (
    /import\s*\{\s*useSheetData\s*\}/.test(
      source,
    )
  ) {
    return source;
  }

  const hookPath = path.join(
    projectRoot,
    'app',
    'hooks',
    'useSheetData.ts',
  );

  if (!fs.existsSync(hookPath)) {
    throw new Error(
      'app/hooks/useSheetData.ts tidak ditemukan.',
    );
  }

  let relativeImport = path
    .relative(
      path.dirname(footerPath),
      hookPath,
    )
    .replace(/\\/g, '/')
    .replace(/\.ts$/, '');

  if (!relativeImport.startsWith('.')) {
    relativeImport = `./${relativeImport}`;
  }

  const importLine =
    `import { useSheetData } from '${relativeImport}';`;

  const directiveMatch = source.match(
    /^\s*['"]use client['"];?/,
  );

  if (directiveMatch) {
    const insertAt =
      directiveMatch.index +
      directiveMatch[0].length;

    return (
      source.slice(0, insertAt) +
      `\n\n${importLine}` +
      source.slice(insertAt)
    );
  }

  return `${importLine}\n${source}`;
}

function insertSettingsHook(source) {
  if (
    source.includes(
      'editableFooterSocialLinks',
    )
  ) {
    return source;
  }

  const patterns = [
    /export\s+default\s+function\s+\w*\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*\{/m,
    /function\s+Footer\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*\{/m,
    /(?:export\s+)?const\s+Footer\s*=\s*(?:\([^)]*\)|[^=]+)\s*=>\s*\{/m,
  ];

  let componentMatch = null;

  for (const pattern of patterns) {
    const match = source.match(pattern);
    if (match) {
      componentMatch = match;
      break;
    }
  }

  if (!componentMatch) {
    throw new Error(
      'Fungsi komponen Footer tidak berhasil dikenali. Tidak ada perubahan pada Footer.',
    );
  }

  const insertionPoint =
    componentMatch.index +
    componentMatch[0].length;

  const hookCode = `

  const { data: editableFooterSettings } =
    useSheetData('Settings');

  const editableFooterSettingsMap =
    Object.fromEntries(
      (
        editableFooterSettings as Array<{
          key?: string;
          value?: string;
        }>
      )
        .filter((item) => item.key)
        .map((item) => [
          item.key as string,
          item.value ?? '',
        ]),
    );

  const editableFooterSocialLinks = {
    tiktok:
      editableFooterSettingsMap.link_tiktok || '#',
    facebook:
      editableFooterSettingsMap.link_fb || '#',
    youtube:
      editableFooterSettingsMap.link_youtube || '#',
    instagram:
      editableFooterSettingsMap.link_instagram || '#',
  };
`;

  return (
    source.slice(0, insertionPoint) +
    hookCode +
    source.slice(insertionPoint)
  );
}

function replaceHrefInOpeningTag(
  openingTag,
  expression,
) {
  const hrefPattern =
    /\s+href\s*=\s*(?:"[^"]*"|'[^']*'|\{[\s\S]*?\})/i;

  let updated = hrefPattern.test(openingTag)
    ? openingTag.replace(
        hrefPattern,
        ` href={${expression}}`,
      )
    : openingTag.replace(
        /^<([A-Za-z][\w.]*)/,
        `<$1 href={${expression}}`,
      );

  if (!/\s+target\s*=/.test(updated)) {
    updated = updated.replace(
      />$/,
      ' target="_blank">',
    );
  }

  if (!/\s+rel\s*=/.test(updated)) {
    updated = updated.replace(
      />$/,
      ' rel="noopener noreferrer">',
    );
  }

  return updated;
}

function patchElementForLabel(
  source,
  label,
  expression,
) {
  const elementPattern =
    /<(a|Link)\b[^>]*>[\s\S]*?<\/\1>/gi;

  let match;

  while (
    (match = elementPattern.exec(source)) !==
    null
  ) {
    const element = match[0];

    if (
      !element
        .toLowerCase()
        .includes(label.toLowerCase())
    ) {
      continue;
    }

    const openingEnd = element.indexOf('>');

    if (openingEnd === -1) {
      continue;
    }

    const openingTag = element.slice(
      0,
      openingEnd + 1,
    );

    const updatedOpeningTag =
      replaceHrefInOpeningTag(
        openingTag,
        expression,
      );

    const updatedElement =
      updatedOpeningTag +
      element.slice(openingEnd + 1);

    return {
      source:
        source.slice(0, match.index) +
        updatedElement +
        source.slice(
          match.index + element.length,
        ),
      patched: true,
    };
  }

  return {
    source,
    patched: false,
  };
}

function patchFooter(original, footerPath) {
  let source = ensureClientDirective(original);
  source = addUseSheetDataImport(
    source,
    footerPath,
  );
  source = insertSettingsHook(source);

  const targets = [
    [
      'TikTok',
      'editableFooterSocialLinks.tiktok',
    ],
    [
      'Facebook',
      'editableFooterSocialLinks.facebook',
    ],
    [
      'YouTube',
      'editableFooterSocialLinks.youtube',
    ],
    [
      'Instagram',
      'editableFooterSocialLinks.instagram',
    ],
  ];

  const failed = [];

  for (const [label, expression] of targets) {
    const result = patchElementForLabel(
      source,
      label,
      expression,
    );

    source = result.source;

    if (!result.patched) {
      failed.push(label);
    }
  }

  if (failed.length > 0) {
    throw new Error(
      `Link berikut tidak ditemukan di Footer: ${failed.join(
        ', ',
      )}. Footer tidak diubah.`,
    );
  }

  return source;
}

function addSettingsShortcut(original) {
  if (
    original.includes('/admin/social-media')
  ) {
    return original;
  }

  let source = original;

  if (
    !/import\s+Link\s+from\s+['"]next\/link['"]/.test(
      source,
    )
  ) {
    const directive = source.match(
      /^\s*['"]use client['"];?/,
    );

    const importLine =
      "import Link from 'next/link';";

    if (directive) {
      const at =
        directive.index +
        directive[0].length;

      source =
        source.slice(0, at) +
        `\n${importLine}` +
        source.slice(at);
    } else {
      source =
        `${importLine}\n` + source;
    }
  }

  const returnMatch = source.match(
    /return\s*\(\s*/m,
  );

  if (!returnMatch) {
    return original;
  }

  const searchFrom =
    returnMatch.index +
    returnMatch[0].length;

  const rootMatch = source
    .slice(searchFrom)
    .match(/^(?:\s*)(<>|<(?:main|div|section)\b[^>]*>)/m);

  if (!rootMatch) {
    return original;
  }

  const rootEnd =
    searchFrom +
    rootMatch.index +
    rootMatch[0].length;

  const shortcut = `
        <div className="mb-6 flex justify-end">
          <Link
            href="/admin/social-media"
            className="inline-flex items-center rounded-xl border border-blue-400/25 bg-blue-500/10 px-4 py-2.5 text-sm font-semibold text-blue-200 transition hover:border-blue-400/40 hover:bg-blue-500/20"
          >
            Atur Link Sosial Media
          </Link>
        </div>
`;

  return (
    source.slice(0, rootEnd) +
    shortcut +
    source.slice(rootEnd)
  );
}

const footerPath = findFooterFile();

if (!footerPath) {
  console.error(
    'File Footer yang memuat teks "Kunjungi Sosial Media Kami" tidak ditemukan.',
  );
  console.error(
    'Tidak ada file proyek yang diubah.',
  );
  process.exit(1);
}

const footerOriginal = fs.readFileSync(
  footerPath,
  'utf8',
);

let footerUpdated;

try {
  footerUpdated = patchFooter(
    footerOriginal,
    footerPath,
  );
} catch (error) {
  console.error(
    error instanceof Error
      ? error.message
      : String(error),
  );
  console.error(
    'Tidak ada file proyek yang diubah.',
  );
  process.exit(1);
}

const adminTemplate = path.join(
  templateRoot,
  'app',
  'admin',
  'social-media',
  'page.tsx',
);

if (!fs.existsSync(adminTemplate)) {
  console.error(
    'Template halaman admin tidak ditemukan.',
  );
  process.exit(1);
}

const adminTarget = path.join(
  projectRoot,
  'app',
  'admin',
  'social-media',
  'page.tsx',
);

const settingsPath = path.join(
  projectRoot,
  'app',
  'admin',
  'settings',
  'page.tsx',
);

writeFileSafely(
  footerPath,
  footerUpdated,
);

writeFileSafely(
  adminTarget,
  fs.readFileSync(adminTemplate, 'utf8'),
);

let shortcutAdded = false;

if (fs.existsSync(settingsPath)) {
  const settingsOriginal = fs.readFileSync(
    settingsPath,
    'utf8',
  );

  const settingsUpdated =
    addSettingsShortcut(settingsOriginal);

  if (settingsUpdated !== settingsOriginal) {
    writeFileSafely(
      settingsPath,
      settingsUpdated,
    );
    shortcutAdded = true;
  }
}

console.log('');
console.log(
  '==========================================',
);
console.log(
  'ADMIN SOSIAL MEDIA BERHASIL DIPASANG',
);
console.log(
  '==========================================',
);
console.log('');
console.log(
  `Footer diperbarui: ${path.relative(
    projectRoot,
    footerPath,
  )}`,
);
console.log(
  'Halaman baru: app/admin/social-media/page.tsx',
);
console.log(
  `Tombol pada Settings: ${
    shortcutAdded
      ? 'berhasil ditambahkan'
      : 'tidak ditambahkan; buka /admin/social-media secara langsung'
  }`,
);
console.log('');
console.log(
  'Buka: http://localhost:3000/admin/social-media',
);
console.log('');
console.log(
  'Jika link YouTube atau Instagram belum ada pada tab Settings, halaman admin akan membuat barisnya saat tombol Simpan Semua ditekan.',
);

if (backupCreated) {
  console.log('');
  console.log(
    `Backup: ${path.basename(backupRoot)}`,
  );
}
