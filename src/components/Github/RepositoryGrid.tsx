import Link from "next/link";
import type { Repo } from "@/types/translations";

export default function RepositoryGrid({ repos }: { repos: Repo[] }) {
  return <section><h2 className="mb-8 text-center text-3xl font-bold">Repositories</h2><div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
    {repos.map((repo) => <article key={repo.id} className="flex cursor-pointer flex-col justify-between rounded-lg border p-5 shadow transition hover:shadow-lg">
      <div><h3 className="mb-2 text-xl font-semibold">{repo.name}</h3><p className="mb-4 min-h-15 text-gray-700 dark:text-gray-300">{repo.description || "No description provided."}</p></div>
      <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 dark:text-gray-400"><p><strong>Language:</strong> {repo.language || "N/A"}</p><p>⭐ {repo.stargazers_count} | Forks: {repo.forks_count}</p></div>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500"><p>Last commit: {new Date(repo.pushed_at).toLocaleDateString()}</p><div className="space-x-3">
        <Link href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">GitHub</Link>
        {repo.homepage && <Link href={repo.homepage} target="_blank" rel="noopener noreferrer" className="text-green-600 underline hover:text-green-800">Live Demo</Link>}
      </div></div>
    </article>)}
  </div></section>;
}
