import { desc, ilike, or } from 'drizzle-orm';
import { db } from '@/db';
import { products, type NewProductRow } from '@/db/schema';

export async function findProducts(search?: string) {
  const keyword = search?.trim();

  if (!keyword) {
    return db.select().from(products).orderBy(desc(products.id));
  }

  return db
    .select()
    .from(products)
    .where(
      or(
        ilike(products.name, `%${keyword}%`),
        ilike(products.mainCategory, `%${keyword}%`),
        ilike(products.secondCategory, `%${keyword}%`),
        ilike(products.subCategory, `%${keyword}%`),
      ),
    )
    .orderBy(desc(products.id));
}

export async function createProducts(payload: NewProductRow[]) {
  if (payload.length === 0) return [];

  return db.insert(products).values(payload).returning();
}
