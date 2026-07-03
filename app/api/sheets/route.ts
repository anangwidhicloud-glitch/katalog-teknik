import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const DEFAULT_SHEETDB_URL =
  'https://sheetdb.io/api/v1/1igtyf9vf5393';

function getUpstreamUrl(sheetName: string | null) {
  const baseUrl =
    process.env.SHEETDB_URL?.trim() ||
    DEFAULT_SHEETDB_URL;

  const upstreamUrl = new URL(baseUrl);

  if (sheetName) {
    upstreamUrl.searchParams.set('sheet', sheetName);
  }

  return upstreamUrl;
}

function getErrorMessage(
  responseText: string,
  status: number,
) {
  if (responseText.trim()) {
    try {
      const parsed = JSON.parse(responseText) as {
        message?: string;
        error?: string;
      };

      return (
        parsed.message ||
        parsed.error ||
        `SheetDB mengembalikan status ${status}.`
      );
    } catch {
      return responseText.slice(0, 240);
    }
  }

  return `SheetDB mengembalikan status ${status}.`;
}

export async function GET(request: NextRequest) {
  const sheetName =
    request.nextUrl.searchParams.get('sheet')?.trim() ||
    null;

  if (sheetName && sheetName.length > 100) {
    return NextResponse.json(
      {
        message: 'Nama sheet tidak valid.',
      },
      { status: 400 },
    );
  }

  try {
    const upstreamResponse = await fetch(
      getUpstreamUrl(sheetName),
      {
        headers: {
          Accept: 'application/json',
        },
        next: {
          revalidate: 20,
        },
      },
    );

    const responseText = await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        {
          message: getErrorMessage(
            responseText,
            upstreamResponse.status,
          ),
          upstreamStatus: upstreamResponse.status,
        },
        {
          status:
            upstreamResponse.status === 429
              ? 429
              : 502,
        },
      );
    }

    let result: unknown;

    try {
      result = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        {
          message:
            'Respons SheetDB bukan JSON yang valid.',
        },
        { status: 502 },
      );
    }

    if (!Array.isArray(result)) {
      return NextResponse.json(
        {
          message:
            'Format data SheetDB tidak sesuai. Data harus berupa array.',
        },
        { status: 502 },
      );
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control':
          'public, s-maxage=20, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Tidak dapat terhubung ke SheetDB.';

    return NextResponse.json(
      {
        message: `Koneksi ke SheetDB gagal: ${message}`,
      },
      { status: 502 },
    );
  }
}
