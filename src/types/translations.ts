// types.ts

export type PortfolioJSON = {
  header: HeaderSection;
  cookieConsent: CookieConsentSection;
  main: MainSection;
  skills: SkillsSection;
  experience: ExperienceItem[];
  education: Record<string, EducationItem>;
  Educationheading:string;
  footer: FooterSection;
  projectsSection: ProjectsSection;
  testimonialsSection: TestimonialSection;
  statsSection: StatsSectionType;
  whyChooseMeSection: WhyChooseMeSectionType;
  latestArticlesSection: LatestArticlesSectionType;
  experienceHeading:string;
  contact: ContactTranslations;
  notFound: NotFoundTranslation;
  [key: string]: unknown; // Allow for additional dynamic keys
  developerIsWorking: DeveloperIsWorking;
  faq: FAQTranslation;
  services: ServicesSection
};

export interface HeaderSection {
  brand: string;
  home: string;
  projects: string;
  contact: string;
  github: string;
  articles: string;
  scrollMessage: string;
}
interface CookieConsentSection {
  title: string;
  message: string;
  accept: string;
  terms: string;
}

interface MainSection {
  subtitle: string;
  title: string;
  stack: string;
  description: string;
  leftbutton: string;
  resume: string;
  quata:string;
}

export interface SkillsSection {
  photoshop: string;
  figma: string;
  xd: string;
  illustrator: string;
  git: string;
  firebase: string;
  cloudinary: string;
  cpanel: string;
  vs: string;
  jetBrains: string;
  html: string;
  css: string;
  js: string;
  ts: string;
  gulp: string;
  astro: string;
  react: string;
  next: string;
  tailwind: string;
  node: string;
  ex: string;
  wp: string;
  tools: string;
  designTitle: string;
  devTitle: string;
  about: string;
  mongo:string;
  [key: string]: string;
}

export interface Translations {
  skills: SkillsSection;
}
export interface ExperienceItem {
  year: string;
  title: string;
  company?: string;
  department?: string;
  description?: string;
  duration?: string;
  type:string;
  location:string;  
}

interface EducationItem {
  title: string;
  company: string;
  department: string;
  description: string;
}

export interface FooterSection {
  company: string;
  projects: string;
  contact: string;
  privacy: string;
  terms: string;
  resources: string;
  articles: string;
  help: string;
  follow: string;
  newsletter: string;
  newsletterDesc: string;
  emailPlaceholder: string;
  subscribe: string;
  subscribeSuccess: string;
  copyright: string;
}

export interface Project {
  title: string;
  description: string;
  desktopimage: string;
  mobileimage: string;
  techStack: string;
  endtrac: string;
  id: number;
  githubLink: string;
  liveLink: string;
  status: string;
}

interface ProjectsSection {
  projectsHeading: string;
  trustedProjects: string;
  viewallproject: string;
  AllProjects: string;
  projects: Project[];
}

interface TestimonialItem {
  quote: string;
  highlight: string;
  image: string;
  name: string;
  username: string;
}

interface TestimonialSection {
  testimonialHeading: string;
  trustedClients: string;
  testimonials: TestimonialItem[];
}

export interface StatsSectionType {
  title: string;
  stats: StatItem[];
}

export interface StatItem {
  value: number;
  label: string;
}

export interface WhyChooseMeSectionType {
  title: string;
  description: string;
  contactbutton: string;
  contactdescription: string;
  features: FeatureItem[];
}

export interface FeatureItem {
  title: string;
  description: string;
}

export interface LatestArticlesSectionType {
  lefttitle: string;
  title: string;
  viewAllLabel: string;
  readMoreLabel: string;
  articles: ArticleItem[];
}

export interface ArticleItem {
  title: string;
  category: string;
  date: string;
  imageUrl: string;
  id: number;
  description: string
}
export interface ContactTranslations {
  heroTitle: string;
  letsConnect: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  namePlaceholder: string;
  phonePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  sendButton: string;
  ctaTitle: string;
  ctaDescription: string;
}
export interface NotFoundTranslation {
  title: string;
  description: string;
  backToHome: string;
};
export interface DeveloperIsWorking {
  title: string;
  description: string;
  backToHome: string;
}
export type FAQ = {
  question: string
  answer: string
}

type FAQTranslation = {
  faqTitle: string
  faqDescription: string
  items: FAQ[]
}
export type Service = {
  title: string;
  description: string;
  image: string;
};
type ServicesSection = {
  title: string;
  items: Service[];
};
// github type
export interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  updated_at: string;
  pushed_at: string;
}
export interface User {
  avatar_url: string;
  html_url: string;
  login: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}