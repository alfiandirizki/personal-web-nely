// Root layout is now handled by [locale]/layout.tsx
// This file exists only to satisfy Next.js requirements for app directory

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
