import type { Repo, User } from "@/types/translations";

const GITHUB_USER = "rashaduldev";
const FALLBACK_USER: User = {
  avatar_url: "/assets/rashadul.svg",
  html_url: `https://github.com/${GITHUB_USER}`,
  login: GITHUB_USER,
  name: "Md Rashadul Islam",
  bio: "Frontend Developer specializing in modern, responsive web applications.",
  public_repos: 0,
  followers: 0,
  following: 0,
};

async function githubFetch<T>(path: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`GitHub API request failed with ${response.status}`);
  return response.json() as Promise<T>;
}

export async function getGithubPortfolio(): Promise<{ user: User; repos: Repo[] }> {
  try {
    const [user, repos] = await Promise.all([
      githubFetch<User>(`/users/${GITHUB_USER}`),
      githubFetch<Repo[]>(`/users/${GITHUB_USER}/repos?per_page=100&sort=updated`),
    ]);
    return { user, repos };
  } catch {
    return { user: FALLBACK_USER, repos: [] };
  }
}
