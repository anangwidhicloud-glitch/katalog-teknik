import { NextRequest, NextResponse } from 'next/server';

import { getDatabase } from '@/lib/database/neon';
import { isAdminAuthenticated } from '@/lib/require-admin';
import cloudinary from '@/lib/cloudinary';
export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        {
          message: 'ID produk tidak valid.',
        },
        {
          status: 400,
        },
      );
    }


    const sql = getDatabase();

const products = await sql`
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
created_at AS "createdAt",
    updated_at AS "updatedAt"
  FROM products
  WHERE id = ${productId}
  LIMIT 1
` as unknown as Array<{
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
createdAt: Date;
  updatedAt: Date;
}>;


    if (products.length === 0) {
      return NextResponse.json(
        {
          message:
            'Produk tidak ditemukan.',
        },
        {
          status: 404,
        },
      );
    }


    return NextResponse.json(
      products[0],
    );

  } catch (error) {
    console.error(
      'Gagal mengambil detail produk:',
      error,
    );


    return NextResponse.json(
      {
        message:
          'Gagal mengambil detail produk.',
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { message: 'Tidak memiliki akses.' },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const productId = Number(id);

  if (!Number.isInteger(productId)) {
    return NextResponse.json(
      { message: 'ID produk tidak valid.' },
      { status: 400 },
    );
  }

  try {
    const sql = getDatabase();

    const rows = (await sql`
      SELECT image_public_id
      FROM products
      WHERE id = ${productId}
      LIMIT 1
    `) as unknown as Array<{
      image_public_id: string | null;
    }>;

    const product = rows[0];

    if (!product) {
      return NextResponse.json(
        { message: 'Produk tidak ditemukan.' },
        { status: 404 },
      );
    }

    await sql`
      DELETE FROM products
      WHERE id = ${productId}
    `;

    if (product.image_public_id) {
      try {
await cloudinary.uploader.destroy(
  product.image_public_id,
  {
    invalidate: true,
    resource_type: 'image',
  },
);

      } catch (deleteError) {
        console.error(
          'Gagal menghapus gambar produk:',
          deleteError,
        );
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      'Gagal menghapus produk:',
      error,
    );

    return NextResponse.json(
      {
        message:
          'Gagal menghapus produk.',
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext,
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { message: 'Tidak memiliki akses.' },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const productId = Number(id);

  if (!Number.isInteger(productId)) {
    return NextResponse.json(
      { message: 'ID produk tidak valid.' },
      { status: 400 },
    );
  }

  try {
const body = (await request.json()) as {
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
  imagePublicId: string;
  isBestSeller: boolean;
};

const normalizedPrice = Number(body.price) || 0;
let normalizedDiscountPrice: number | null = null;

if (body.hasDiscount) {
  normalizedDiscountPrice =
    Number(body.discountPrice) || 0;

  if (
    normalizedDiscountPrice <= 0 ||
    normalizedDiscountPrice >= normalizedPrice
  ) {
    return NextResponse.json(
      {
        message:
          'Harga diskon harus lebih besar dari 0 dan lebih kecil dari harga lama.',
      },
      {
        status: 400,
      },
    );
  }
}

    const sql = getDatabase();

    const existingRows = (await sql`
      SELECT image_public_id
      FROM products
      WHERE id = ${productId}
      LIMIT 1
    `) as unknown as Array<{
      image_public_id: string | null;
    }>;

    const oldImagePublicId =
      existingRows[0]?.image_public_id ?? null;

    await sql`
      UPDATE products
      SET
        name = ${body.name},
        main_category =
          ${body.mainCategory || 'Lainnya'},
        second_category =
          ${body.secondCategory || 'Lainnya'},
        sub_category =
          ${body.subCategory || 'Lainnya'},
price = ${normalizedPrice},
description = ${body.description?.trim() || null},
has_discount = ${Boolean(body.hasDiscount)},
discount_price = ${normalizedDiscountPrice},
sold_count = ${
  Math.max(
    0,
    Math.floor(Number(body.soldCount) || 0),
  )
},
rating = ${Number(body.rating) || 0},
image_url = ${body.imageUrl || ''},
image_public_id = ${body.imagePublicId || null},
updated_at = NOW()
      WHERE id = ${productId}
    `;

    if (
      oldImagePublicId &&
      body.imagePublicId &&
      oldImagePublicId !== body.imagePublicId
    ) {
      try {
await cloudinary.uploader.destroy(
  oldImagePublicId,
  {
    invalidate: true,
  },
);
      } catch (deleteError) {
        console.error(
          'Gagal menghapus gambar produk lama:',
          deleteError,
        );
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      'Gagal memperbarui produk:',
      error,
    );

    return NextResponse.json(
      {
        message:
          'Gagal memperbarui produk.',
      },
      { status: 500 },
    );
  }
}