import Image from "next/image";
import { BookOpen, CalendarDays, Clock3, UserRound } from "lucide-react";

interface Props { title: string; subtitle: string; category: string; date: string; author: string; readTime: string; image: string }

export default function ArticleEditorialHero({ title, subtitle, category, date, author, readTime, image }: Props) {
  return <header className="overflow-hidden rounded-b-[2.5rem] border-x border-b border-border bg-card shadow-xl shadow-primary/5">
    <div className="mx-auto grid max-w-7xl items-stretch lg:grid-cols-[1.02fr_.98fr]">
      <div className="flex flex-col justify-center px-5 py-12 sm:px-10 lg:px-14 lg:py-20">
        <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-primary"><BookOpen className="h-4 w-4" /> {category}</div>
        <h1 className="text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground"><span className="inline-flex items-center gap-2"><UserRound className="h-4 w-4 text-primary" /> {author}</span><span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> {date}</span><span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary" /> {readTime}</span></div>
      </div>
      <div className="relative min-h-80 overflow-hidden lg:min-h-[560px]"><Image fill priority src={image} alt={title} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent lg:bg-gradient-to-r lg:from-card/20 lg:to-transparent" /></div>
    </div>
  </header>;
}
