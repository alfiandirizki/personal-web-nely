import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { locales, defaultLocale } from "@/i18n/dictionaries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Eka Maylinda Nely | Agriculture Graduate",
  description:
    "Personal website of Eka Maylinda Nely Nur Rohmah, S.P. — Agriculture graduate with strong analytical, communication, and stakeholder engagement skills.",
  keywords: [
    "agriculture",
    "sustainability",
    "community engagement",
    "research",
    "portfolio",
  ],
  authors: [{ name: "Eka Maylinda Nely Nur Rohmah" }],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const lang = locales.includes(locale as typeof locales[number]) ? locale : defaultLocale;

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
