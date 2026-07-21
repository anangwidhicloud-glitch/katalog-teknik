import { NextRequest, NextResponse } from 'next/server';

import cloudinary from '@/lib/cloudinary';
import { getDatabase } from '@/lib/database/neon';
import { isAdminAuthenticated } from '@/lib/require-admin';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type ProductPayload = {
  name?: string;
  mainCategory?: string;
  secondCategory?: string;
  subCategory?: string;
  price?: number;
  description?: string | null;
  hasDiscount?: boolean;
  discountPrice?: number | null;
  soldCount?: number;
  rating?: number;
  imageUrl?: string;
  imagePublicId?: string | null;
  imageUrl2?: string | null;
  imagePublicId2?: string | null;
  imageUrl3?: string | null;
  imagePublicId3?: string | null;
  imageUrl4?: string | null;
  imagePublicId4?: string | null;
  isBestSeller?: boolean;
};

type ProductRecord = {
  id: number;
  legacyNo: number | null;
  name: string;
  mainCategory: string | null;
  secondCategory: string | null;
  subCategory: string | null;
  price: number | null;
  description: string | null;
  hasDiscount: boolean;
  discountPrice: number | null;
  soldCount: number | null;
  rating: number | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  imageUrl2: string | null;
  imagePublicId2: string | null;
  imageUrl3: string | null;
  imagePublicId3: string | null;
  imageUrl4: string | null;
  imagePublicId4: string | null;
  isBestSeller: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function parseProductId(id: string) {
  const productId = Number(id);
  return Number.isInteger(productId) && productId > 0 ? productId : null;
}

function normalizeOptionalText(value: unknown) {
  const normalized = String(value ?? '').trim();
  return normalized || null;
}

async function destroyCloudinaryImages(publicIds: Array<string | null | undefined>) {
  const uniqueIds = Array.from(
    new Set(publicIds.map((item) => item?.trim()).filter((item): item is string => Boolean(item))),
  );

  if (uniqueIds.length === 0) return;

  const results = await Promise.allSettled(
    uniqueIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId, {
        invalidate: true,
        resource_type: 'image',
      }),
    ),
  );

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Gagal menghapus gambar Cloudinary ${uniqueIds[index]}:`, result.reason);
    }
  });
}

async function findProduct(productId: number) {
  const sql = getDatabase();

  const rows = (await sql`
    SELECT
      id,
      legacy_no AS "legacyNo",
      name,
      main_category AS "mainCategory",
      second_category AS "secondCategory",
      sub_category AS "subCategory",
      price,
      description,
      has_discount AS "hasDiscount",
      discount_price AS "discountPrice",
      sold_count AS "soldCount",
      rating,
      image_url AS "imageUrl",
      image_public_id AS "imagePublicId",
      image_url_2 AS "imageUrl2",
      image_public_id_2 AS "imagePublicId2",
      image_url_3 AS "imageUrl3",
      image_public_id_3 AS "imagePublicId3",
      image_url_4 AS "imageUrl4",
      image_public_id_4 AS "imagePublicId4",
      is_best_seller AS "isBestSeller",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM products
    WHERE id = ${productId}
    LIMIT 1
  `) as unknown as ProductRecord[];

  return rows[0] ?? null;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const productId = parseProductId(id);

    if (!productId) {
      return NextResponse.json({ message: 'ID produk tidak valid.' }, { status: 400 });
    }

    const product = await findProduct(productId);

    if (!product) {
      return NextResponse.json({ message: 'Produk tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Gagal mengambil detail produk:', error);
    return NextResponse.json({ message: 'Gagal mengambil detail produk.' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: 'Tidak memiliki akses.' }, { status: 401 });
  }

  const { id } = await context.params;
  const productId = parseProductId(id);

  if (!productId) {
    return NextResponse.json({ message: 'ID produk tidak valid.' }, { status: 400 });
  }

  try {
    const product = await findProduct(productId);

    if (!product) {
      return NextResponse.json({ message: 'Produk tidak ditemukan.' }, { status: 404 });
    }

    const sql = getDatabase();

    await sql`
      DELETE FROM products
      WHERE id = ${productId}
    `;

    await destroyCloudinaryImages([
      product.imagePublicId,
      product.imagePublicId2,
      product.imagePublicId3,
      product.imagePublicId4,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Gagal menghapus produk:', error);
    return NextResponse.json({ message: 'Gagal menghapus produk.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: 'Tidak memiliki akses.' }, { status: 401 });
  }

  const { id } = await context.params;
  const productId = parseProductId(id);

  if (!productId) {
    return NextResponse.json({ message: 'ID produk tidak valid.' }, { status: 400 });
  }

  try {
    const body = (await request.json()) as ProductPayload;
    const existing = await findProduct(productId);

    if (!existing) {
      return NextResponse.json({ message: 'Produk tidak ditemukan.' }, { status: 404 });
    }

    const name = String(body.name ?? '').trim();
    const normalizedPrice = Number(body.price) || 0;
    const rating = Math.min(5, Math.max(0, Number(body.rating) || 0));
    const hasDiscount = Boolean(body.hasDiscount);
    let normalizedDiscountPrice: number | null = null;

    if (!name) {
      return NextResponse.json({ message: 'Nama produk wajib diisi.' }, { status: 400 });
    }

    if (!String(body.imageUrl ?? '').trim()) {
      return NextResponse.json({ message: 'Gambar utama produk wajib tersedia.' }, { status: 400 });
    }

    if (hasDiscount) {
      normalizedDiscountPrice = Number(body.discountPrice) || 0;

      if (normalizedDiscountPrice <= 0 || normalizedDiscountPrice >= normalizedPrice) {
        return NextResponse.json(
          { message: 'Harga diskon harus lebih besar dari 0 dan lebih kecil dari harga lama.' },
          { status: 400 },
        );
      }
    }

    const nextPublicIds = [
      normalizeOptionalText(body.imagePublicId),
      normalizeOptionalText(body.imagePublicId2),
      normalizeOptionalText(body.imagePublicId3),
      normalizeOptionalText(body.imagePublicId4),
    ];

    const oldPublicIds = [
      existing.imagePublicId,
      existing.imagePublicId2,
      existing.imagePublicId3,
      existing.imagePublicId4,
    ];

    const sql = getDatabase();

    await sql`
      UPDATE products
      SET
        name = ${name},
        main_category = ${String(body.mainCategory ?? '').trim() || 'Lainnya'},
        second_category = ${String(body.secondCategory ?? '').trim() || 'Lainnya'},
        sub_category = ${String(body.subCategory ?? '').trim() || 'Lainnya'},
        price = ${normalizedPrice},
        description = ${normalizeOptionalText(body.description)},
        has_discount = ${hasDiscount},
        discount_price = ${normalizedDiscountPrice},
        sold_count = ${Math.max(0, Math.floor(Number(body.soldCount) || 0))},
        rating = ${rating},
        image_url = ${String(body.imageUrl ?? '').trim()},
        image_public_id = ${nextPublicIds[0]},
        image_url_2 = ${normalizeOptionalText(body.imageUrl2)},
        image_public_id_2 = ${nextPublicIds[1]},
        image_url_3 = ${normalizeOptionalText(body.imageUrl3)},
        image_public_id_3 = ${nextPublicIds[2]},
        image_url_4 = ${normalizeOptionalText(body.imageUrl4)},
        image_public_id_4 = ${nextPublicIds[3]},
        is_best_seller = ${Boolean(body.isBestSeller)},
        updated_at = NOW()
      WHERE id = ${productId}
    `;

    const idsToDelete = oldPublicIds.filter(
      (oldId): oldId is string => Boolean(oldId && !nextPublicIds.includes(oldId)),
    );

    await destroyCloudinaryImages(idsToDelete);

    const updated = await findProduct(productId);
    return NextResponse.json(updated ?? { success: true });
  } catch (error) {
    console.error('Gagal memperbarui produk:', error);
    return NextResponse.json({ message: 'Gagal memperbarui produk.' }, { status: 500 });
  }
}
