import {
  bigint,
  boolean,
  integer,
  pgTable,
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
price: bigint('price', { mode: 'number' }).notNull(),
description: text('description'),
hasDiscount: boolean('has_discount').notNull().default(false),
discountPrice: bigint('discount_price', { mode: 'number' }),
soldCount: bigint('sold_count', { mode: 'number' })
  .notNull()
  .default(0),
rating: integer('rating'),
  imageUrl: text('image_url').notNull(),
  imagePublicId: text('image_public_id'),
  isBestSeller: boolean('is_best_seller').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type ProductRow = typeof products.$inferSelect;
export type NewProductRow = typeof products.$inferInsert;
export type AdminRow = typeof admins.$inferSelect;
export type NewAdminRow = typeof admins.$inferInsert;
