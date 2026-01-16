"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Repo, User } from "@/types/translations";
import Image from "next/image";
import { LayoutContext } from "@/components/context";

export default function GithubProjects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const username = "rashaduldev";
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider"
    );
  }
  const { isRTL } = context;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch user profile
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error("Failed to fetch GitHub user profile");
        const userData: User = await userRes.json();

        // Fetch repos (up to 100 latest)
        const reposRes = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
        );
        if (!reposRes.ok) throw new Error("Failed to fetch GitHub repos");
        const reposData: Repo[] = await reposRes.json();

        setUser(userData);
        setRepos(reposData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [username]);

  // Compute combined stats & languages
  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const totalWatchers = repos.reduce(
    (sum, repo) => sum + repo.watchers_count,
    0
  );

  // Languages usage frequency
  const languageCount: Record<string, number> = {};
  repos.forEach((repo) => {
    if (repo.language) {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
    }
  });

  // Most used language
  const mostUsedLanguage =
    Object.entries(languageCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // Unique languages list
  const allLanguages = Object.keys(languageCount);

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <h1 className="text-4xl font-semibold mb-6 text-gray-900 dark:text-white">
          My GitHub Profile
        </h1>
        <svg
          className="animate-spin h-12 w-12 text-primary mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading spinner"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p className="text-center text-gray-700 dark:text-gray-300 text-lg">
          Loading projects and profile, please wait...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <>
        <h1 className="text-4xl font-bold text-center">
          My GitHub Projects
        </h1>
        <p className="text-red-600 text-center">Error: {error}</p>
      </>
    );
  }

  return (
    <>
      {/* Profile Section */}
      {user && (
        <section
          dir={isRTL ? "rtl" : "ltr"}
          className={`mb-12 max-w-4xl mx-auto flex flex-col ${
            isRTL ? "md:flex-row-reverse" : "md:flex-row-reverse"
          } items-center md:items-start gap-6 border-b-2 pb-8`}
        >
          <Image
            src={user.avatar_url}
            alt={`${user.login} avatar`}
            width={128}
            height={128}
            className="rounded-full object-cover shadow-lg"
          />
          <div className={`flex-1 ${isRTL ? "md:text-right" : "md:text-left"}`}>
            <h1 className="text-4xl font-bold">{user.name || user.login}</h1>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              {user.bio || "No bio provided."}
            </p>
            <div
              className={`mt-4 flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600 dark:text-gray-400`}
            >
              <p>
                <strong>Repos:</strong> {user.public_repos}
              </p>
              <p>
                <strong>Followers:</strong> {user.followers}
              </p>
              <p>
                <strong>Following:</strong> {user.following}
              </p>
              <p>
                <strong>Most Used Lang:</strong> {mostUsedLanguage}
              </p>
            </div>
            <div className="mt-4">
              <Link
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View GitHub Profile
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Summary Stats */}
      <section className="mb-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="p-6 bg-primary/50 dark:bg-primary rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">⭐ Stars</h2>
          <p className="text-3xl font-bold">{totalStars}</p>
        </div>
        <div className="p-6 bg-green-50 dark:bg-green-900 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">🍴 Forks</h2>
          <p className="text-3xl font-bold">{totalForks}</p>
        </div>
        <div className="p-6 bg-blue-50 dark:bg-blue-900 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">👀 Watchers</h2>
          <p className="text-3xl font-bold">{totalWatchers}</p>
        </div>
      </section>

      {/* Language list */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Languages Used</h2>
        <div className="flex flex-wrap gap-3">
          {allLanguages.length > 0 ? (
            allLanguages.map((lang) => (
              <span
                key={lang}
                className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {lang}
              </span>
            ))
          ) : (
            <p>No languages detected.</p>
          )}
        </div>
      </section>

      {/* Repo List */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Repositories</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="border rounded-lg p-5 shadow hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">{repo.name}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 min-h-15">
                  {repo.description || "No description provided."}
                </p>
              </div>

              <div className="flex flex-wrap justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong>Language:</strong> {repo.language || "N/A"}
                </p>
                <p>
                  ⭐ {repo.stargazers_count} | Forks: {repo.forks_count}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                <p>
                  Last commit: {new Date(repo.pushed_at).toLocaleDateString()}
                </p>
                <div className="space-x-3">
                  <Link
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600 hover:text-blue-800"
                  >
                    GitHub
                  </Link>
                  {repo.homepage && (
                    <Link
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-green-600 hover:text-green-800"
                    >
                      Live Demo
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
