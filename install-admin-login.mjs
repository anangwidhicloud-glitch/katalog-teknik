import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = process.cwd();

const requiredProjectFile = path.join(
  root,
  'package.json',
);

if (!fs.existsSync(requiredProjectFile)) {
  console.error(
    'package.json tidak ditemukan. Jalankan installer dari folder utama proyek.',
  );
  process.exit(1);
}

const installerDirectory = path.dirname(
  fileURLToPath(import.meta.url),
);

const templatesRoot = path.join(
  installerDirectory,
  'templates',
);

const fileMappings = [
  ['lib/admin-auth.ts', 'lib/admin-auth.ts'],
  [
    'app/api/admin/login/route.ts',
    'app/api/admin/login/route.ts',
  ],
  [
    'app/api/admin/logout/route.ts',
    'app/api/admin/logout/route.ts',
  ],
  ['app/admin-login/layout.tsx', 'app/admin-login/layout.tsx'],
  ['app/admin-login/page.tsx', 'app/admin-login/page.tsx'],
];

const timestamp = new Date()
  .toISOString()
  .replace(/[:.]/g, '-');

const backupRoot = path.join(
  root,
  `.admin-login-backup-${timestamp}`,
);

let backupCreated = false;

function ensureBackup(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return;
  }

  const relativePath = path.relative(
    root,
    targetPath,
  );

  const backupPath = path.join(
    backupRoot,
    relativePath,
  );

  fs.mkdirSync(path.dirname(backupPath), {
    recursive: true,
  });

  fs.copyFileSync(targetPath, backupPath);
  backupCreated = true;
}

function copyTemplate(sourceRelative, targetRelative) {
  const sourcePath = path.join(
    templatesRoot,
    sourceRelative,
  );

  const targetPath = path.join(
    root,
    targetRelative,
  );

  if (!fs.existsSync(sourcePath)) {
    throw new Error(
      `Template tidak ditemukan: ${sourceRelative}`,
    );
  }

  ensureBackup(targetPath);

  fs.mkdirSync(path.dirname(targetPath), {
    recursive: true,
  });

  fs.copyFileSync(sourcePath, targetPath);
  console.log(`✓ ${targetRelative}`);
}

const existingProxy = path.join(root, 'proxy.ts');
const existingProxyJs = path.join(root, 'proxy.js');
const legacyMiddleware = path.join(
  root,
  'middleware.ts',
);
const legacyMiddlewareJs = path.join(
  root,
  'middleware.js',
);

if (
  fs.existsSync(existingProxyJs) ||
  fs.existsSync(legacyMiddleware) ||
  fs.existsSync(legacyMiddlewareJs)
) {
  console.error('');
  console.error(
    'Installer dihentikan karena proyek sudah memiliki proxy.js atau middleware.',
  );
  console.error(
    'Tidak ada file yang diubah. Gabungkan proteksi admin secara manual agar logika lama tidak tertimpa.',
  );
  process.exit(1);
}

if (fs.existsSync(existingProxy)) {
  const currentProxy = fs.readFileSync(
    existingProxy,
    'utf8',
  );

  if (
    !currentProxy.includes(
      "ADMIN_SESSION_COOKIE",
    )
  ) {
    console.error('');
    console.error(
      'Installer dihentikan karena proxy.ts sudah ada dan bukan milik paket ini.',
    );
    console.error(
      'Tidak ada file yang diubah. Gabungkan proteksi admin secara manual agar logika lama tidak tertimpa.',
    );
    process.exit(1);
  }
}

console.log(
  'Memasang autentikasi admin...\n',
);

try {
  for (const [source, target] of fileMappings) {
    copyTemplate(source, target);
  }

  copyTemplate('proxy.ts', 'proxy.ts');

  const logoutTarget = path.join(
    root,
    'app/admin/components/admin/AdminLogoutButton.tsx',
  );

  const logoutTemplate = path.join(
    templatesRoot,
    'app/admin/components/admin/AdminLogoutButton.tsx',
  );

  if (fs.existsSync(logoutTarget)) {
    ensureBackup(logoutTarget);
    fs.copyFileSync(
      logoutTemplate,
      logoutTarget,
    );
    console.log(
      '✓ app/admin/components/admin/AdminLogoutButton.tsx',
    );
  } else {
    fs.mkdirSync(path.dirname(logoutTarget), {
      recursive: true,
    });
    fs.copyFileSync(
      logoutTemplate,
      logoutTarget,
    );
    console.log(
      '✓ app/admin/components/admin/AdminLogoutButton.tsx',
    );

    const adminLayout = path.join(
      root,
      'app/admin/layout.tsx',
    );

    if (!fs.existsSync(adminLayout)) {
      throw new Error(
        'app/admin/layout.tsx tidak ditemukan.',
      );
    }

    ensureBackup(adminLayout);

    let layout = fs.readFileSync(
      adminLayout,
      'utf8',
    );

    const importLine =
      "import AdminLogoutButton from './components/admin/AdminLogoutButton';";

    if (
      !layout.includes('AdminLogoutButton')
    ) {
      const importMatches = [
        ...layout.matchAll(
          /^import .*?;?\s*$/gm,
        ),
      ];

      if (importMatches.length === 0) {
        throw new Error(
          'Blok import pada app/admin/layout.tsx tidak ditemukan.',
        );
      }

      const lastImport =
        importMatches[
          importMatches.length - 1
        ];

      const insertAt =
        lastImport.index +
        lastImport[0].length;

      layout =
        layout.slice(0, insertAt) +
        `\n${importLine}` +
        layout.slice(insertAt);

      const childrenIndex =
        layout.lastIndexOf('{children}');

      if (childrenIndex === -1) {
        throw new Error(
          '{children} pada app/admin/layout.tsx tidak ditemukan.',
        );
      }

      const lineStart =
        layout.lastIndexOf(
          '\n',
          childrenIndex,
        ) + 1;

      const indentation =
        layout
          .slice(lineStart, childrenIndex)
          .match(/^\s*/)?.[0] ?? '';

      layout =
        layout.slice(0, childrenIndex) +
        `<AdminLogoutButton />\n${indentation}` +
        layout.slice(childrenIndex);

      fs.writeFileSync(
        adminLayout,
        layout,
        'utf8',
      );

      console.log(
        '✓ app/admin/layout.tsx (hanya memasang tombol Keluar)',
      );
    }
  }

  const envPath = path.join(
    root,
    '.env.local',
  );

  let envContent = fs.existsSync(envPath)
    ? fs.readFileSync(envPath, 'utf8')
    : '';

  const hasEnvKey = (key) =>
    new RegExp(
      `^${key}=`,
      'm',
    ).test(envContent);

  const generatedEmail =
    'admin@katalogteknik.local';

  const generatedPassword =
    crypto
      .randomBytes(12)
      .toString('base64url');

  const generatedSecret =
    crypto
      .randomBytes(48)
      .toString('base64url');

  const additions = [];

  if (!hasEnvKey('ADMIN_EMAIL')) {
    additions.push(
      `ADMIN_EMAIL=${generatedEmail}`,
    );
  }

  if (!hasEnvKey('ADMIN_PASSWORD')) {
    additions.push(
      `ADMIN_PASSWORD=${generatedPassword}`,
    );
  }

  if (!hasEnvKey('ADMIN_AUTH_SECRET')) {
    additions.push(
      `ADMIN_AUTH_SECRET=${generatedSecret}`,
    );
  }

  if (additions.length > 0) {
    ensureBackup(envPath);

    const prefix =
      envContent.length > 0 &&
      !envContent.endsWith('\n')
        ? '\n'
        : '';

    const section =
      `${prefix}\n# Admin authentication\n` +
      `${additions.join('\n')}\n`;

    fs.appendFileSync(
      envPath,
      section,
      'utf8',
    );

    console.log('✓ .env.local');
  } else {
    console.log(
      '✓ .env.local sudah memiliki konfigurasi admin',
    );
  }

  console.log('');
  console.log(
    '========================================',
  );
  console.log(
    'LOGIN ADMIN BERHASIL DIPASANG',
  );
  console.log(
    '========================================',
  );
  console.log('');
  console.log(
    'Halaman login: http://localhost:3000/admin-login',
  );

  if (
    !hasEnvKey('ADMIN_EMAIL') ||
    !hasEnvKey('ADMIN_PASSWORD')
  ) {
    console.log('');
    console.log(
      'Kredensial yang dibuat:',
    );

    if (!hasEnvKey('ADMIN_EMAIL')) {
      console.log(
        `Email    : ${generatedEmail}`,
      );
    } else {
      console.log(
        'Email    : gunakan ADMIN_EMAIL yang sudah ada di .env.local',
      );
    }

    if (!hasEnvKey('ADMIN_PASSWORD')) {
      console.log(
        `Password : ${generatedPassword}`,
      );
    } else {
      console.log(
        'Password : gunakan ADMIN_PASSWORD yang sudah ada di .env.local',
      );
    }
  }

  console.log('');
  console.log(
    'Kredensial tersimpan di .env.local.',
  );
  console.log(
    'Restart server dengan: npm run dev',
  );

  if (backupCreated) {
    console.log('');
    console.log(
      `Backup file lama: ${path.basename(backupRoot)}`,
    );
  }
} catch (error) {
  console.error('');
  console.error(
    `Pemasangan gagal: ${
      error instanceof Error
        ? error.message
        : String(error)
    }`,
  );

  console.error(
    'Periksa backup yang dibuat sebelum mencoba kembali.',
  );

  process.exit(1);
}
