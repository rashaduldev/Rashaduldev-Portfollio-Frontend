import { CheckCircle2, Code2, Compass, Lightbulb, ShieldCheck, Sparkles, Target, Wrench } from "lucide-react";
import type { ProjectCaseStudy } from "@/lib/projectCaseStudies";

const iconClass = "h-5 w-5 text-primary";

function Heading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="mb-7 max-w-3xl"><p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-primary">{eyebrow}</p><h2 className="text-2xl font-black tracking-tight sm:text-3xl">{title}</h2>{description && <p className="mt-3 leading-7 text-muted-foreground">{description}</p>}</div>;
}

function BulletGrid({ items }: { items: string[] }) {
  return <div className="grid gap-3 sm:grid-cols-2">{items.map((item) => <div key={item} className="flex gap-3 rounded-xl border border-border bg-card/70 p-4"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><p className="text-sm leading-6 text-muted-foreground">{item}</p></div>)}</div>;
}

export default function ProjectCaseStudyView({ study, title, description }: { study: ProjectCaseStudy; title: string; description: string }) {
  return <div id="case-study" className="mt-16 space-y-20 scroll-mt-24">
    <section className="grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8"><Target className={`${iconClass} mb-5`} /><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Primary objective</p><p className="mt-3 text-xl font-bold leading-8">{study.objective}</p></div>
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8"><Heading eyebrow="Project story" title={`Why ${title} was built`} /><p className="leading-8 text-muted-foreground">{description}</p><p className="mt-4 leading-8 text-muted-foreground">The implementation translates that business goal into a structured digital experience: visitors can understand the offering quickly, move through the most important journeys without friction, and use the interface confidently across desktop, tablet and mobile.</p></div>
    </section>

    <section><Heading eyebrow="Scope" title="What was designed and delivered" description="The project is more than a landing screen—the experience is composed of connected features and reusable flows." /><BulletGrid items={study.features} /></section>

    <section className="rounded-[2rem] border border-border bg-zinc-950 p-6 text-white sm:p-9">
      <Heading eyebrow="Engineering" title="Architecture and implementation approach" description="The code is organized to keep page composition, content and interactive behaviour understandable as the project grows." />
      <div className="grid gap-4 md:grid-cols-2">{study.architecture.map((item, index) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 font-mono text-sm font-bold text-primary">0{index + 1}</div><p className="leading-7 text-zinc-300">{item}</p></div>)}</div>
    </section>

    <section><Heading eyebrow="Technology decisions" title="Why each technology was used" description="Every tool has a defined responsibility instead of being included only for trend value." /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{study.technologyReasons.map(({ name, reason }) => <article key={name} className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"><Code2 className={`${iconClass} mb-4 transition group-hover:scale-110`} /><h3 className="font-bold">{name}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{reason}</p></article>)}</div></section>

    <section><Heading eyebrow="Problem solving" title="Key challenges and practical solutions" /><div className="space-y-4">{study.challenges.map(({ problem, solution }, index) => <article key={problem} className="grid overflow-hidden rounded-2xl border border-border md:grid-cols-2"><div className="bg-amber-500/5 p-6"><div className="mb-3 flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400"><Wrench className="h-4 w-4" /> Challenge {index + 1}</div><p className="leading-7">{problem}</p></div><div className="border-t border-border bg-emerald-500/5 p-6 md:border-l md:border-t-0"><div className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400"><Lightbulb className="h-4 w-4" /> Solution</div><p className="leading-7">{solution}</p></div></article>)}</div></section>

    <section><Heading eyebrow="Delivery process" title="From requirements to production" /><div className="relative grid gap-4 md:grid-cols-5">{study.workflow.map((step, index) => <div key={step} className="relative rounded-2xl border border-border bg-card p-5"><span className="mb-4 grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-black text-primary-foreground">{index + 1}</span><p className="text-sm font-semibold leading-6">{step}</p></div>)}</div></section>

    <section className="grid gap-6 lg:grid-cols-2"><div className="rounded-2xl border border-border bg-card p-6 sm:p-8"><div className="mb-5 flex items-center gap-3"><ShieldCheck className={iconClass} /><h2 className="text-2xl font-black">Quality built into delivery</h2></div><BulletGrid items={study.quality} /></div><div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-primary p-6 text-primary-foreground sm:p-8"><Sparkles className="mb-5 h-7 w-7" /><h2 className="text-2xl font-black">The result</h2><p className="mt-4 leading-8 text-primary-foreground/85">A production-ready {study.category.toLowerCase()} with clear information architecture, purposeful technology choices, responsive interactions and a foundation that can be maintained or extended without rebuilding the experience from scratch.</p><div className="mt-6 flex items-center gap-2 text-sm font-bold"><Compass className="h-4 w-4" /> Built for real users, real devices and continued evolution.</div></div></section>
  </div>;
}
