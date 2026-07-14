import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

import { db } from '@/db';
import { admins } from '@/db/schema';
import { hashPassword } from '@/lib/auth/password';
import { env } from '@/lib/env';
import { requireSuperAdmin } from '@/lib/require-super-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const createAdminSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(190),
  password: z.string().min(8).max(128),
  isActive: z.boolean().default(true),
});

const adminSelection = {
  id: admins.id,
  name: admins.name,
  email: admins.email,
  isActive: admins.isActive,
  lastLoginAt: admins.lastLoginAt,
  createdAt: admins.createdAt,
  updatedAt: admins.updatedAt,
};

function isUniqueViolation(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === '23505'
  );
}

export async function GET() {
  if (!(await requireSuperAdmin())) {
    return NextResponse.json(
      { message: 'Khusus super admin.' },
      { status: 403 },
    );
  }

  try {
    const data = await db
      .select(adminSelection)
      .from(admins)
      .orderBy(desc(admins.createdAt));

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Gagal mengambil akun admin:', error);

    return NextResponse.json(
      { message: 'Gagal mengambil akun admin.' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await requireSuperAdmin())) {
    return NextResponse.json(
      { message: 'Khusus super admin.' },
      { status: 403 },
    );
  }

  try {
    const parsed = createAdminSchema.parse(await request.json());
    const email = parsed.email.toLowerCase();

    if (email === env.ADMIN_EMAIL.trim().toLowerCase()) {
      return NextResponse.json(
        { message: 'Email tersebut digunakan oleh super admin ENV.' },
        { status: 400 },
      );
    }

    const passwordHash = await hashPassword(parsed.password);

    const [createdAdmin] = await db
      .insert(admins)
      .values({
        name: parsed.name,
        email,
        passwordHash,
        isActive: parsed.isActive,
      })
      .returning(adminSelection);

    return NextResponse.json(createdAdmin, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: 'Data admin tidak valid.' },
        { status: 400 },
      );
    }

    if (isUniqueViolation(error)) {
      return NextResponse.json(
        { message: 'Email admin sudah digunakan.' },
        { status: 409 },
      );
    }

    console.error('Gagal membuat akun admin:', error);

    return NextResponse.json(
      { message: 'Gagal membuat akun admin.' },
      { status: 500 },
    );
  }
}
