'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

type SheetDataResult<T> = {
  data: T[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};
const resourceEndpoints: Record<string, string> = {
  products: '/api/products',
  gallery: '/api/gallery',
  settings: '/api/settings',
};

export function useSheetData<
  T = Record<string, unknown>,
>(
  resource: string,
): SheetDataResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);

  const fetchData = useCallback(
    async () => {
      setLoading(true);
      setError(null);

      try {
const endpoint =
  resourceEndpoints[
    resource.trim().toLowerCase()
  ];

if (!endpoint) {
  throw new Error(
    `Resource "${resource}" tidak tersedia.`,
  );
}

const response = await fetch(endpoint, {
  method: 'GET',
  cache: 'no-store',
});

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              `HTTP ${response.status}`,
          );
        }

        if (!Array.isArray(result)) {
          throw new Error(
            'Format data database tidak valid.',
          );
        }

        setData(result as T[]);
      } catch (fetchError) {
        const message =
          fetchError instanceof Error
            ? fetchError.message
            : 'Gagal mengambil data.';

        setError(message);
        console.warn(message);
      } finally {
        setLoading(false);
      }
    },
    [resource],
  );

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
}