import Image from "next/image";
import { getSettings } from "@/actions/settings/settings";

export default async function CookiesPolicy() {
  const response = await getSettings();
  const policy = response.payload?.cookiePolicy;
  if (!policy?.content) return <main className="max-w-4xl mx-auto mt-24 my-10 p-8 text-center">Cookie policy is not available.</main>;
  return <main className="max-w-7xl mx-auto mt-24 rounded overflow-hidden border px-3 md:px-0 my-10">
    {policy.bannerImage && <div className="relative w-full h-64 sm:h-96"><Image src={policy.bannerImage} alt={policy.title || "Cookie policy"} fill className="object-cover" priority /></div>}
    <section className="p-8"><h1 className="text-3xl font-bold mb-6">{policy.title || "Cookie Policy"}</h1><div className="whitespace-pre-wrap leading-relaxed">{policy.content}</div></section>
  </main>;
}

export const metadata = { title: "Rashaduldev - Cookies Policy", description: "Cookie policy for this website." };
