'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Boxes,
  ChevronDown,
  Filter,
  LoaderCircle,
  PackageOpen,
  Search,
  Star,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

type ProductRow = {
  No?: string;
  'Nama Produk'?: string;
  'Kategori Utama'?: string;
  'Kategori Kedua'?: string;
  'Sub Kategori'?: string;
  Harga?: string;
  Rating?: string;
  Foto_URL?: string;
  Terlaris?: string;
};

const SHEETDB_URL = 'https://sheetdb.io/api/v1/89uva05es1czu';

function formatCurrency(value?: string) {
  const number = Number(String(value ?? '').replace(/[^0-9.-]/g, ''));

  if (!Number.isFinite(number)) return value || '—';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number);
}

function isTruthy(value?: string) {
  return ['true', 'ya', 'yes', '1'].includes(String(value ?? '').trim().toLowerCase());
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua kategori');

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(SHEETDB_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Data produk tidak dapat dimuat.');
        }

        const data = (await response.json()) as ProductRow[];
        setProducts(Array.isArray(data) ? data : []);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;

        console.error('Error fetching data:', requestError);
        setError(requestError instanceof Error ? requestError.message : 'Terjadi kesalahan saat memuat produk.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(
      products
        .map((product) => product['Kategori Utama']?.trim())
        .filter((value): value is string => Boolean(value)),
    );

    return ['Semua kategori', ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = category === 'Semua kategori' || product['Kategori Utama'] === category;
      const searchable = [
        product['Nama Produk'],
        product['Kategori Utama'],
        product['Kategori Kedua'],
        product['Sub Kategori'],
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return matchesCategory && (!keyword || searchable.includes(keyword));
    });
  }, [category, products, search]);

  const bestSellerCount = products.filter((product) => isTruthy(product.Terlaris)).length;

  return (
    <div className="space-y-6">
      <section className="admin-panel relative overflow-hidden rounded-[26px] px-6 py-7 sm:px-8">
        <div aria-hidden="true" className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-300/15 bg-blue-400/[0.07] px-3 py-1.5 text-xs font-semibold text-blue-200">
              <Boxes className="h-3.5 w-3.5" />
              Data katalog
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Manajemen Produk</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Telusuri produk yang tersimpan pada Google Sheets tanpa mengubah struktur data yang sudah digunakan website.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-600">Total produk</p>
              <p className="mt-1 text-xl font-semibold text-white">{loading ? '—' : products.length}</p>
            </div>
            <div className="rounded-2xl border border-amber-300/10 bg-amber-400/[0.045] px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-amber-200/45">Terlaris</p>
              <p className="mt-1 text-xl font-semibold text-amber-100">{loading ? '—' : bestSellerCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-panel rounded-[24px] p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-600" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama atau kategori produk..."
              className="admin-field h-12 rounded-xl pl-11 pr-11 text-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Hapus pencarian"
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-600 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="relative lg:w-64">
            <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="admin-field h-12 appearance-none rounded-xl pl-11 pr-10 text-sm"
            >
              {categories.map((item) => (
                <option key={item} value={item} className="bg-[#0b1626]">
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs text-slate-600">
          <span>
            Menampilkan <strong className="font-semibold text-slate-400">{filteredProducts.length}</strong> dari {products.length} produk
          </span>
          {(search || category !== 'Semua kategori') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategory('Semua kategori');
              }}
              className="font-semibold text-sky-300 transition hover:text-sky-200"
            >
              Reset filter
            </button>
          )}
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-300/15 bg-red-400/[0.06] px-5 py-4 text-sm text-red-100">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
          {error}
        </div>
      )}

      <section className="admin-panel overflow-hidden rounded-[24px]">
        {loading ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 text-slate-500">
            <LoaderCircle className="h-7 w-7 animate-spin text-sky-300" />
            <p className="text-sm">Memuat produk dari Google Sheets...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.035] text-slate-600">
              <PackageOpen className="h-7 w-7" />
            </span>
            <h3 className="mt-5 font-semibold text-slate-200">Produk tidak ditemukan</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Coba gunakan kata kunci lain atau kembalikan filter kategori ke semua kategori.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto admin-scrollbar">
            <table className="w-full min-w-[960px] text-left">
              <thead>
                <tr className="border-b border-white/[0.07] bg-white/[0.025] text-[10px] font-bold uppercase tracking-[0.13em] text-slate-600">
                  <th className="px-6 py-4">Produk</th>
                  <th className="px-4 py-4">Kategori</th>
                  <th className="px-4 py-4">Harga</th>
                  <th className="px-4 py-4">Rating</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Nomor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.055]">
                <AnimatePresence initial={false}>
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={`${product.No ?? index}-${product['Nama Produk'] ?? 'product'}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="group transition hover:bg-sky-400/[0.025]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035]">
                            {product.Foto_URL ? (
                              <Image
                                src={product.Foto_URL}
                                alt={product['Nama Produk'] || 'Produk'}
                                fill
                                sizes="56px"
                                className="object-cover transition duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <Boxes className="absolute inset-0 m-auto h-5 w-5 text-slate-700" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="max-w-[340px] truncate text-sm font-semibold text-slate-200">
                              {product['Nama Produk'] || 'Produk tanpa nama'}
                            </p>
                            <p className="mt-1 max-w-[300px] truncate text-xs text-slate-600">
                              {[product['Kategori Kedua'], product['Sub Kategori']].filter(Boolean).join(' • ') || 'Detail kategori belum tersedia'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-lg border border-blue-300/10 bg-blue-400/[0.055] px-2.5 py-1 text-xs font-medium text-blue-200">
                          {product['Kategori Utama'] || 'Tanpa kategori'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-sky-200">{formatCurrency(product.Harga)}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm text-amber-200">
                          <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                          {product.Rating || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {isTruthy(product.Terlaris) ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/10 bg-emerald-400/[0.07] px-2.5 py-1 text-[11px] font-semibold text-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                            Terlaris
                          </span>
                        ) : (
                          <span className="text-xs text-slate-600">Reguler</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-xs font-medium text-slate-600">#{product.No || index + 1}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-center text-xs leading-5 text-slate-600">
        Halaman ini mempertahankan sumber data SheetDB yang sudah digunakan. Fitur edit dan hapus tidak ditambahkan agar alur data lama tidak berubah.
      </p>
    </div>
  );
}
