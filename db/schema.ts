import {
  boolean,
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),

  legacyNo: integer('legacy_no'),
  name: text('name').notNull(),

  mainCategory: text('main_category'),
  secondCategory: text('second_category'),
  subCategory: text('sub_category'),

  price: integer('price').notNull(),
  rating: integer('rating'),

  imageUrl: text('image_url').notNull(),

  // Tambahan baru
  imagePublicId: text('image_public_id'),

  isBestSeller: boolean('is_best_seller')
    .notNull()
    .default(false),

  createdAt: timestamp('created_at')
    .notNull()
    .defaultNow(),

  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow(),
});

export type ProductRow = typeof products.$inferSelect;
export type NewProductRow = typeof products.$inferInsert;