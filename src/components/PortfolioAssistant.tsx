"use client";

import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, ExternalLink, Loader2, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { LayoutContext } from "@/components/context";
import { usePathname } from "next/navigation";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  outOfScope?: boolean;
};

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "8801603010103";
const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;

const suggestions = [
  "What services do you offer?",
  "Show me recent projects",
  "What is your experience?",
];

export default function PortfolioAssistant() {
  const context = useContext(LayoutContext);
  const pathname = usePathname();
  const locale = context?.language ?? "en";
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I’m Rashadul—welcome to my portfolio. Ask me about my skills, experience, projects, education, or services.",
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 250);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (value: string) => {
    const question = value.trim();
    if (!question || loading) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content: question,
    };
    const priorMessages = messages.filter((message) => message.id !== "welcome");
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          locale,
          history: priorMessages.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = (await response.json()) as {
        reply?: string;
        message?: string;
        outOfScope?: boolean;
      };
      if (!response.ok) throw new Error(data.message || "Unable to answer right now.");

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: data.reply ?? "Please contact Rashadul for more information.",
          outOfScope: data.outOfScope,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "I’m temporarily unavailable. Please reach out on WhatsApp.",
          outOfScope: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  if (pathname.startsWith("/dashboard") || pathname === "/login") return null;

  return (
    <div className="fixed bottom-5 right-4 z-[70] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-modal="false"
            aria-label="Rashadul portfolio assistant"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="mb-1 flex h-[min(560px,calc(100vh-220px))] min-h-[320px] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/20 dark:border-white/10 dark:bg-zinc-950"
          >
            <header className="flex items-center justify-between bg-linear-to-br from-[#cc4e00] to-[#9f3200] px-4 py-3.5 text-white">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
                  <Bot className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold leading-tight">Rashadul AI</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Portfolio assistant
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Close portfolio assistant"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto bg-zinc-50 px-4 py-4 dark:bg-zinc-950" aria-live="polite">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[86%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                      message.role === "user"
                        ? "rounded-br-md bg-[#cc4e00] text-white"
                        : "rounded-bl-md border border-zinc-200 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    {message.content}
                    {message.outOfScope && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex w-fit items-center gap-2 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#1ebe5d]"
                      >
                        Chat on WhatsApp <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void sendMessage(suggestion)}
                      className="rounded-full border border-[#cc4e00]/25 bg-[#cc4e00]/5 px-3 py-1.5 text-left text-xs text-[#a63f00] transition hover:border-[#cc4e00]/50 hover:bg-[#cc4e00]/10 dark:text-orange-300"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                    <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form onSubmit={submit} className="border-t border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center gap-2 rounded-2xl border border-zinc-300 bg-zinc-50 p-1.5 pl-3 focus-within:border-[#cc4e00] focus-within:ring-2 focus-within:ring-[#cc4e00]/15 dark:border-zinc-700 dark:bg-zinc-900">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  maxLength={800}
                  placeholder="Ask about Rashadul’s work…"
                  className="min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-white"
                  aria-label="Ask a portfolio question"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#cc4e00] text-white transition hover:bg-[#ad4100] disabled:cursor-not-allowed disabled:opacity-45"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-zinc-500">
                Answers are limited to verified portfolio information.
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-end gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Rashadul on WhatsApp"
          className="group flex h-12 items-center gap-2 overflow-hidden rounded-full bg-[#25D366] px-3.5 text-white shadow-lg shadow-emerald-950/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#1fbd5a] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
        >
          <MessageCircle className="h-5 w-5 fill-current" aria-hidden="true" />
          <span className="max-w-0 whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-28 group-hover:opacity-100 sm:max-w-28 sm:opacity-100">
            WhatsApp
          </span>
        </a>

        <motion.button
          type="button"
          onClick={() => setOpen((current) => !current)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          aria-label={open ? "Close AI portfolio assistant" : "Ask AI — open portfolio assistant"}
          aria-expanded={open}
          className="group flex h-14 items-center gap-2 rounded-full bg-zinc-950 px-4 text-white shadow-xl shadow-black/25 ring-1 ring-white/10 transition hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#cc4e00] dark:bg-white dark:text-zinc-950"
        >
          {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5 text-orange-400" />}
          <span className="text-sm font-semibold">{open ? "Close" : "Ask AI"}</span>
        </motion.button>
      </div>
    </div>
  );
}
