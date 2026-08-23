export type PartOfSpeech =
  | "nouns"
  | "adjectives"
  | "verbs"
  | "numerals"
  | "pronouns";

export type CaseId = "nom" | "gen" | "dat" | "acc" | "ins" | "prep";
export type NumberId = "sg" | "pl";
export type GenderId = "m" | "f" | "n";
export type AnimacyId = "animate" | "inanimate";
export type StemType = "hard" | "soft";
export type TenseId = "present" | "past" | "future";
export type AspectId = "imperfective" | "perfective";
export type PersonId = "1" | "2" | "3";
export type ConjugationId = "first" | "second";
export type NumeralKind = "cardinal" | "ordinal";
export type PronounTypeId =
  | "personal"
  | "possessive"
  | "demonstrative"
  | "reflexive"
  | "interrogative";

export type Choice = {
  id: string;
  title: string;
  description?: string;
  ruExamples?: string[];
  ariaLabel: string;
};

export type RuForm = {
  full: string;
  stem: string;
  ending: string;
};

export type TrainerExample = {
  form: RuForm;
  /** English gloss of the example */
  en: string;
  /** Optional dictionary / starting form shown before the arrow */
  from?: RuForm;
  /** Extra Russian context, already split for lang marking if needed */
  extraRu?: string;
};

export type TrainerResult = {
  heading: string;
  endingLabel: string;
  endingSpoken: string;
  endingDisplay: string;
  rule: string;
  notes: string[];
  examples: TrainerExample[];
  typicalUse?: string;
};

export type TransformContext = {
  pos: PartOfSpeech;
  caseId?: CaseId;
  number?: NumberId;
  gender?: GenderId;
  animacy?: AnimacyId;
  stem?: StemType;
  tense?: TenseId;
  aspect?: AspectId;
  person?: PersonId;
  conjugation?: ConjugationId;
  numeralKind?: NumeralKind;
  pronounType?: PronounTypeId;
  pronounId?: string;
};

export type TransformResult = {
  input: string;
  output: string;
  unchanged: boolean;
  note?: string;
  error?: string;
};

export function splitForm(full: string, ending: string): RuForm {
  if (!ending) return { full, stem: full, ending: "" };
  if (full.endsWith(ending)) {
    return { full, stem: full.slice(0, -ending.length), ending };
  }
  return { full, stem: full, ending: "" };
}
