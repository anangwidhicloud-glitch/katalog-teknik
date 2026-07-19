'use client';

import {
  ArrowLeft,
  ImagePlus,
  LoaderCircle,
  Save,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type ProductFormProps = {
  mode: 'create' | 'edit';
  initialData?: {
    id: string;
    name: string;
    mainCategory: string;
    secondCategory: string;
    subCategory: string;
    price: number;
    description?: string | null;
hasDiscount?: boolean;
discountPrice?: number | null;
soldCount?: number;
rating: number;
imageUrl: string;
imagePublicId?: string;
  };
};

export default function ProductForm({
  mode,
  initialData,
}: ProductFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [mainCategory, setMainCategory] = useState(initialData?.mainCategory || '');
  const [secondCategory, setSecondCategory] = useState(initialData?.secondCategory || '');
  const [subCategory, setSubCategory] = useState(initialData?.subCategory || '');
const [price, setPrice] = useState(initialData?.price || 0);
const [description, setDescription] = useState(
  initialData?.description || '',
);
const [hasDiscount, setHasDiscount] = useState(
  initialData?.hasDiscount || false,
);
const [discountPrice, setDiscountPrice] = useState(
  initialData?.discountPrice || 0,
);
const [soldCount, setSoldCount] = useState(
  initialData?.soldCount ?? 0,
);
const [rating, setRating] = useState(initialData?.rating || 0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initialData?.imageUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function uploadImage() {
    if (!imageFile) {
      return {
        url: initialData?.imageUrl || '',
        publicId: initialData?.imagePublicId || '',
      };
    }

    const data = new FormData();
    data.append('file', imageFile);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: data,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Upload gambar gagal');
    }

    return { url: result.url, publicId: result.publicId };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!name.trim()) throw new Error('Nama produk wajib diisi.');
      if (!mainCategory.trim()) throw new Error('Kategori utama wajib diisi.');
      if (!secondCategory.trim()) throw new Error('Kategori kedua wajib diisi.');
      if (!subCategory.trim()) throw new Error('Sub kategori wajib diisi.');
      if (mode === 'create' && !imageFile) throw new Error('Gambar produk wajib dipilih.');
      if (hasDiscount && discountPrice <= 0) {
  throw new Error('Harga setelah diskon wajib diisi.');
}

if (hasDiscount && discountPrice >= price) {
  throw new Error('Harga setelah diskon harus lebih kecil dari harga lama.');
}

      const image = await uploadImage();

      const payload = {
        name,
        mainCategory,
        secondCategory,
        subCategory,
        price,
description,
hasDiscount,
discountPrice: hasDiscount ? discountPrice : null,
soldCount,
rating,
imageUrl: image.url,
        imagePublicId: image.publicId,
      };

      const url = mode === 'create' ? '/api/products' : `/api/products/${initialData?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || 'Gagal menyimpan produk.');

      window.location.href = '/admin/products';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }
  function formatRupiah(value: number | string) {
  const num = typeof value === 'string' ? parseInt(value) : value;
  return num.toLocaleString('id-ID'); // menambahkan titik ribuan
}

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  return (
    <div className="space-y-6">
      <section className="admin-panel rounded-[26px] px-6 py-7">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="grid h-10 w-10 place-items-center rounded-xl border border-white/8">
            <ArrowLeft className="h-5 w-5 text-slate-300" />
          </Link>
          <div>
            <h2 className="text-2xl font-semibold text-white">{mode === 'create' ? 'Tambah Produk' : 'Edit Produk'}</h2>
            <p className="text-sm text-slate-400">{mode === 'create' ? 'Siapkan informasi produk baru' : 'Perbarui informasi produk yang tersimpan di database.'}</p>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="admin-panel space-y-6 rounded-3xl p-6">
        {error && <div className="rounded-xl border border-red-300/20 bg-red-400/10 p-4 text-sm text-red-200">{error}</div>}

        <div>
          <label className="text-sm text-slate-300">Nama Produk</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="admin-field mt-2 h-12 rounded-xl" placeholder="Contoh: Nasi Goja" />
        </div>
        <div>
  <label className="text-sm text-slate-300">Detail Produk</label>

  <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="admin-field mt-2 min-h-36 rounded-xl px-4 py-3"
    placeholder="Masukkan spesifikasi, kegunaan, keunggulan, atau informasi lengkap produk."
  />
</div>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="text-sm text-slate-300">Kategori Utama</label>
            <input value={mainCategory} onChange={(e) => setMainCategory(e.target.value)} className="admin-field mt-2 h-12 rounded-xl" placeholder="Otomotif" />
          </div>
          <div>
            <label className="text-sm text-slate-300">Kategori Kedua</label>
            <input value={secondCategory} onChange={(e) => setSecondCategory(e.target.value)} className="admin-field mt-2 h-12 rounded-xl" placeholder="Wheel" />
          </div>
          <div>
            <label className="text-sm text-slate-300">Sub Kategori</label>
            <input value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="admin-field mt-2 h-12 rounded-xl" placeholder="Alignment" />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          
  {/* Harga */}
  <div>
    <label className="text-sm text-slate-300">Harga (IDR)</label>
    <div className="relative">
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">Rp.</span>
  <input
    type="text" // gunakan text agar bisa format
    value={formatRupiah(price)}
    onChange={(e) => {
      const numericValue = parseInt(e.target.value.replace(/\D/g, '')) || 0;
      setPrice(numericValue);
    }}
    className="admin-field mt-2 h-12 rounded-xl pl-10"
  />
</div>
  </div>

  {/* Rating */}
  <div>
    <label className="text-sm text-slate-300">Rating</label>
    <select
      value={rating}
      onChange={(e) => setRating(Number(e.target.value))}
      className="admin-field mt-2 h-12 rounded-xl"
    >
      <option value="">Pilih Rating</option>
      <option value="1">⭐ 1</option>
      <option value="2">⭐⭐ 2</option>
      <option value="3">⭐⭐⭐ 3</option>
      <option value="4">⭐⭐⭐⭐ 4</option>
      <option value="5">⭐⭐⭐⭐⭐ 5</option>
    </select>
  </div>
</div>

<div>
  <label className="text-sm text-slate-300">
    Jumlah Terjual
  </label>

  <input
    type="text"
    inputMode="numeric"
    value={formatRupiah(soldCount)}
    onChange={(e) => {
      const numericValue =
        parseInt(e.target.value.replace(/\D/g, '')) || 0;

      setSoldCount(numericValue);
    }}
    className="admin-field mt-2 h-12 rounded-xl"
    placeholder="Contoh: 11150"
  />

  <p className="mt-2 text-xs text-slate-500">
    Isi angka penjualan secara manual. Contoh: 11150 akan
    ditampilkan sebagai 11,1RB+ terjual.
  </p>
</div>

<div className="rounded-2xl border border-white/10 p-5">
  <label className="flex cursor-pointer items-center gap-3">
    <input
      type="checkbox"
      checked={hasDiscount}
      onChange={(e) => {
        setHasDiscount(e.target.checked);

        if (!e.target.checked) {
          setDiscountPrice(0);
        }
      }}
    />

    <span className="text-sm font-medium text-slate-200">
      Aktifkan harga diskon
    </span>
  </label>

  {hasDiscount && (
    <div className="mt-5">
      <label className="text-sm text-slate-300">
        Harga Setelah Diskon
      </label>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          Rp.
        </span>

        <input
          type="text"
          value={formatRupiah(discountPrice)}
          onChange={(e) => {
            const numericValue =
              parseInt(e.target.value.replace(/\D/g, '')) || 0;

            setDiscountPrice(numericValue);
          }}
          className="admin-field mt-2 h-12 rounded-xl pl-10"
          placeholder="Contoh: 125000"
        />
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Harga utama akan menjadi harga lama yang dicoret.
      </p>
    </div>
  )}
</div>
        <div>
          <label className="text-sm text-slate-300">Gambar Produk</label>
          <label className="mt-2 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/2">
            {preview ? (
              <div className="relative h-36 w-36 overflow-hidden rounded-xl">
                <Image src={preview} alt="preview" fill sizes="144px" className="object-cover" />
              </div>
            ) : (
              <>
                <ImagePlus className="h-10 w-10 text-slate-500" />
                <span className="mt-3 text-sm text-slate-500">{mode === 'create' ? 'Pilih gambar' : 'Klik untuk mengganti gambar'}</span>
              </>
            )}
            <input hidden type="file" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>

        <button disabled={loading} className="inline-flex h-12 items-center gap-2 rounded-xl bg-sky-500 px-6 text-sm font-semibold text-white hover:bg-sky-400">
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          <Save className="h-4 w-4" />
          {mode === 'create' ? 'Simpan Produk' : 'Perbarui Produk'}
        </button>
      </form>
    </div>
  );
}