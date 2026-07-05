import { getDictionary, locales, defaultLocale } from "@/i18n/dictionaries";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileNav from "@/components/MobileNav";
import LandingContent from "@/components/LandingContent";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = locales.includes(locale as (typeof locales)[number])
    ? locale
    : defaultLocale;
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background border-b-2 sm:border-b-3 border-neo-border animate-slide-down">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <a
              href={`/${lang}`}
              className="neo-btn bg-neo-green px-3 py-1.5 sm:px-4 sm:py-2 text-base sm:text-lg font-black"
            >
              EN.
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <a href="#about" className="nav-link text-sm">
                {dict.nav.about}
              </a>
              <a href="#experience" className="nav-link text-sm">
                {dict.nav.experience}
              </a>
              <a href="#education" className="nav-link text-sm">
                {dict.nav.education}
              </a>
              <a href="#skills" className="nav-link text-sm">
                {dict.nav.skills}
              </a>
              <a
                href="#contact"
                className="neo-btn bg-neo-pink px-4 py-1.5 text-sm text-neo-border"
              >
                {dict.nav.contact}
              </a>
              <LanguageSwitcher locale={lang} />
            </div>

            {/* Mobile nav */}
            <MobileNav dict={dict.nav} locale={lang} />
          </div>
        </div>
      </nav>

      <main>
        <LandingContent locale={lang} dict={dict} />
      </main>

      {/* Footer */}
      <footer className="border-t-2 sm:border-t-3 border-neo-border mt-12 sm:mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="font-bold text-xs sm:text-sm">
              © {new Date().getFullYear()} Eka Maylinda Nely.{" "}
              {dict.footer.rights}
            </p>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="neo-tag">Next.js</span>
              <span className="neo-tag">Tailwind</span>
              <span className="neo-tag">TypeScript</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
