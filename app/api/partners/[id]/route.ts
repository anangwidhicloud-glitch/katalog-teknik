import { NextRequest, NextResponse } from 'next/server';

import cloudinary from '@/lib/cloudinary';
import { getDatabase } from '@/lib/database/neon';
import { isAdminAuthenticated } from '@/lib/require-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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

    if (url.protocol !== 'https:' || url.hostname !== 'res.cloudinary.com') {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function getPartnerPublicId(urlValue: string | null | undefined) {
  if (!urlValue) return null;

  try {
    const url = new URL(urlValue);

    if (url.hostname !== 'res.cloudinary.com') return null;

    const segments = url.pathname.split('/').filter(Boolean);
    const uploadIndex = segments.indexOf('upload');

    if (uploadIndex < 0) return null;

    const afterUpload = segments.slice(uploadIndex + 1);
    const versionIndex = afterUpload.findIndex((segment) => /^v\d+$/.test(segment));
    const publicIdSegments = versionIndex >= 0 ? afterUpload.slice(versionIndex + 1) : afterUpload;

    const publicId = decodeURIComponent(publicIdSegments.join('/')).replace(/\.[^/.]+$/, '');

    return publicId.startsWith('katalog-teknik/partners/') ? publicId : null;
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

async function deleteCloudinaryLogo(urlLogo: string | null | undefined) {
  const publicId = getPartnerPublicId(urlLogo);

  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: 'image',
    });
  } catch (error) {
    console.error('Gagal menghapus logo mitra dari Cloudinary:', error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: 'Tidak memiliki akses.' }, { status: 401 });
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: 'Permintaan tidak valid.' }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const nama = normalizeName(body.nama);
    const urlLogo = normalizeLogoUrl(body.urlLogo);

    if (!nama) {
      return NextResponse.json({ message: 'Nama mitra wajib diisi.' }, { status: 400 });
    }

    if (!urlLogo) {
      return NextResponse.json({ message: 'Logo wajib tersedia.' }, { status: 400 });
    }

    const sql = getDatabase();
    const existingRows = (await sql`
      SELECT
        id::text AS id,
        nama,
        url_logo AS "urlLogo"
      FROM partners
      WHERE id::text = ${id}
      LIMIT 1
    `) as unknown as PartnerRow[];

    const existing = existingRows[0];

    if (!existing) {
      return NextResponse.json({ message: 'Mitra tidak ditemukan.' }, { status: 404 });
    }

    const rows = (await sql`
      UPDATE partners
      SET
        nama = ${nama},
        url_logo = ${urlLogo}
      WHERE id::text = ${id}
      RETURNING
        id::text AS id,
        nama,
        url_logo AS "urlLogo"
    `) as unknown as PartnerRow[];

    if (existing.urlLogo !== urlLogo) {
      await deleteCloudinaryLogo(existing.urlLogo);
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Gagal memperbarui logo mitra:', error);

    return NextResponse.json({ message: 'Gagal memperbarui logo mitra.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: 'Tidak memiliki akses.' }, { status: 401 });
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: 'Permintaan tidak valid.' }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const sql = getDatabase();
    const rows = (await sql`
      DELETE FROM partners
      WHERE id::text = ${id}
      RETURNING
        id::text AS id,
        nama,
        url_logo AS "urlLogo"
    `) as unknown as PartnerRow[];

    const deleted = rows[0];

    if (!deleted) {
      return NextResponse.json({ message: 'Mitra tidak ditemukan.' }, { status: 404 });
    }

    await deleteCloudinaryLogo(deleted.urlLogo);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Gagal menghapus logo mitra:', error);

    return NextResponse.json({ message: 'Gagal menghapus logo mitra.' }, { status: 500 });
  }
}
