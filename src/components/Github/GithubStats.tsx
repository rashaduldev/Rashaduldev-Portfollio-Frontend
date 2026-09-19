interface GithubStatsProps { stars: number; forks: number; watchers: number }

export default function GithubStats({ stars, forks, watchers }: GithubStatsProps) {
  const stats = [
    { label: "⭐ Stars", value: stars, className: "bg-primary/50 dark:bg-primary" },
    { label: "🍴 Forks", value: forks, className: "bg-green-50 dark:bg-green-900" },
    { label: "👀 Watchers", value: watchers, className: "bg-blue-50 dark:bg-blue-900" },
  ];
  return <section className="mb-12 grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
    {stats.map((stat) => <div key={stat.label} className={`rounded-lg p-6 shadow ${stat.className}`}><h2 className="mb-2 text-xl font-semibold">{stat.label}</h2><p className="text-3xl font-bold">{stat.value}</p></div>)}
  </section>;
}
