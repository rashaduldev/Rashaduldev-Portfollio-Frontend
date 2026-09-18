import en from "@/app/translations/en.json";
import bn from "@/app/translations/bn.json";
import ar from "@/app/translations/ar.json";

export type TranslationLocale = "en" | "bn" | "ar";

export const websiteContent = {
  projects: en.projectsSection.projects,
  experience: en.experience,
  education: Object.entries(en.education)
    .map(([year, item]) => ({ year, ...item }))
    .sort((a, b) => Number(b.year) - Number(a.year)),
};

export const localizedProjects = {
  en: en.projectsSection.projects,
  bn: bn.projectsSection.projects,
  ar: ar.projectsSection.projects,
};

export const translationCoverage: Record<
  TranslationLocale,
  { projects: number; experience: number; education: number }
> = {
  en: {
    projects: en.projectsSection.projects.length,
    experience: en.experience.length,
    education: Object.keys(en.education).length,
  },
  bn: {
    projects: bn.projectsSection.projects.length,
    experience: bn.experience.length,
    education: Object.keys(bn.education).length,
  },
  ar: {
    projects: ar.projectsSection.projects.length,
    experience: ar.experience.length,
    education: Object.keys(ar.education).length,
  },
};

export const languageCount = Object.keys(translationCoverage).length;
