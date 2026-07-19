import { config } from 'dotenv';
import { parse } from 'csv-parse/sync';
import fs from 'node:fs';
import path from 'node:path';
import { neon } from '@neondatabase/serverless';

config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL tidak ditemukan.');
}

const sql = neon(databaseUrl);
const dataDirectory = path.resolve(process.cwd(), 'migration-data');

type CsvRow = Record<string, string>;

function readCsv(filename: string): CsvRow[] {
  const filePath = path.join(dataDirectory, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`Lewati ${filename}: file tidak ada.`);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');

  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as CsvRow[];
}

function toNumber(value: string | undefined, fallback = 0) {
  if (!value) return fallback;

  const normalized = value.replace(/[^\d,.-]/g, '').replace(',', '.');

  const result = Number(normalized);

  return Number.isFinite(result) ? result : fallback;
}

function toBoolean(value: string | undefined) {
  return ['true', '1', 'yes', 'ya'].includes(
    String(value ?? '')
      .trim()
      .toLowerCase(),
  );
}

async function importProducts() {
  const rows = readCsv('Products.csv');

  for (const row of rows) {
    const legacyNo = toNumber(row.No);

    if (!row['Nama Produk']?.trim()) {
      continue;
    }

    await sql`
      INSERT INTO products (
        legacy_no,
        name,
        main_category,
        second_category,
        sub_category,
        price,
        rating,
        image_url,
        is_best_seller,
        updated_at
      )
      VALUES (
        ${legacyNo},
        ${row['Nama Produk'].trim()},
        ${row['Kategori Utama']?.trim() || 'Lainnya'},
        ${row['Kategori Kedua']?.trim() || 'Lainnya'},
        ${row['Sub Kategori']?.trim() || 'Lainnya'},
        ${Math.round(toNumber(row.Harga))},
        ${toNumber(row.Rating)},
        ${row.Foto_URL?.trim() || ''},
        ${toBoolean(row.Terlaris)},
        NOW()
      )
      ON CONFLICT (legacy_no)
      DO UPDATE SET
        name = EXCLUDED.name,
        main_category = EXCLUDED.main_category,
        second_category = EXCLUDED.second_category,
        sub_category = EXCLUDED.sub_category,
        price = EXCLUDED.price,
        rating = EXCLUDED.rating,
        image_url = EXCLUDED.image_url,
        is_best_seller = EXCLUDED.is_best_seller,
        updated_at = NOW()
    `;
  }

  console.log(`Products selesai: ${rows.length} baris.`);
}

async function importSettings() {
  const rows = readCsv('Settings.csv');

  for (const row of rows) {
    if (!row.key?.trim()) continue;

    await sql`
      INSERT INTO settings (
        key,
        value,
        updated_at
      )
      VALUES (
        ${row.key.trim()},
        ${row.value ?? ''},
        NOW()
      )
      ON CONFLICT (key)
      DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = NOW()
    `;
  }

  console.log(`Settings selesai: ${rows.length} baris.`);
}

async function importGallery() {
  const rows = readCsv('Gallery.csv');

  for (const [index, row] of rows.entries()) {
    if (!row.id?.trim()) continue;

    await sql`
      INSERT INTO gallery (
        id,
        title,
        category,
        location,
        image_url,
        sort_order,
        updated_at
      )
      VALUES (
        ${row.id.trim()},
        ${row.title?.trim() || ''},
        ${row.category?.trim() || ''},
        ${row.location?.trim() || ''},
        ${row.image_url?.trim() || ''},
        ${index},
        NOW()
      )
      ON CONFLICT (id)
      DO UPDATE SET
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        location = EXCLUDED.location,
        image_url = EXCLUDED.image_url,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    `;
  }

  console.log(`Gallery selesai: ${rows.length} baris.`);
}

async function importServices() {
  const rows = readCsv('Services.csv');

  for (const [index, row] of rows.entries()) {
    if (!row.id?.trim()) continue;

    await sql`
      INSERT INTO services (
        id,
        title,
        description,
        icon_name,
        sort_order,
        updated_at
      )
      VALUES (
        ${row.id.trim()},
        ${row.title?.trim() || ''},
        ${row.desc?.trim() || ''},
        ${row.icon_name?.trim() || ''},
        ${index},
        NOW()
      )
      ON CONFLICT (id)
      DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        icon_name = EXCLUDED.icon_name,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    `;
  }

  console.log(`Services selesai: ${rows.length} baris.`);
}

async function importCustomers() {
  const rows = readCsv('Customers.csv');

  for (const [index, row] of rows.entries()) {
    const name = row.Nama_Customer?.trim();

    if (!name) continue;

    await sql`
      INSERT INTO customers (
        name,
        logo_url,
        sort_order,
        updated_at
      )
      VALUES (
        ${name},
        ${row.Logo_Url?.trim() || ''},
        ${index},
        NOW()
      )
      ON CONFLICT (name)
      DO UPDATE SET
        logo_url = EXCLUDED.logo_url,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    `;
  }

  console.log(`Customers selesai: ${rows.length} baris.`);
}

async function main() {
  console.log('Memulai migrasi CSV ke Neon...\n');

  await importProducts();
  await importSettings();
  await importGallery();
  await importServices();
  await importCustomers();

  console.log('\nMigrasi selesai.');
}

main().catch((error) => {
  console.error('Migrasi gagal:', error);
  process.exit(1);
});
