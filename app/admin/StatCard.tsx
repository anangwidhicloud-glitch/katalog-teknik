// app/admin/components/admin/StatCard.tsx
import React from 'react';

export default function StatCard({ title, value, icon: Icon }: { title: string, value: string, icon: any }) {
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 flex items-center gap-4">
      <div className="p-3 bg-purple-600/20 rounded-xl">
        <Icon className="w-6 h-6 text-purple-400" />
      </div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
    </div>
  );
}