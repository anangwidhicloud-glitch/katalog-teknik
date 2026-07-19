'use client';

export default function TestGalleryPage() {
  async function testGallery() {
    const response = await fetch('/api/gallery', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Gallery',
        category: 'Test',
        location: 'Bogor',
        imageUrl: 'https://res.cloudinary.com/test.jpg',
        sortOrder: 1,
      }),
    });

    const result = await response.json();

    console.log('STATUS:', response.status);

    console.log('RESULT:', result);
  }

  return (
    <main className="p-10">
      <button onClick={testGallery} className="rounded-xl bg-blue-600 px-6 py-3 text-white">
        Test POST Gallery
      </button>
    </main>
  );
}
