import GithubProjects from "@/components/Github/Github";
import { getGithubPortfolio } from "@/lib/github";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({ title: "GitHub Projects", description: "Explore Md Rashadul Islam's open-source repositories, languages, and recent GitHub work.", path: "/github", keywords: ["GitHub portfolio", "open source developer"] });

const GithubPage = async () => {
  const { repos, user } = await getGithubPortfolio();
  return (
    <div className="my-10">
      <GithubProjects repos={repos} user={user} />
    </div>
  );
};

export default GithubPage;
