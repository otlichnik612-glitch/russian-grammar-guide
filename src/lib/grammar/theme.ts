import type { PartOfSpeech } from "./types";

const SHARED = {
  card: "bg-paper text-ink border-line",
  chip: "bg-paper-2 text-ink",
  bar: "bg-primary",
  label: "",
};

export const POS_THEME: Record<
  PartOfSpeech,
  {
    card: string;
    chip: string;
    bar: string;
    label: string;
  }
> = {
  nouns: { ...SHARED, label: "Nouns" },
  adjectives: { ...SHARED, label: "Adjectives" },
  verbs: { ...SHARED, label: "Verbs" },
  numerals: { ...SHARED, label: "Numerals" },
  pronouns: { ...SHARED, label: "Pronouns" },
};
