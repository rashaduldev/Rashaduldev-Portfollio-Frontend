import { ArrowRight, Check, Lightbulb, ListChecks, Quote, Sparkles } from "lucide-react";
import type { ArticleEditorial } from "@/lib/articleEditorial";

export default function ArticleEditorialBody({ editorial, originalContent }: { editorial: ArticleEditorial; originalContent?: string }) {
  const paragraphs = originalContent?.split(/\n\s*\n/).filter(Boolean) ?? [];
  return <article className="min-w-0">
    <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8"><div className="mb-5 flex items-center gap-3"><Sparkles className="h-5 w-5 text-primary" /><h2 className="text-xl font-black">What you will learn</h2></div><div className="grid gap-3 sm:grid-cols-2">{editorial.takeaways.map((item) => <div key={item} className="flex gap-3 rounded-xl bg-background/70 p-4 text-sm leading-6"><Check className="mt-1 h-4 w-4 shrink-0 text-primary" />{item}</div>)}</div></section>

    {paragraphs.length > 0 && <section className="mt-12"><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-primary">Introduction</p><div className="space-y-6">{paragraphs.map((paragraph, index) => <p key={index} className={`${index === 0 ? "text-xl font-medium leading-9 text-foreground first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-black first-letter:text-primary" : "text-base leading-8 text-muted-foreground"}`}>{paragraph}</p>)}</div></section>}

    <div className="mt-14 space-y-16">{editorial.sections.map((section, index) => <section id={`section-${index + 1}`} key={section.title} className="scroll-mt-24">
      <div className="mb-5 flex items-start gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary font-mono text-sm font-black text-primary-foreground">{String(index + 1).padStart(2, "0")}</span><div><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Deep dive</p><h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{section.title}</h2></div></div>
      <p className="text-lg leading-8 text-foreground">{section.introduction}</p><p className="mt-5 leading-8 text-muted-foreground">{section.details}</p>
      {section.checklist && <div className="mt-6 rounded-2xl border border-border bg-card p-5"><div className="mb-4 flex items-center gap-2 text-sm font-bold"><ListChecks className="h-5 w-5 text-primary" /> Practical checklist</div><ul className="grid gap-3 sm:grid-cols-2">{section.checklist.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-muted-foreground"><ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul></div>}
    </section>)}</div>

    <section className="mt-16 rounded-[2rem] bg-zinc-950 p-6 text-white sm:p-9"><div className="mb-6 flex items-center gap-3"><Lightbulb className="h-6 w-6 text-primary" /><h2 className="text-2xl font-black">Put it into practice</h2></div><ol className="grid gap-4 sm:grid-cols-2">{editorial.practicalSteps.map((step, index) => <li key={step} className="flex gap-4 rounded-xl border border-white/10 bg-white/[.04] p-4"><span className="font-mono text-sm font-black text-primary">{String(index + 1).padStart(2, "0")}</span><span className="text-sm leading-6 text-zinc-300">{step}</span></li>)}</ol></section>

    <blockquote className="relative mt-16 overflow-hidden rounded-[2rem] border border-primary/25 bg-primary p-7 text-primary-foreground sm:p-10"><Quote className="absolute -right-4 -top-5 h-28 w-28 opacity-10" /><p className="text-xs font-bold uppercase tracking-[.2em] opacity-75">Final perspective</p><p className="relative mt-4 text-xl font-bold leading-9 sm:text-2xl">{editorial.conclusion}</p></blockquote>
  </article>;
}
