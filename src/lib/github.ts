import type { Repo, User } from "@/types/translations";

const GITHUB_USER = "rashaduldev";

async function githubFetch<T>(path: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: { Accept: "application/vnd.github+json" },
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`GitHub API request failed with ${response.status}`);
  return response.json() as Promise<T>;
}

export async function getGithubPortfolio(): Promise<{ user: User; repos: Repo[] }> {
  const [user, repos] = await Promise.all([
    githubFetch<User>(`/users/${GITHUB_USER}`),
    githubFetch<Repo[]>(`/users/${GITHUB_USER}/repos?per_page=100&sort=updated`),
  ]);
  return { user, repos };
}
