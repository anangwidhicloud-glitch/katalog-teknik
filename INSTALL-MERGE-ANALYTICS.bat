@echo off
setlocal
cd /d "%~dp0"

if not exist package.json (
  echo.
  echo ERROR: Letakkan file BAT dan MJS ini di root project, sejajar dengan package.json.
  echo.
  pause
  exit /b 1
)

echo Menggabungkan Analytics Produk dan Analytics Kunjungan...
node install-merge-analytics.mjs
if errorlevel 1 (
  echo.
  echo Instalasi gagal.
  pause
  exit /b 1
)

echo.
echo Instalasi selesai.
pause
