'use client';

import { useCallback, useEffect, useState } from 'react';

type SheetRow = Record<string, unknown>;

type CacheEntry = {
  data: SheetRow[];
  expiresAt: number;
};

const CLIENT_CACHE_TTL = 20_000;
const responseCache = new Map<string, CacheEntry>();
const pendingRequests = new Map<string, Promise<SheetRow[]>>();

function buildApiUrl(sheetName?: string) {
  if (!sheetName) {
    return '/api/sheets';
  }

  return `/api/sheets?sheet=${encodeURIComponent(
    sheetName,
  )}`;
}

function wait(milliseconds: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, milliseconds),
  );
}

async function readErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as {
      message?: string;
    };

    if (payload.message) {
      return payload.message;
    }
  } catch {
    // Respons error tidak selalu berupa JSON.
  }

  return `Gagal mengambil data (HTTP ${response.status}).`;
}

async function requestSheetData(
  url: string,
  signal?: AbortSignal,
) {
  const cached = responseCache.get(url);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const existingRequest = pendingRequests.get(url);

  if (existingRequest) {
    return existingRequest;
  }

  const request = (async () => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const response = await fetch(url, {
          signal,
          cache: 'no-store',
        });

        if (!response.ok) {
          const message = await readErrorMessage(response);
          const error = new Error(message);

          if (
            response.status !== 429 &&
            response.status < 500
          ) {
            throw error;
          }

          lastError = error;
        } else {
          const result = (await response.json()) as unknown;

          if (!Array.isArray(result)) {
            throw new Error(
              'Format data yang diterima tidak valid.',
            );
          }

          const normalized = result as SheetRow[];

          responseCache.set(url, {
            data: normalized,
            expiresAt: Date.now() + CLIENT_CACHE_TTL,
          });

          return normalized;
        }
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === 'AbortError'
        ) {
          throw error;
        }

        lastError =
          error instanceof Error
            ? error
            : new Error(
                'Terjadi kesalahan saat memuat data.',
              );
      }

      if (attempt < 2) {
        await wait(500 * 2 ** attempt);
      }
    }

    throw (
      lastError ||
      new Error('Gagal mengambil data spreadsheet.')
    );
  })();

  pendingRequests.set(url, request);

  try {
    return await request;
  } finally {
    pendingRequests.delete(url);
  }
}

export function clearSheetDataCache(sheetName?: string) {
  responseCache.delete(buildApiUrl(sheetName));
}

/**
 * Mengambil data Google Sheets melalui API internal Next.js.
 * Permintaan yang sama digabung dan disimpan sementara agar tidak
 * membebani batas request SheetDB, terutama pada React Strict Mode.
 */
export function useSheetData(sheetName?: string) {
  const url = buildApiUrl(sheetName);
  const cached = responseCache.get(url);

  const [data, setData] = useState<SheetRow[]>(
    cached?.data ?? [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = useCallback(() => {
    responseCache.delete(url);
    setReloadKey((current) => current + 1);
  }, [url]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchData = async () => {
      const currentCache = responseCache.get(url);

      if (
        currentCache &&
        currentCache.expiresAt > Date.now()
      ) {
        setData(currentCache.data);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await requestSheetData(
          url,
          controller.signal,
        );

        if (active) {
          setData(result);
        }
      } catch (fetchError) {
        if (
          fetchError instanceof DOMException &&
          fetchError.name === 'AbortError'
        ) {
          return;
        }

        const message =
          fetchError instanceof Error
            ? fetchError.message
            : 'Terjadi kesalahan saat memuat data.';

        if (active) {
          setError(message);
        }

        // Gunakan warning agar kegagalan layanan eksternal tidak
        // memunculkan overlay Console Error pada Next.js development.
        console.warn('Sheet data warning:', message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
      controller.abort();
    };
  }, [reloadKey, url]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}
