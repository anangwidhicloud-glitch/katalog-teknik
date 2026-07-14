import { NextResponse } from 'next/server';

import { getDatabase } from '@/lib/database/neon';
import { isAdminAuthenticated } from '@/lib/require-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ViewRow = {
  path: string;
  session_id: string;
  referrer: string | null;
  user_agent: string | null;
  created_at: string | Date;
};

function deviceFromUserAgent(userAgent: string | null) {
  const value = (userAgent || '').toLowerCase();
  if (/ipad|tablet/.test(value)) return 'Tablet';
  if (/mobile|android|iphone|ipod/.test(value)) return 'Mobile';
  return 'Desktop';
}

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: 'Tidak diizinkan.' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const requestedDays = Number(url.searchParams.get('days') || '14');
    const days = [7, 14, 30].includes(requestedDays) ? requestedDays : 14;
    const sql = getDatabase();

    const rows = (await sql`
      SELECT path, session_id, referrer, user_agent, created_at
      FROM site_page_views
      WHERE created_at >= NOW() - (${days}::text || ' days')::interval
      ORDER BY created_at DESC
      LIMIT 20000
    `) as ViewRow[];

    const todayKey = new Date().toISOString().slice(0, 10);
    const uniqueSessions = new Set<string>();
    const todaySessions = new Set<string>();
    const pages = new Map<string, number>();
    const referrers = new Map<string, number>();
    const devices = new Map<string, number>();
    const daily = new Map<string, { views: number; sessions: Set<string> }>();

    for (let index = days - 1; index >= 0; index -= 1) {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - index);
      daily.set(date.toISOString().slice(0, 10), { views: 0, sessions: new Set() });
    }

    for (const row of rows) {
      const date = new Date(row.created_at).toISOString().slice(0, 10);
      uniqueSessions.add(row.session_id);
      pages.set(row.path, (pages.get(row.path) || 0) + 1);

      if (date === todayKey) todaySessions.add(row.session_id);

      if (row.referrer) {
        referrers.set(row.referrer, (referrers.get(row.referrer) || 0) + 1);
      }

      const device = deviceFromUserAgent(row.user_agent);
      devices.set(device, (devices.get(device) || 0) + 1);

      const bucket = daily.get(date);
      if (bucket) {
        bucket.views += 1;
        bucket.sessions.add(row.session_id);
      }
    }

    const sortedEntries = (map: Map<string, number>, limit = 8) =>
      [...map.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([name, value]) => ({ name, value }));

    return NextResponse.json(
      {
        days,
        totals: {
          views: rows.length,
          visitors: uniqueSessions.size,
          todayVisitors: todaySessions.size,
          pages: pages.size,
        },
        daily: [...daily.entries()].map(([date, value]) => ({
          date,
          views: value.views,
          visitors: value.sessions.size,
        })),
        topPages: sortedEntries(pages),
        referrers: sortedEntries(referrers),
        devices: sortedEntries(devices, 3),
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error('Gagal mengambil analytics:', error);
    return NextResponse.json(
      { message: 'Data analytics gagal dimuat. Pastikan tabel sudah dibuat.' },
      { status: 500 },
    );
  }
}
