import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

import { db } from '@/db';
import { admins, type NewAdminRow } from '@/db/schema';
import { hashPassword } from '@/lib/auth/password';
import { env } from '@/lib/env';
import { requireSuperAdmin } from '@/lib/require-super-admin';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const updateAdminSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    email: z.string().trim().email().max(190).optional(),
    password: z.string().min(8).max(128).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Tidak ada perubahan.',
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
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';
}

function parseAdminId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await requireSuperAdmin())) {
    return NextResponse.json({ message: 'Khusus super admin.' }, { status: 403 });
  }

  const { id } = await context.params;
  const adminId = parseAdminId(id);

  if (!adminId) {
    return NextResponse.json({ message: 'ID admin tidak valid.' }, { status: 400 });
  }

  try {
    const parsed = updateAdminSchema.parse(await request.json());
    const updateData: Partial<NewAdminRow> = {
      updatedAt: new Date(),
    };

    if (parsed.name !== undefined) {
      updateData.name = parsed.name;
    }

    if (parsed.email !== undefined) {
      const email = parsed.email.toLowerCase();

      if (email === env.ADMIN_EMAIL.trim().toLowerCase()) {
        return NextResponse.json(
          { message: 'Email tersebut digunakan oleh super admin ENV.' },
          { status: 400 },
        );
      }

      updateData.email = email;
    }

    if (parsed.password !== undefined) {
      updateData.passwordHash = await hashPassword(parsed.password);
    }

    if (parsed.isActive !== undefined) {
      updateData.isActive = parsed.isActive;
    }

    const [updatedAdmin] = await db
      .update(admins)
      .set(updateData)
      .where(eq(admins.id, adminId))
      .returning(adminSelection);

    if (!updatedAdmin) {
      return NextResponse.json({ message: 'Admin tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json(updatedAdmin);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Data admin tidak valid.' }, { status: 400 });
    }

    if (isUniqueViolation(error)) {
      return NextResponse.json({ message: 'Email admin sudah digunakan.' }, { status: 409 });
    }

    console.error('Gagal memperbarui akun admin:', error);

    return NextResponse.json({ message: 'Gagal memperbarui akun admin.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await requireSuperAdmin())) {
    return NextResponse.json({ message: 'Khusus super admin.' }, { status: 403 });
  }

  const { id } = await context.params;
  const adminId = parseAdminId(id);

  if (!adminId) {
    return NextResponse.json({ message: 'ID admin tidak valid.' }, { status: 400 });
  }

  try {
    const [deletedAdmin] = await db
      .delete(admins)
      .where(eq(admins.id, adminId))
      .returning({ id: admins.id });

    if (!deletedAdmin) {
      return NextResponse.json({ message: 'Admin tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Gagal menghapus akun admin:', error);

    return NextResponse.json({ message: 'Gagal menghapus akun admin.' }, { status: 500 });
  }
}
