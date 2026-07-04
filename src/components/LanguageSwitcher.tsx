"use client";

import { usePathname } from "next/navigation";

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();

  const switchTo = locale === "en" ? "id" : "en";
  const label = locale === "en" ? "🇮🇩 ID" : "🇬🇧 EN";

  // Replace current locale in the path
  const segments = pathname.split("/");
  segments[1] = switchTo;
  const newPath = segments.join("/") || `/${switchTo}`;

  return (
    <a href={newPath} className="neo-btn bg-neo-orange px-3 py-1.5 text-sm">
      {label}
    </a>
  );
}
