import { MessageCircleMore } from 'lucide-react';

import { getDatabase } from '../../../lib/database/neon';

const DEFAULT_WA_NUMBER = '+6285640100044';
const DEFAULT_WA_MESSAGE = 'Halo, saya ingin bertanya tentang produk Anda.';

function normalizeWhatsAppNumber(rawNumber: string) {
  const trimmed = rawNumber.trim();

  if (!trimmed) return '';

  const normalized = trimmed
    .replace(/\s+/g, '')
    .replace(/-/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '');

  if (normalized.startsWith('+')) {
    return normalized.slice(1).replace(/\D/g, '');
  }

  if (normalized.startsWith('0')) {
    return `62${normalized.slice(1).replace(/\D/g, '')}`;
  }

  return normalized.replace(/\D/g, '');
}

function isEnabled(value: string | undefined) {
  const normalized = (value ?? '').trim().toLowerCase();
  return ['1', 'true', 'yes', 'on', 'aktif'].includes(normalized);
}

export default async function FloatingWhatsApp() {
  let whatsappEnabled = true;
  let whatsappNumber = DEFAULT_WA_NUMBER;
  let whatsappMessage = DEFAULT_WA_MESSAGE;

  try {
    const sql = getDatabase();

    const rows = (await sql`
      SELECT key, value
      FROM settings
      WHERE key IN ('whatsapp_enabled', 'whatsapp_number', 'whatsapp_message')
    `) as Array<{ key: string; value: string | null }>;

    const map = rows.reduce<Record<string, string>>((accumulator, row) => {
      accumulator[row.key] = row.value ?? '';
      return accumulator;
    }, {});

    whatsappEnabled =
      map.whatsapp_enabled && map.whatsapp_enabled.trim().length > 0
        ? isEnabled(map.whatsapp_enabled)
        : true;

    whatsappNumber =
      map.whatsapp_number && map.whatsapp_number.trim().length > 0
        ? map.whatsapp_number
        : DEFAULT_WA_NUMBER;

    whatsappMessage =
      map.whatsapp_message && map.whatsapp_message.trim().length > 0
        ? map.whatsapp_message
        : DEFAULT_WA_MESSAGE;
  } catch (error) {
    console.error('Gagal memuat pengaturan WhatsApp:', error);
  }

  if (!whatsappEnabled) return null;

  const normalizedNumber = normalizeWhatsAppNumber(whatsappNumber);
  if (!normalizedNumber) return null;

  const href = `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp"
      className="fixed bottom-5 right-5 z-[90] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_rgba(37,211,102,0.45)] transition hover:scale-[1.04] hover:bg-[#1fb85a] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-slate-950 md:bottom-7 md:right-7"
    >
      <MessageCircleMore className="h-7 w-7" />
      <span className="sr-only">Buka chat WhatsApp</span>
    </a>
  );
}
