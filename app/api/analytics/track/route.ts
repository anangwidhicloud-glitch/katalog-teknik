import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getDatabase } from '@/lib/database/neon';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const payloadSchema = z.object({
  path: z.string().trim().min(1).max(500),
  sessionId: z.string().trim().min(8).max(80),
  referrer: z.string().trim().max(1000).nullable().optional(),
});

function normalizeReferrer(value?: string | null) {
  if (!value) return null;

  try {
    return new URL(value).hostname.slice(0, 300) || null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const payload = payloadSchema.parse(await request.json());

    if (
      !payload.path.startsWith('/') ||
      payload.path.startsWith('/admin') ||
      payload.path.startsWith('/api')
    ) {
      return new NextResponse(null, { status: 204 });
    }

    const userAgent = (request.headers.get('user-agent') || '').slice(0, 500);
    const sql = getDatabase();

    await sql`
      INSERT INTO site_page_views (
        path,
        session_id,
        referrer,
        user_agent
      ) VALUES (
        ${payload.path},
        ${payload.sessionId},
        ${normalizeReferrer(payload.referrer)},
        ${userAgent || null}
      )
    `;

    return new NextResponse(null, {
      status: 204,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Gagal menyimpan analytics:', error);
    return NextResponse.json({ message: 'Analytics tidak dapat disimpan.' }, { status: 400 });
  }
}
