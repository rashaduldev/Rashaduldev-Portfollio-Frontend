import Image from "next/image";
import Link from "next/link";
import type { User } from "@/types/translations";

interface GithubProfileProps { user: User; mostUsedLanguage: string; isRTL: boolean }

export default function GithubProfile({ user, mostUsedLanguage, isRTL }: GithubProfileProps) {
  return <section dir={isRTL ? "rtl" : "ltr"} className="mx-auto mb-12 flex max-w-4xl flex-col items-center gap-6 border-b-2 pb-8 md:flex-row-reverse md:items-start">
    <Image src={user.avatar_url} alt={`${user.login} avatar`} width={128} height={128} className="rounded-full object-cover shadow-lg" />
    <div className={`flex-1 ${isRTL ? "md:text-right" : "md:text-left"}`}>
      <h1 className="text-4xl font-bold">{user.name || user.login}</h1>
      <p className="mt-2 text-gray-700 dark:text-gray-300">{user.bio || "No bio provided."}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400 md:justify-start">
        <p><strong>Repos:</strong> {user.public_repos}</p><p><strong>Followers:</strong> {user.followers}</p>
        <p><strong>Following:</strong> {user.following}</p><p><strong>Most Used Lang:</strong> {mostUsedLanguage}</p>
      </div>
      <Link href={user.html_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-blue-600 hover:underline">View GitHub Profile</Link>
    </div>
  </section>;
}
