export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-[#0a0a0f] text-white">
        {children}
      </body>
    </html>
  )
}