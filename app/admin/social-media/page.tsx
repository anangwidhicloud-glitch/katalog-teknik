'use client';

import {
  CheckCircle2,
  ExternalLink,
  Facebook,
  Instagram,
  Link2,
  LoaderCircle,
  Music2,
  Save,
  Youtube,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useSheetData } from '../../hooks/useSheetData';

const SHEETDB_URL = 'https://sheetdb.io/api/v1/1igtyf9vf5393';

type SettingRow = {
  key?: string;
  value?: string;
};

type SocialKey =
  | 'link_tiktok'
  | 'link_fb'
  | 'link_youtube'
  | 'link_instagram';

type SocialValues = Record<SocialKey, string>;

const initialValues: SocialValues = {
  link_tiktok: '',
  link_fb: '',
  link_youtube: '',
  link_instagram: '',
};

const platforms = [
  {
    key: 'link_tiktok' as const,
    name: 'TikTok',
    description: 'Tautan menuju profil TikTok perusahaan.',
    placeholder: 'https://www.tiktok.com/@username',
    icon: Music2,
  },
  {
    key: 'link_fb' as const,
    name: 'Facebook',
    description: 'Tautan menuju halaman Facebook perusahaan.',
    placeholder: 'https://www.facebook.com/nama-halaman',
    icon: Facebook,
  },
  {
    key: 'link_youtube' as const,
    name: 'YouTube',
    description: 'Tautan menuju kanal YouTube perusahaan.',
    placeholder: 'https://www.youtube.com/@nama-channel',
    icon: Youtube,
  },
  {
    key: 'link_instagram' as const,
    name: 'Instagram',
    description: 'Tautan menuju profil Instagram perusahaan.',
    placeholder: 'https://www.instagram.com/username',
    icon: Instagram,
  },
];

function isValidWebUrl(value: string) {
  if (!value.trim()) {
    return true;
  }

  try {
    const parsedUrl = new URL(value);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

export default function SocialMediaSettingsPage() {
  const {
    data: settings,
    loading,
    error,
  } = useSheetData('Settings');

  const initialized = useRef(false);
  const [values, setValues] =
    useState<SocialValues>(initialValues);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');

  const rows = settings as SettingRow[];

  const existingKeys = useMemo(
    () =>
      new Set(
        rows
          .map((row) => row.key)
          .filter((key): key is string => Boolean(key)),
      ),
    [rows],
  );

  useEffect(() => {
    if (loading || initialized.current) {
      return;
    }

    const settingsMap = Object.fromEntries(
      rows
        .filter((row) => row.key)
        .map((row) => [row.key as string, row.value ?? '']),
    );

    setValues({
      link_tiktok: settingsMap.link_tiktok ?? '',
      link_fb: settingsMap.link_fb ?? '',
      link_youtube: settingsMap.link_youtube ?? '',
      link_instagram: settingsMap.link_instagram ?? '',
    });

    initialized.current = true;
  }, [loading, rows]);

  const invalidKeys = platforms
    .filter(
      (platform) =>
        !isValidWebUrl(values[platform.key]),
    )
    .map((platform) => platform.key);

  const handleChange = (
    key: SocialKey,
    value: string,
  ) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
    setStatus('idle');
    setMessage('');
  };

  const saveExistingSetting = async (
    key: SocialKey,
    value: string,
  ) => {
    const response = await fetch(
      `${SHEETDB_URL}/key/${encodeURIComponent(
        key,
      )}?sheet=Settings`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Gagal memperbarui ${key}.`,
      );
    }
  };

  const createSetting = async (
    key: SocialKey,
    value: string,
  ) => {
    const response = await fetch(
      `${SHEETDB_URL}?sheet=Settings`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [{ key, value }],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Gagal membuat pengaturan ${key}.`,
      );
    }
  };

  const handleSave = async () => {
    if (invalidKeys.length > 0 || isSaving) {
      return;
    }

    setIsSaving(true);
    setStatus('idle');
    setMessage('');

    try {
      for (const platform of platforms) {
        const value =
          values[platform.key].trim();

        if (existingKeys.has(platform.key)) {
          await saveExistingSetting(
            platform.key,
            value,
          );
        } else {
          await createSetting(
            platform.key,
            value,
          );
        }
      }

      setStatus('success');
      setMessage(
        'Link sosial media berhasil disimpan. Muat ulang beranda untuk melihat hasilnya.',
      );
    } catch (saveError) {
      console.error(saveError);
      setStatus('error');
      setMessage(
        saveError instanceof Error
          ? saveError.message
          : 'Gagal menyimpan link sosial media.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <LoaderCircle
            size={22}
            className="animate-spin"
            aria-hidden="true"
          />
          Memuat pengaturan sosial media...
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#101828] via-[#0d1524] to-[#090f1b] shadow-2xl">
        <div className="border-b border-white/10 px-6 py-7 sm:px-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
                <Link2
                  size={14}
                  aria-hidden="true"
                />
                Pengaturan Footer
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Link Sosial Media
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Ubah alamat TikTok, Facebook,
                YouTube, dan Instagram yang
                ditampilkan pada bagian footer
                website.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={
                isSaving ||
                invalidKeys.length > 0
              }
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(37,99,235,0.34)] focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSaving ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save
                    size={18}
                    aria-hidden="true"
                  />
                  Simpan Semua
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid gap-5 p-6 sm:p-8 lg:grid-cols-2">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const value = values[platform.key];
            const invalid =
              !isValidWebUrl(value);

            return (
              <article
                key={platform.key}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-white/15 hover:bg-white/[0.05]"
              >
                <div className="mb-5 flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-200">
                    <Icon
                      size={21}
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h2 className="font-semibold text-white">
                      {platform.name}
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {platform.description}
                    </p>
                  </div>
                </div>

                <label
                  htmlFor={platform.key}
                  className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-slate-400"
                >
                  URL {platform.name}
                </label>

                <div className="relative">
                  <Link2
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    aria-hidden="true"
                  />
                  <input
                    id={platform.key}
                    type="url"
                    inputMode="url"
                    value={value}
                    onChange={(event) =>
                      handleChange(
                        platform.key,
                        event.target.value,
                      )
                    }
                    placeholder={
                      platform.placeholder
                    }
                    aria-invalid={invalid}
                    className={`w-full rounded-xl border bg-black/20 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-650 ${
                      invalid
                        ? 'border-red-400/60 focus:ring-4 focus:ring-red-500/10'
                        : 'border-white/10 hover:border-white/20 focus:border-sky-400/60 focus:ring-4 focus:ring-sky-400/10'
                    }`}
                  />

                  {value &&
                    isValidWebUrl(value) && (
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Buka ${platform.name}`}
                        className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white"
                      >
                        <ExternalLink
                          size={17}
                          aria-hidden="true"
                        />
                      </a>
                    )}
                </div>

                {invalid && (
                  <p className="mt-2 text-xs text-red-300">
                    Gunakan URL lengkap, misalnya
                    https://...
                  </p>
                )}
              </article>
            );
          })}
        </div>

        <div className="border-t border-white/10 px-6 py-5 sm:px-8">
          {error && (
            <div className="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              Gagal memuat Settings: {error}
            </div>
          )}

          {message && (
            <div
              role="status"
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
                status === 'success'
                  ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200'
                  : 'border-red-400/20 bg-red-500/10 text-red-200'
              }`}
            >
              {status === 'success' && (
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />
              )}
              {message}
            </div>
          )}

          <p className="text-xs leading-5 text-slate-500">
            Kolom yang dikosongkan akan membuat
            link terkait tidak aktif. Perubahan
            disimpan pada tab Settings yang sama
            dengan pengaturan footer lainnya.
          </p>
        </div>
      </section>
    </main>
  );
}
