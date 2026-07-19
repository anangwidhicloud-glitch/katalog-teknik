'use client';

interface ServiceRowProps {
  id: string;
  title: string;
  desc: string;
}

export default function ServiceRow({ id, title, desc }: ServiceRowProps) {
  return (
    <div className="border-t border-white/10 py-32">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Nomor Urut - Dibuat lebih kecil & elegan */}
        <div className="md:col-span-1 text-purple-500 font-mono text-sm pt-2">{id}</div>

        {/* Konten Utama - Fokus pada tipografi */}
        <div className="md:col-span-7">
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-10 hover:text-purple-400 transition-colors duration-500">
            {title}
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed font-light max-w-lg">{desc}</p>
        </div>

        {/* Link - Dibuat minimalis tanpa tombol */}
        <div className="md:col-span-4 flex items-end justify-end">
          <a
            href="#"
            className="group flex items-center gap-4 text-sm uppercase tracking-widest font-bold"
          >
            <span className="h-[1px] w-12 bg-white transition-all group-hover:w-20"></span>
            Selengkapnya
          </a>
        </div>
      </div>
    </div>
  );
}
