import {
  CheckCircle2,
  Clock3,
  FileKey2,
  KeyRound,
  LockKeyhole,
  ServerCog,
  ShieldCheck,
} from 'lucide-react';

const securityItems = [
  {
    title: 'Cookie HttpOnly',
    description: 'Sesi tidak dapat dibaca langsung oleh JavaScript pada browser.',
    icon: LockKeyhole,
  },
  {
    title: 'Masa aktif 8 jam',
    description: 'Sesi admin memiliki batas waktu dan perlu login kembali setelah berakhir.',
    icon: Clock3,
  },
  {
    title: 'Kredensial di server',
    description: 'Email, kata sandi, dan secret tidak dikirim sebagai variabel publik.',
    icon: ServerCog,
  },
];

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <section className="admin-panel relative overflow-hidden rounded-[26px] px-6 py-7 sm:px-8">
        <div aria-hidden="true" className="absolute -right-14 -top-24 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-semibold text-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            Security center
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Keamanan Akun Admin</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Halaman ini menampilkan cara akses admin dilindungi. Nilai email, kata sandi, dan secret tidak ditampilkan untuk menjaga keamanan.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {securityItems.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="admin-panel rounded-[22px] p-5">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-300/10 bg-emerald-400/[0.06] text-emerald-200">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-sm font-semibold text-slate-100">{item.title}</h3>
              <p className="mt-2 text-xs leading-6 text-slate-500">{item.description}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="admin-panel overflow-hidden rounded-[24px]">
          <div className="border-b border-white/[0.07] px-5 py-5 sm:px-6">
            <h3 className="font-semibold text-white">Konfigurasi yang diperlukan</h3>
            <p className="mt-1 text-xs text-slate-500">Variabel berikut harus tersedia pada lingkungan aplikasi.</p>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {[
              ['ADMIN_EMAIL', 'Alamat email untuk login administrator.'],
              ['ADMIN_PASSWORD', 'Kata sandi administrator yang kuat dan unik.'],
              ['ADMIN_AUTH_SECRET', 'Secret panjang untuk menandatangani token sesi.'],
            ].map(([name, description]) => (
              <div key={name} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <code className="text-xs font-semibold text-sky-200">{name}</code>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{description}</p>
                </div>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-300/10 bg-emerald-400/[0.06] px-2.5 py-1 text-[10px] font-semibold text-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Dikelola server
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-panel rounded-[24px] p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-blue-300/10 bg-blue-400/[0.06] text-blue-200">
              <FileKey2 className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold text-white">Mengubah akses login</h3>
              <p className="mt-2 text-xs leading-6 text-slate-500">
                Pada komputer lokal, ubah nilai di <code className="text-slate-300">.env.local</code>. Saat deploy di Vercel, ubah melalui menu Environment Variables pada pengaturan proyek.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-amber-300/10 bg-amber-400/[0.055] p-4">
            <div className="flex items-start gap-3">
              <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <p className="text-xs leading-5 text-amber-100/65">
                Jangan menambahkan prefix <code className="text-amber-100">NEXT_PUBLIC_</code> pada kredensial karena nilai tersebut dapat dikirim ke browser.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
