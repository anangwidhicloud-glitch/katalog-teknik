'use client';

import { useParams } from 'next/navigation';

import { useEffect, useState } from 'react';

import GalleryForm from '@/app/admin/components/GalleryForm';

export default function EditGalleryPage() {
  const params = useParams();

  const id = params.id as string;

  const [gallery, setGallery] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      const response = await fetch(`/api/gallery/${id}`);

      const data = await response.json();

      setGallery(data);

      setLoading(false);
    }

    loadGallery();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-white">Memuat gallery...</div>;
  }

  if (!gallery) {
    return <div className="p-8 text-white">Gallery tidak ditemukan.</div>;
  }

  return <GalleryForm mode="edit" initialData={gallery} />;
}
