export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Eka Maylinda Nely Nur Rohmah",
    jobTitle: "Agriculture Graduate",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Brawijaya University",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mojokerto",
      addressCountry: "ID",
    },
    email: "ekamaylindanely11@gmail.com",
    url: "https://personal-web-nely.vercel.app",
    sameAs: [
      "https://www.linkedin.com/in/eka-maylinda-nely-037a53345",
    ],
    knowsAbout: [
      "Agriculture",
      "Sustainability",
      "Community Engagement",
      "Data Analysis",
      "Project Coordination",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
