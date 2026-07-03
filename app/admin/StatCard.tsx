import type { ComponentType } from 'react';

type StatCardProps = {
  title: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
};

export default function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="admin-panel flex items-center gap-4 rounded-2xl p-6">
      <div className="rounded-xl border border-sky-300/10 bg-sky-400/[0.07] p-3">
        <Icon className="h-6 w-6 text-sky-200" />
      </div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
    </div>
  );
}
