'use client';

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { FormEvent } from 'react';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = (await response.json()) as {
        message?: string;
      };

      if (!response.ok) {
        setErrorMessage(result.message || 'Login gagal. Silakan coba kembali.');
        return;
      }

      router.replace('/admin');
      router.refresh();
    } catch {
      setErrorMessage('Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.20),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.15),transparent_38%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl items-stretch lg:grid-cols-[1.08fr_0.92fr]">
        <section className="hidden min-h-screen flex-col justify-between border-r border-white/10 px-12 py-12 lg:flex xl:px-16">
          <Link href="/" className="inline-flex w-fit items-center gap-3 text-white">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-blue-400/30 bg-blue-500/15 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
              <Wrench size={22} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-bold tracking-[0.18em]">KATALOG TEKNIK</span>
              <span className="block text-xs text-slate-400">Administration System</span>
            </span>
          </Link>

          <div className="max-w-xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              <ShieldCheck size={15} aria-hidden="true" />
              Area pengelolaan terbatas
            </div>

            <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight xl:text-6xl">
              Kelola katalog dengan
              <span className="block bg-gradient-to-r from-blue-300 via-sky-300 to-cyan-200 bg-clip-text text-transparent">
                aman dan efisien.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-slate-400">
              Masuk untuk mengelola produk, konten halaman, informasi kontak, dan pengaturan website
              dari satu dashboard.
            </p>

            <div className="mt-10 grid gap-4">
              {[
                'Akses admin dilindungi sesi terenkripsi',
                'Kredensial tidak dikirim ke browser',
                'Sesi berakhir otomatis setelah 8 jam',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 size={18} className="text-sky-300" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Katalog Teknik. Sistem internal perusahaan.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-blue-400/30 bg-blue-500/15">
                  <Wrench size={19} aria-hidden="true" />
                </span>
                Katalog Teknik
              </Link>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
              <div className="mb-8">
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-sky-400/25 bg-sky-400/10 text-sky-200">
                  <LockKeyhole size={23} aria-hidden="true" />
                </div>

                <p className="text-sm font-medium text-sky-300">Selamat datang kembali</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">Masuk ke Admin Panel</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Gunakan akun administrator yang telah dikonfigurasi.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="admin-email"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Email administrator
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      id="admin-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="admin@perusahaan.com"
                      className="h-[52px] w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-sky-400/60 focus:ring-4 focus:ring-sky-400/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="admin-password"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Kata sandi
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      id="admin-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Masukkan kata sandi"
                      className="h-[52px] w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-sky-400/60 focus:ring-4 focus:ring-sky-400/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-slate-200"
                    >
                      {showPassword ? (
                        <EyeOff size={18} aria-hidden="true" />
                      ) : (
                        <Eye size={18} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200"
                  >
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(37,99,235,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(37,99,235,0.35)] focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
                      Memverifikasi...
                    </>
                  ) : (
                    <>
                      Masuk ke Dashboard
                      <ShieldCheck size={18} aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-7 border-t border-white/10 pt-6">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  Kembali ke beranda
                </Link>
              </div>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-slate-500">
              Hanya pengguna berwenang yang diperbolehkan mengakses halaman ini.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
