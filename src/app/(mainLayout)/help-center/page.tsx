import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Answers and contact options for working with Md Rashadul Islam.",
};

const questions = [
  ["How quickly will I receive a reply?", "Most project and support enquiries receive a response within one business day."],
  ["What information should I include?", "Share your goals, preferred timeline, budget range, and any designs or technical requirements you already have."],
  ["Can you support an existing website?", "Yes. I can investigate bugs, improve performance and accessibility, or add features to an existing codebase."],
  ["Do you work remotely?", "Yes. I work with clients remotely and can coordinate across time zones."],
];

export default function HelpCenterPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold">Help Center</h1>
        <p className="mt-3 text-muted-foreground">Quick answers before you get in touch.</p>
      </header>
      <div className="space-y-4">
        {questions.map(([question, answer]) => (
          <section key={question} className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">{question}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{answer}</p>
          </section>
        ))}
      </div>
      <div className="mt-10 rounded-xl bg-primary/10 p-6 text-center">
        <h2 className="text-xl font-semibold">Still need help?</h2>
        <p className="mt-2 text-sm text-muted-foreground">Send a message with the details and I’ll get back to you.</p>
        <Link href="/contact" className="mt-4 inline-flex rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">
          Contact me
        </Link>
      </div>
    </main>
  );
}
