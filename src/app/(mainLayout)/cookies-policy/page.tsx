import Image from "next/image";
import { getSettings } from "@/actions/settings/settings";

export const dynamic = "force-dynamic";

export default async function CookiesPolicy() {
  const response = await getSettings();
  const policy = response.payload?.cookiePolicy;
  const title = policy?.title || "Cookie Policy";
  const content = policy?.content || `This website uses essential cookies to remember preferences such as your theme, language, and cookie-consent choice. These cookies are required for the site to work correctly.

Anonymous analytics may be used to understand page traffic and improve performance. Analytics data is aggregated and is not used to identify you personally.

If you sign in to the administration area, secure authentication cookies are used to protect the session. You can remove non-essential cookies at any time through your browser settings.

For questions about this policy, please use the contact page.`;
  return <main className="max-w-7xl mx-auto mt-24 rounded overflow-hidden border px-3 md:px-0 my-10">
    {policy?.bannerImage && <div className="relative w-full h-64 sm:h-96"><Image src={policy.bannerImage} alt={title} fill className="object-cover" priority /></div>}
    <section className="p-8"><h1 className="text-3xl font-bold mb-6">{title}</h1><div className="whitespace-pre-wrap leading-relaxed">{content}</div></section>
  </main>;
}

export const metadata = { title: "Rashaduldev - Cookies Policy", description: "Cookie policy for this website." };
