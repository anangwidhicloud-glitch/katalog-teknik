import { NextRequest, NextResponse } from 'next/server';

import { getDatabase } from '@/lib/database/neon';
import { isAdminAuthenticated } from '@/lib/require-admin';


export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';



export async function GET() {

  try {

    const sql = getDatabase();


    const gallery = await sql`
SELECT
  id,
  title,
  category,
  location,
  description,
  media_type AS "mediaType",
  youtube_video_id AS "youtubeVideoId",
  image_url AS "imageUrl",
  image_public_id AS "imagePublicId",
  sort_order AS "sortOrder"
FROM gallery
      ORDER BY sort_order ASC, id ASC
    `;


    return NextResponse.json(gallery);


  } catch(error){

    console.error(
      'Gagal mengambil gallery:',
      error,
    );


    return NextResponse.json(
      {
        message:
          'Gagal mengambil gallery.',
      },
      {
        status:500,
      },
    );

  }

}

export async function POST(
  request: NextRequest,
) {
    console.log(
  'COOKIE CHECK'
);
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      {
        message:
          'Tidak memiliki akses.',
      },
      {
        status:401,
      },
    );
  }


  try {

    const body =
      await request.json();


    const sql =
      getDatabase();


const result =
  await sql`
INSERT INTO gallery (
  id,
  title,
  category,
  location,
  description,
  media_type,
  youtube_video_id,
  image_url,
  image_public_id,
  sort_order,
  created_at,
  updated_at
)
VALUES (
  ${crypto.randomUUID()},
  ${body.title},
  ${body.category || ''},
  ${body.location || ''},
  ${body.description || ''},
  ${body.mediaType === 'youtube' ? 'youtube' : 'image'},
  ${
    body.mediaType === 'youtube'
      ? body.youtubeVideoId || null
      : null
  },
  ${
    body.mediaType === 'image'
      ? body.imageUrl || null
      : null
  },
  ${
    body.mediaType === 'image'
      ? body.imagePublicId || null
      : null
  },
  ${Number(body.sortOrder) || 0},
  NOW(),
  NOW()
)
    RETURNING *
  ` as unknown as Array<{
    id: string;
    title: string;
    category: string;
    location: string;
    description: string | null;
    media_type: 'image' | 'youtube';
    youtube_video_id: string | null;
    image_url: string | null;
    image_public_id: string | null;
    sort_order: number;
  }>;


return NextResponse.json(
  result[0],
  {
    status:201,
  },
);


  } catch(error){

    console.error(
      'Gagal menambah gallery:',
      error,
    );


    return NextResponse.json(
      {
        message:
          'Gagal menambah gallery.',
      },
      {
        status:500,
      },
    );

  }
}