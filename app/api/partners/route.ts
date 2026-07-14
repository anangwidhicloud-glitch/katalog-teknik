import { NextRequest, NextResponse } from 'next/server';

import { getDatabase } from '@/lib/database/neon';
import { isAdminAuthenticated } from '@/lib/require-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type PartnerRow = {
  id: string;
  nama: string;
  urlLogo: string;
};

function normalizeName(value: unknown) {
  return typeof value === 'string' ? value.trim().slice(0, 120) : '';
}

function normalizeLogoUrl(value: unknown) {
  if (typeof value !== 'string') return null;

  try {
    const url = new URL(value.trim());

    if (
      url.protocol !== 'https:' ||
      url.hostname !== 'res.cloudinary.com'
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!origin) return true;

  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const sql = getDatabase();
    const rows = (await sql`
      SELECT
        id::text AS id,
        nama,
        url_logo AS "urlLogo"
      FROM partners
      WHERE
        nama IS NOT NULL
        AND BTRIM(nama) <> ''
        AND url_logo IS NOT NULL
        AND BTRIM(url_logo) <> ''
      ORDER BY id ASC
    `) as unknown as PartnerRow[];

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Gagal mengambil logo mitra:', error);

    return NextResponse.json(
      { message: 'Gagal mengambil logo mitra.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { message: 'Tidak memiliki akses.' },
      { status: 401 },
    );
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { message: 'Permintaan tidak valid.' },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const nama = normalizeName(body.nama);
    const urlLogo = normalizeLogoUrl(body.urlLogo);

    if (!nama) {
      return NextResponse.json(
        { message: 'Nama mitra wajib diisi.' },
        { status: 400 },
      );
    }

    if (!urlLogo) {
      return NextResponse.json(
        { message: 'Logo wajib diunggah melalui halaman admin.' },
        { status: 400 },
      );
    }

    const sql = getDatabase();
    const rows = (await sql`
      INSERT INTO partners (nama, url_logo)
      VALUES (${nama}, ${urlLogo})
      RETURNING
        id::text AS id,
        nama,
        url_logo AS "urlLogo"
    `) as unknown as PartnerRow[];

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Gagal menambah logo mitra:', error);

    return NextResponse.json(
      { message: 'Gagal menambah logo mitra.' },
      { status: 500 },
    );
  }
}
