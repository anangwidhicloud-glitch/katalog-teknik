import { NextRequest, NextResponse } from 'next/server';

import cloudinary from '@/lib/cloudinary';
import { isAdminAuthenticated } from '@/lib/require-admin';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!origin) return true;

  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { message: 'Tidak memiliki akses.' },
      { status: 401 },
    );
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { message: 'Permintaan tidak valid.' },
      { status: 403 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: 'File logo tidak ditemukan.' },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: 'Format logo harus JPG, PNG, atau WEBP.' },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: 'Ukuran logo maksimal 3MB.' },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{
      secureUrl: string;
      publicId: string;
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'katalog-teknik/partners',
            resource_type: 'image',
            transformation: [
              {
                width: 600,
                height: 240,
                crop: 'pad',
                background: 'transparent',
                quality: 'auto',
                fetch_format: 'auto',
              },
            ],
          },
          (error, uploadResult) => {
            if (error) {
              reject(error);
              return;
            }

            if (!uploadResult?.secure_url || !uploadResult.public_id) {
              reject(new Error('Data Cloudinary tidak lengkap.'));
              return;
            }

            resolve({
              secureUrl: uploadResult.secure_url,
              publicId: uploadResult.public_id,
            });
          },
        )
        .end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secureUrl,
      publicId: result.publicId,
    });
  } catch (error) {
    console.error('Upload logo mitra gagal:', error);

    return NextResponse.json(
      { message: 'Gagal mengunggah logo mitra.' },
      { status: 500 },
    );
  }
}
