"use client";

import { useContext, useMemo } from "react";
import { LayoutContext } from "@/components/context";
import type { Repo, User } from "@/types/translations";
import GithubProfile from "./GithubProfile";
import GithubStats from "./GithubStats";
import RepositoryGrid from "./RepositoryGrid";

interface GithubProjectsProps { repos: Repo[]; user: User }

export default function GithubProjects({ repos, user }: GithubProjectsProps) {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("LayoutContext must be used within a LayoutContext.Provider");

  const summary = useMemo(() => {
    const languageCount = repos.reduce<Record<string, number>>((counts, repo) => {
      if (repo.language) counts[repo.language] = (counts[repo.language] ?? 0) + 1;
      return counts;
    }, {});
    return {
      stars: repos.reduce((total, repo) => total + repo.stargazers_count, 0),
      forks: repos.reduce((total, repo) => total + repo.forks_count, 0),
      watchers: repos.reduce((total, repo) => total + repo.watchers_count, 0),
      languages: Object.keys(languageCount),
      mostUsedLanguage: Object.entries(languageCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A",
    };
  }, [repos]);

  return <>
    <GithubProfile user={user} mostUsedLanguage={summary.mostUsedLanguage} isRTL={context.isRTL} />
    <GithubStats stars={summary.stars} forks={summary.forks} watchers={summary.watchers} />
    <section className="mb-12">
      <h2 className="mb-4 text-2xl font-semibold">Languages Used</h2>
      <div className="flex flex-wrap gap-3">
        {summary.languages.length ? summary.languages.map((language) => <span key={language} className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium dark:bg-gray-700">{language}</span>) : <p>No languages detected.</p>}
      </div>
    </section>
    <RepositoryGrid repos={repos} />
  </>;
}
