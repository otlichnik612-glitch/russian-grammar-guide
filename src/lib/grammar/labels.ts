import type { AnimacyId, CaseId, Choice, GenderId, NumberId, PartOfSpeech } from "./types";

export const POS_ORDER: PartOfSpeech[] = [
  "nouns",
  "adjectives",
  "verbs",
  "numerals",
  "pronouns",
];

export const POS_META: Record<
  PartOfSpeech,
  { title: string; kicker: string; description: string; href: "/train/$pos"; pos: PartOfSpeech }
> = {
  nouns: {
    title: "Nouns",
    kicker: "Who? What?",
    description: "Endings by case, number and gender.",
    href: "/train/$pos",
    pos: "nouns",
  },
  adjectives: {
    title: "Adjectives",
    kicker: "Which one?",
    description: "Hard and soft endings by case.",
    href: "/train/$pos",
    pos: "adjectives",
  },
  verbs: {
    title: "Verbs",
    kicker: "What happens?",
    description: "Present, past and future forms.",
    href: "/train/$pos",
    pos: "verbs",
  },
  numerals: {
    title: "Numerals",
    kicker: "How many?",
    description: "Cardinal and ordinal forms by case.",
    href: "/train/$pos",
    pos: "numerals",
  },
  pronouns: {
    title: "Pronouns",
    kicker: "Who? Whose?",
    description: "Personal, possessive and other pronoun forms.",
    href: "/train/$pos",
    pos: "pronouns",
  },
};

export function isPartOfSpeech(value: string): value is PartOfSpeech {
  return (
    value === "nouns" ||
    value === "adjectives" ||
    value === "verbs" ||
    value === "numerals" ||
    value === "pronouns"
  );
}

export const CASE_CHOICES: Choice[] = [
  {
    id: "nom",
    title: "Nominative",
    description: "the subject — the dictionary form",
    ariaLabel: "Nominative. The subject, the dictionary form.",
  },
  {
    id: "gen",
    title: "Genitive",
    description: "of someone or something; after “no / нет”",
    ariaLabel: "Genitive. Of someone or something, after нет.",
  },
  {
    id: "dat",
    title: "Dative",
    description: "to or for someone — the receiver",
    ariaLabel: "Dative. To or for someone, the receiver.",
  },
  {
    id: "acc",
    title: "Accusative",
    description: "the object of the action",
    ariaLabel: "Accusative. The object of the action.",
  },
  {
    id: "ins",
    title: "Instrumental",
    description: "with or by means of someone or something",
    ariaLabel: "Instrumental. With or by means of someone or something.",
  },
  {
    id: "prep",
    title: "Prepositional",
    description: "in, on, or about — always with a preposition",
    ariaLabel: "Prepositional. In, on, or about, always with a preposition.",
  },
];

export const NUMBER_CHOICES: Choice[] = [
  {
    id: "sg",
    title: "Singular",
    description: "one person, place, or thing",
    ariaLabel: "Singular. One person, place, or thing.",
  },
  {
    id: "pl",
    title: "Plural",
    description: "more than one",
    ariaLabel: "Plural. More than one.",
  },
];

export const GENDER_CHOICES: Choice[] = [
  {
    id: "m",
    title: "Masculine",
    ariaLabel: "Masculine.",
  },
  {
    id: "f",
    title: "Feminine",
    ariaLabel: "Feminine.",
  },
  {
    id: "n",
    title: "Neuter",
    ariaLabel: "Neuter.",
  },
];

export const ANIMACY_CHOICES: Choice[] = [
  {
    id: "animate",
    title: "Animate",
    description: "people and animals",
    ariaLabel: "Animate. People and animals.",
  },
  {
    id: "inanimate",
    title: "Inanimate",
    description: "objects, places, and things",
    ariaLabel: "Inanimate. Objects, places, and things.",
  },
];

export const CASE_LABEL: Record<CaseId, string> = {
  nom: "nominative",
  gen: "genitive",
  dat: "dative",
  acc: "accusative",
  ins: "instrumental",
  prep: "prepositional",
};

export const NUMBER_LABEL: Record<NumberId, string> = {
  sg: "singular",
  pl: "plural",
};

export const GENDER_LABEL: Record<GenderId, string> = {
  m: "masculine",
  f: "feminine",
  n: "neuter",
};

export const ANIMACY_LABEL: Record<AnimacyId, string> = {
  animate: "animate",
  inanimate: "inanimate",
};

export const CASE_QUESTION: Record<CaseId, string> = {
  nom: "Who? What? (subject)",
  gen: "Whose? Of what?",
  dat: "To whom? To what?",
  acc: "Whom? What? (object)",
  ins: "With whom? With what?",
  prep: "About whom? About what? In/on what?",
};
