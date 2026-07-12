import {
  NextRequest,
  NextResponse,
} from 'next/server';
import { z } from 'zod';

import { getDatabase } from '../../../lib/database/neon';
import { isAdminAuthenticated } from '../../../lib/require-admin';

export const runtime = 'nodejs';

const updateSettingSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1, 'Key pengaturan wajib diisi.')
    .max(100, 'Key pengaturan terlalu panjang.'),
  value: z
    .string()
    .max(10000, 'Nilai pengaturan terlalu panjang.'),
});

export async function GET() {
  try {
    const sql = getDatabase();

    const rows = await sql`
      SELECT
        key,
        value
      FROM settings
      ORDER BY key ASC
    `;

    return NextResponse.json(rows, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error(
      'Gagal memuat pengaturan Neon:',
      error,
    );

    return NextResponse.json(
      {
        message:
          'Database gagal memuat pengaturan.',
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      {
        message:
          'Sesi admin tidak valid atau sudah berakhir.',
      },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    const parsed =
      updateSettingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message:
            parsed.error.issues[0]?.message ||
            'Data pengaturan tidak valid.',
        },
        { status: 400 },
      );
    }

    const { key, value } = parsed.data;
    const sql = getDatabase();

    await sql`
      INSERT INTO settings (
        key,
        value,
        updated_at
      )
      VALUES (
        ${key},
        ${value},
        NOW()
      )
      ON CONFLICT (key)
      DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = NOW()
    `;

    return NextResponse.json({
      success: true,
      key,
    });
  } catch (error) {
    console.error(
      'Gagal menyimpan pengaturan Neon:',
      error,
    );

    return NextResponse.json(
      {
        message:
          'Database gagal menyimpan pengaturan.',
      },
      { status: 500 },
    );
  }
}
