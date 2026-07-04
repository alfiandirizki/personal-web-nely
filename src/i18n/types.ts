export interface Dictionary {
  nav: {
    about: string;
    experience: string;
    education: string;
    skills: string;
    contact: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    cta1: string;
    cta2: string;
    location: string;
    university: string;
  };
  about: {
    title: string;
    p1: string;
    p2: string;
    p3: string;
    stat1Label: string;
    stat2Label: string;
    stat3Label: string;
  };
  experience: {
    title: string;
    workLabel: string;
    internLabel: string;
    orgLabel: string;
    jobs: {
      title: string;
      company: string;
      period: string;
      description: string[];
      highlights: string[];
    }[];
    internship: {
      title: string;
      company: string;
      period: string;
      description: string[];
      highlights: string[];
    };
    organizational: {
      title: string;
      company: string;
      period: string;
      description: string[];
      highlights: string[];
    }[];
  };
  education: {
    title: string;
    degree: string;
    school: string;
    period: string;
    publicationTitle: string;
    publicationPeriod: string;
    publicationText: string;
  };
  skills: {
    title: string;
    categories: {
      category: string;
      skills: string[];
    }[];
  };
  contact: {
    title: string;
    description: string;
    cta: string;
    ctaButton: string;
    email: string;
    phone: string;
    linkedin: string;
    location: string;
  };
  footer: {
    rights: string;
  };
}
