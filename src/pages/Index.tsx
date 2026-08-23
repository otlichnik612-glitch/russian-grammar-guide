import { Link } from "react-router-dom";
import { BookOpen, Hash, Layers, MessageSquareText, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { POS_META, POS_ORDER } from "@/lib/grammar/labels";
import type { PartOfSpeech } from "@/lib/grammar/types";

const ICONS: Record<PartOfSpeech, LucideIcon> = {
  nouns: BookOpen,
  adjectives: Layers,
  verbs: MessageSquareText,
  numerals: Hash,
  pronouns: User,
};

const TINTS: Record<PartOfSpeech, string> = {
  nouns: "bg-mint",
  adjectives: "bg-sage",
  verbs: "bg-sky",
  numerals: "bg-rose",
  pronouns: "bg-sand",
};

export default function Index() {
  return (
    <main id="main" lang="en" className="mx-auto w-full max-w-lg px-4 py-8 sm:px-6">
      <h1 className="font-display text-4xl font-semibold tracking-tight">
        Russian Grammar Guide
      </h1>
      <p className="mt-3 text-lg text-ink-soft">Choose a part of speech</p>

      <nav aria-label="Parts of speech" className="mt-8">
        <ul className="grid list-none gap-3 p-0">
          {POS_ORDER.map((pos) => {
            const meta = POS_META[pos];
            const Icon = ICONS[pos];
            return (
              <li key={pos}>
                <Link
                  to={`/train/${pos}`}
                  aria-label={meta.title}
                  className={`flex min-h-16 items-center gap-4 rounded-[1.75rem] px-4 py-4 text-ink no-underline ${TINTS[pos]}`}
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/70 text-primary">
                    <Icon className="size-5" aria-hidden="true" strokeWidth={2} />
                  </span>
                  <span className="font-display text-2xl font-semibold">{meta.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </main>
  );
}
