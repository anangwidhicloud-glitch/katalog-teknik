import { z } from 'zod';

import { getDatabase } from '@/lib/database/neon';

import {
  createProducts as insertProducts,
  findProducts,
} from './product.repository';


const productQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .max(100)
    .optional(),
});


const productCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      'Nama produk minimal 2 karakter.',
    ),

  mainCategory: z
    .string()
    .trim()
    .default('Lainnya'),

  secondCategory: z
    .string()
    .trim()
    .default('Lainnya'),

  subCategory: z
    .string()
    .trim()
    .default('Lainnya'),

  price: z
    .coerce
    .number()
    .min(0),

    description: z
  .string()
  .trim()
  .optional()
  .default(''),

hasDiscount: z
  .boolean()
  .optional()
  .default(false),

discountPrice: z
  .coerce
  .number()
  .min(0)
  .nullable()
  .optional(),

soldCount: z
  .coerce
  .number()
  .int()
  .min(0)
  .optional()
  .default(0),

rating: z
    .coerce
    .number()
    .min(0)
    .max(5),

imageUrl: z
  .string()
  .trim()
  .min(
    1,
    'Gambar produk wajib diunggah.',
  ),

imagePublicId: z
  .string()
  .trim()
  .optional(),
});


export async function getProducts(
  query: unknown,
) {
  const parsed =
    productQuerySchema.parse(query);

  return findProducts(
    parsed.search,
  );
}


export async function createProduct(
  input: unknown,
) {
  const parsed =
    productCreateSchema.parse(input);

  const sql =
    getDatabase();

  type MaxLegacyRow = {
    maxlegacy: number | null;
  };

  const lastLegacyResult = (
    await sql`
      SELECT
        MAX(legacy_no) AS maxlegacy
      FROM products
    `
  ) as unknown as MaxLegacyRow[];

  const nextLegacy =
    (
      lastLegacyResult[0]
        ?.maxlegacy ?? 0
    ) + 1;

  const result =
    await insertProducts([
      {
        legacyNo:
          nextLegacy,

        name:
          parsed.name,

        mainCategory:
          parsed.mainCategory,

        secondCategory:
          parsed.secondCategory,

        subCategory:
          parsed.subCategory,

price: parsed.price,
description: parsed.description || null,
hasDiscount: parsed.hasDiscount,
discountPrice: parsed.hasDiscount
  ? parsed.discountPrice ?? null
  : null,
soldCount: parsed.soldCount,
rating: parsed.rating,

imageUrl: parsed.imageUrl,
imagePublicId: parsed.imagePublicId || null,
      },
    ]);

  return result[0];
}