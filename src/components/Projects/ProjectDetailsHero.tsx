import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowDown, Layers3 } from "lucide-react";

interface Props {
  title: string;
  description: string;
  category: string;
  image?: string;
  technologies: string[];
  actions: ReactNode;
}

export default function ProjectDetailsHero({ title, description, category, image, technologies, actions }: Props) {
  return <header className="relative overflow-hidden rounded-[2rem] border border-border bg-card px-5 py-8 shadow-xl shadow-primary/5 sm:px-8 lg:px-12 lg:py-12">
    <div aria-hidden className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
    <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.16em] text-primary"><Layers3 className="h-3.5 w-3.5" /> {category}</div>
        <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">{description}</p>
        <div className="mt-6 flex flex-wrap gap-2">{technologies.map((technology) => <span key={technology} className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-semibold">{technology}</span>)}</div>
        <div className="mt-8 flex flex-wrap items-center gap-3">{actions}<a href="#case-study" className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary">Explore case study <ArrowDown className="h-4 w-4" /></a></div>
      </div>
      {image && <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-muted shadow-2xl"><Image fill priority src={image} alt={`${title} project preview`} sizes="(max-width: 1024px) 100vw, 52vw" className="object-cover object-top transition duration-700 hover:scale-[1.02]" /><div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" /></div>}
    </div>
  </header>;
}
