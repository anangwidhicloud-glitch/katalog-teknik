-- Aman dijalankan berulang kali di Neon SQL Editor.
-- Tidak menghapus data yang sudah ada.

CREATE TABLE IF NOT EXISTS partners (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  url_logo TEXT NOT NULL
);

-- Jika tabel partners sudah dibuat sebelumnya hanya dengan nama dan url_logo,
-- perintah berikut menambahkan id tanpa menghapus data lama.
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS id BIGSERIAL;

ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS nama TEXT;

ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS url_logo TEXT;
