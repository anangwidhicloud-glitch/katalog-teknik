'use client';

import { Download, FileSpreadsheet, RotateCcw, ShieldAlert, Upload } from 'lucide-react';
import { ChangeEvent, useRef, useState } from 'react';

type RestoreResult = {
  success?: boolean;
  restored?: Record<string, number>;
  message?: string;
};

export default function BackupRestorePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
    setMessage('');
    setError('');
  }

  async function downloadBackup() {
    setBusy(true);
    setMessage('');
    setError('');
    try {
      const response = await fetch('/api/admin/backup', { cache: 'no-store' });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as RestoreResult | null;
        throw new Error(data?.message || 'Backup gagal dibuat.');
      }

      const blob = await response.blob();
      const disposition = response.headers.get('content-disposition') || '';
      const filename = disposition.match(/filename="([^"]+)"/)?.[1] || 'katalog-teknik-backup.xlsx';
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setMessage('Backup Excel berhasil diunduh. Simpan file di tempat yang aman.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Backup gagal dibuat.');
    } finally {
      setBusy(false);
    }
  }

  async function restoreBackup() {
    if (!file) {
      setError('Pilih file backup Excel terlebih dahulu.');
      return;
    }
    if (confirmation !== 'RESTORE') {
      setError('Ketik RESTORE untuk mengonfirmasi.');
      return;
    }

    setBusy(true);
    setMessage('');
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        body: formData,
      });
      const data = (await response.json()) as RestoreResult;
      if (!response.ok) throw new Error(data.message || 'Restore gagal.');

      const summary = Object.entries(data.restored || {})
        .map(([table, count]) => `${table}: ${count}`)
        .join(', ');
      setMessage(`Restore berhasil${summary ? ` — ${summary}` : ''}.`);
      setFile(null);
      setConfirmation('');
      if (inputRef.current) inputRef.current.value = '';
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'File backup tidak valid.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
          Super Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">Backup & Restore Data</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Simpan data produk, galeri, konten website, sosial media, dan logo mitra dalam file Excel
          yang dapat dibuka dan diperiksa. Akun admin dan kata sandi tidak ikut diekspor.
        </p>
      </div>

      {(message || error) && (
        <div
          className={`rounded-2xl border px-5 py-4 text-sm ${error ? 'border-red-500/30 bg-red-500/10 text-red-200' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'}`}
        >
          {error || message}
        </div>
      )}

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-800 bg-slate-950/55 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
            <Download size={22} />
          </div>
          <h2 className="mt-5 text-xl font-bold text-white">Buat Backup Excel</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Setiap tabel berada pada sheet terpisah agar mudah dibaca. File gambar tetap di
            Cloudinary; backup menyimpan URL dan public ID-nya.
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={downloadBackup}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet size={18} />
            {busy ? 'Memproses...' : 'Download Backup Excel'}
          </button>
        </article>

        <article className="rounded-3xl border border-amber-500/20 bg-slate-950/55 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-300">
            <RotateCcw size={22} />
          </div>
          <h2 className="mt-5 text-xl font-bold text-white">Restore Data</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Restore mengganti isi tabel yang terdapat dalam file backup. Gunakan file Excel asli
            yang dibuat oleh website ini.
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xlsx"
            onChange={selectFile}
            className="mt-5 block w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-slate-200"
          />
          {file && <p className="mt-2 text-xs text-slate-500">Dipilih: {file.name}</p>}

          <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="flex gap-3">
              <ShieldAlert className="mt-0.5 shrink-0 text-amber-300" size={18} />
              <div>
                <p className="text-sm font-semibold text-amber-200">Konfirmasi restore</p>
                <p className="mt-1 text-xs text-slate-400">
                  Ketik <strong className="text-white">RESTORE</strong> di bawah ini.
                </p>
              </div>
            </div>
            <input
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder="RESTORE"
              autoComplete="off"
              className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm font-semibold tracking-widest text-white outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="button"
            disabled={busy || !file || confirmation !== 'RESTORE'}
            onClick={restoreBackup}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Upload size={18} />
            {busy ? 'Memproses...' : 'Restore Sekarang'}
          </button>
        </article>
      </section>
    </main>
  );
}
