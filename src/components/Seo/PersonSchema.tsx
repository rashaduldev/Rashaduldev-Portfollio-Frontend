import JsonLd from "./JsonLd";
import { SITE_URL, SOCIAL_PROFILES } from "@/lib/seo";

export default function PersonSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Md Rashadul Islam",
        jobTitle: "Full Stack Developer",
        url: SITE_URL,
        image: `${SITE_URL}/assets/rashadul-portfollio.png`,
        sameAs: SOCIAL_PROFILES,
        knowsAbout: ["MERN Stack", "Next.js", "TypeScript", "React", "Node.js", "Express", "MongoDB", "Web Application Architecture"],
      }}
    />
  );
}
