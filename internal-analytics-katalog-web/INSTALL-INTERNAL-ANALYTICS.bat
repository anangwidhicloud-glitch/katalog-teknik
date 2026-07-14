@echo off
setlocal
cd /d "%~dp0"

echo Memasang Analytics Internal Katalog...
echo.

if not exist package.json (
  echo GAGAL: Extract isi ZIP ke root project yang berisi package.json.
  pause
  exit /b 1
)

node install-internal-analytics.mjs
if errorlevel 1 (
  echo.
  echo Instalasi gagal.
  pause
  exit /b 1
)

echo.
echo Instalasi file selesai.
echo Jalankan SQL database\ensure-site-analytics-table.sql di Neon SQL Editor.
pause
