import { NextRequest, NextResponse } from 'next/server';

import cloudinary from '@/lib/cloudinary';
import { isAdminAuthenticated } from '@/lib/require-admin';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export async function POST(
  request: NextRequest,
) {
  // 1. Cek login admin
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      {
        message: 'Tidak memiliki akses.',
      },
      {
        status: 401,
      },
    );
  }

  try {
    // 2. Ambil file dari form-data
    const formData = await request.formData();
    const folder =
  formData.get('folder') === 'gallery'
    ? 'katalog-teknik/gallery'
    : 'katalog-teknik/products';

    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          message: 'File gambar tidak ditemukan.',
        },
        {
          status: 400,
        },
      );
    }

    // 3. Validasi tipe file
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          message:
            'Format gambar harus JPG, PNG, atau WEBP.',
        },
        {
          status: 400,
        },
      );
    }

    // 4. Validasi ukuran
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          message:
            'Ukuran gambar maksimal 3MB.',
        },
        {
          status: 400,
        },
      );
    }

    // 5. Convert file menjadi buffer
    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    // 6. Upload ke Cloudinary
const result =
  await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder,

              transformation: [
                {
                  width: 1200,
                  height: 1200,
                  crop: 'limit',
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

if (
  !uploadResult?.secure_url ||
  !uploadResult?.public_id
) {
  reject(
    new Error(
      'Data Cloudinary tidak lengkap.',
    ),
  );
  return;
}

resolve({
  secure_url:
    uploadResult.secure_url,

  public_id:
    uploadResult.public_id,
});
            },
          )
          .end(buffer);
      });

return NextResponse.json({
  success: true,

  url:
    result.secure_url,

  publicId:
    result.public_id,
});
  } catch (error) {
    console.error(
      'Upload gambar gagal:',
      error,
    );

    return NextResponse.json(
      {
        message:
          'Gagal mengupload gambar.',
      },
      {
        status: 500,
      },
    );
  }
}