import { CASE_LABEL, GENDER_LABEL, NUMBER_LABEL } from "./labels";
import type {
  AnimacyId,
  CaseId,
  Choice,
  GenderId,
  NumberId,
  PronounTypeId,
  TrainerExample,
  TrainerResult,
} from "./types";
import { splitForm } from "./types";

export const PRONOUN_TYPE_CHOICES: Choice[] = [
  {
    id: "personal",
    title: "Personal",
    description: "я, ты, он, мы…",
    ruExamples: ["я", "ты", "он"],
    ariaLabel: "Personal pronouns.",
  },
  {
    id: "possessive",
    title: "Possessive",
    description: "мой, твой, наш…",
    ruExamples: ["мой", "твой", "наш"],
    ariaLabel: "Possessive pronouns.",
  },
  {
    id: "demonstrative",
    title: "Demonstrative",
    description: "этот, тот",
    ruExamples: ["этот", "тот"],
    ariaLabel: "Demonstrative pronouns.",
  },
  {
    id: "reflexive",
    title: "Reflexive",
    description: "себя, свой",
    ruExamples: ["себя", "свой"],
    ariaLabel: "Reflexive pronouns.",
  },
  {
    id: "interrogative",
    title: "Interrogative",
    description: "кто, что, какой",
    ruExamples: ["кто", "что", "какой"],
    ariaLabel: "Interrogative pronouns.",
  },
];

export const PRONOUN_CHOICES: Record<PronounTypeId, Choice[]> = {
  personal: [
    { id: "ja", title: "я", description: "I", ariaLabel: "я, I." },
    { id: "ty", title: "ты", description: "you, informal", ariaLabel: "ты, informal you." },
    { id: "on", title: "он", description: "he", ariaLabel: "он, he." },
    { id: "ona", title: "она", description: "she", ariaLabel: "она, she." },
    { id: "ono", title: "оно", description: "it", ariaLabel: "оно, it." },
    { id: "my", title: "мы", description: "we", ariaLabel: "мы, we." },
    { id: "vy", title: "вы", description: "you, plural or polite", ariaLabel: "вы, you plural or polite." },
    { id: "oni", title: "они", description: "they", ariaLabel: "они, they." },
  ],
  possessive: [
    { id: "moj", title: "мой", description: "my", ariaLabel: "мой, my." },
    { id: "tvoj", title: "твой", description: "your, informal", ariaLabel: "твой, your informal." },
    { id: "nash", title: "наш", description: "our", ariaLabel: "наш, our." },
    { id: "vash", title: "ваш", description: "your, plural or polite", ariaLabel: "ваш, your plural or polite." },
    { id: "svoj", title: "свой", description: "one’s own", ariaLabel: "свой, one’s own." },
    { id: "ego", title: "его", description: "his / its — does not change", ariaLabel: "его, his or its." },
    { id: "ee", title: "её", description: "her — does not change", ariaLabel: "её, her." },
    { id: "ih", title: "их", description: "their — does not change", ariaLabel: "их, their." },
  ],
  demonstrative: [
    { id: "etot", title: "этот", description: "this", ariaLabel: "этот, this." },
    { id: "tot", title: "тот", description: "that", ariaLabel: "тот, that." },
  ],
  reflexive: [
    { id: "sebja", title: "себя", description: "myself / yourself / … — no nominative", ariaLabel: "себя, reflexive." },
    { id: "svoj-ref", title: "свой", description: "one’s own", ariaLabel: "свой, one’s own." },
  ],
  interrogative: [
    { id: "kto", title: "кто", description: "who", ariaLabel: "кто, who." },
    { id: "chto", title: "что", description: "what", ariaLabel: "что, what." },
    { id: "kakoj", title: "какой", description: "which / what kind", ariaLabel: "какой, which." },
  ],
};

const PERSONAL: Record<string, Record<CaseId, string>> = {
  ja: { nom: "я", gen: "меня", dat: "мне", acc: "меня", ins: "мной", prep: "мне" },
  ty: { nom: "ты", gen: "тебя", dat: "тебе", acc: "тебя", ins: "тобой", prep: "тебе" },
  on: { nom: "он", gen: "его", dat: "ему", acc: "его", ins: "им", prep: "нём" },
  ona: { nom: "она", gen: "её", dat: "ей", acc: "её", ins: "ею", prep: "ней" },
  ono: { nom: "оно", gen: "его", dat: "ему", acc: "его", ins: "им", prep: "нём" },
  my: { nom: "мы", gen: "нас", dat: "нам", acc: "нас", ins: "нами", prep: "нас" },
  vy: { nom: "вы", gen: "вас", dat: "вам", acc: "вас", ins: "вами", prep: "вас" },
  oni: { nom: "они", gen: "их", dat: "им", acc: "их", ins: "ими", prep: "них" },
};

const SIMPLE: Record<string, Record<CaseId, string>> = {
  sebja: { nom: "—", gen: "себя", dat: "себе", acc: "себя", ins: "собой", prep: "себе" },
  kto: { nom: "кто", gen: "кого", dat: "кому", acc: "кого", ins: "кем", prep: "ком" },
  chto: { nom: "что", gen: "чего", dat: "чему", acc: "что", ins: "чем", prep: "чём" },
  ego: { nom: "его", gen: "его", dat: "его", acc: "его", ins: "его", prep: "его" },
  ee: { nom: "её", gen: "её", dat: "её", acc: "её", ins: "её", prep: "её" },
  ih: { nom: "их", gen: "их", dat: "их", acc: "их", ins: "их", prep: "их" },
};

type AdjParadigm = Record<string, string>;

function paradigm(
  nom_m: string,
  nom_f: string,
  nom_n: string,
  nom_pl: string,
  gen_m: string,
  gen_f: string,
  gen_pl: string,
  dat_m: string,
  dat_f: string,
  dat_pl: string,
  acc_f: string,
  ins_m: string,
  ins_f: string,
  ins_pl: string,
  prep_m: string,
  prep_f: string,
  prep_pl: string,
): AdjParadigm {
  return {
    nom_sg_m: nom_m,
    nom_sg_f: nom_f,
    nom_sg_n: nom_n,
    nom_pl: nom_pl,
    gen_sg_m: gen_m,
    gen_sg_f: gen_f,
    gen_sg_n: gen_m,
    gen_pl: gen_pl,
    dat_sg_m: dat_m,
    dat_sg_f: dat_f,
    dat_sg_n: dat_m,
    dat_pl: dat_pl,
    acc_sg_f: acc_f,
    acc_sg_n: nom_n,
    ins_sg_m: ins_m,
    ins_sg_f: ins_f,
    ins_sg_n: ins_m,
    ins_pl: ins_pl,
    prep_sg_m: prep_m,
    prep_sg_f: prep_f,
    prep_sg_n: prep_m,
    prep_pl: prep_pl,
  };
}

const ADJ_LIKE: Record<string, AdjParadigm> = {
  moj: paradigm(
    "мой", "моя", "моё", "мои",
    "моего", "моей", "моих",
    "моему", "моей", "моим",
    "мою",
    "моим", "моей", "моими",
    "моём", "моей", "моих",
  ),
  tvoj: paradigm(
    "твой", "твоя", "твоё", "твои",
    "твоего", "твоей", "твоих",
    "твоему", "твоей", "твоим",
    "твою",
    "твоим", "твоей", "твоими",
    "твоём", "твоей", "твоих",
  ),
  nash: paradigm(
    "наш", "наша", "наше", "наши",
    "нашего", "нашей", "наших",
    "нашему", "нашей", "нашим",
    "нашу",
    "нашим", "нашей", "нашими",
    "нашем", "нашей", "наших",
  ),
  vash: paradigm(
    "ваш", "ваша", "ваше", "ваши",
    "вашего", "вашей", "ваших",
    "вашему", "вашей", "вашим",
    "вашу",
    "вашим", "вашей", "вашими",
    "вашем", "вашей", "ваших",
  ),
  svoj: paradigm(
    "свой", "своя", "своё", "свои",
    "своего", "своей", "своих",
    "своему", "своей", "своим",
    "свою",
    "своим", "своей", "своими",
    "своём", "своей", "своих",
  ),
  etot: paradigm(
    "этот", "эта", "это", "эти",
    "этого", "этой", "этих",
    "этому", "этой", "этим",
    "эту",
    "этим", "этой", "этими",
    "этом", "этой", "этих",
  ),
  tot: paradigm(
    "тот", "та", "то", "те",
    "того", "той", "тех",
    "тому", "той", "тем",
    "ту",
    "тем", "той", "теми",
    "том", "той", "тех",
  ),
  kakoj: paradigm(
    "какой", "какая", "какое", "какие",
    "какого", "какой", "каких",
    "какому", "какой", "каким",
    "какую",
    "каким", "какой", "какими",
    "каком", "какой", "каких",
  ),
};

const ADJ_ALIASES: Record<string, string> = {
  "svoj-ref": "svoj",
};

export function pronounTitle(id: string): string {
  for (const list of Object.values(PRONOUN_CHOICES)) {
    const hit = list.find((c) => c.id === id);
    if (hit) return hit.title;
  }
  return id;
}

export function pronounDeclinesLikeAdj(id: string): boolean {
  const key = ADJ_ALIASES[id] ?? id;
  return Boolean(ADJ_LIKE[key]);
}

export function pronounIsFixed(id: string): boolean {
  return id === "ego" || id === "ee" || id === "ih";
}

export function pronounNeedsCase(id: string): boolean {
  return true;
}

export function pronounHasNominative(id: string): boolean {
  return id !== "sebja";
}

function adjForm(
  id: string,
  caseId: CaseId,
  number: NumberId,
  gender: GenderId,
  animacy: AnimacyId,
): string {
  const key = ADJ_ALIASES[id] ?? id;
  const p = ADJ_LIKE[key];
  if (!p) return id;
  if (number === "pl") {
    if (caseId === "acc") return animacy === "animate" ? p.gen_pl : p.nom_pl;
    if (caseId === "nom") return p.nom_pl;
    if (caseId === "gen") return p.gen_pl;
    if (caseId === "dat") return p.dat_pl;
    if (caseId === "ins") return p.ins_pl;
    return p.prep_pl;
  }
  if (caseId === "acc") {
    if (gender === "f") return p.acc_sg_f;
    if (gender === "n") return p.acc_sg_n;
    return animacy === "animate" ? p.gen_sg_m : p.nom_sg_m;
  }
  if (caseId === "nom") return gender === "f" ? p.nom_sg_f : gender === "n" ? p.nom_sg_n : p.nom_sg_m;
  if (caseId === "gen") return gender === "f" ? p.gen_sg_f : p.gen_sg_m;
  if (caseId === "dat") return gender === "f" ? p.dat_sg_f : p.dat_sg_m;
  if (caseId === "ins") return gender === "f" ? p.ins_sg_f : p.ins_sg_m;
  return gender === "f" ? p.prep_sg_f : p.prep_sg_m;
}

function simpleForm(id: string, caseId: CaseId): string | undefined {
  if (PERSONAL[id]) return PERSONAL[id][caseId];
  if (SIMPLE[id]) return SIMPLE[id][caseId];
  return undefined;
}

export function inflectPronoun(input: {
  pronounId: string;
  caseId: CaseId;
  number?: NumberId;
  gender?: GenderId;
  animacy?: AnimacyId;
}): { full: string; unchanged: boolean; lemma: string } {
  const lemma = pronounTitle(input.pronounId);
  const { pronounId, caseId } = input;
  const number = input.number ?? "sg";
  const gender = input.gender ?? "m";
  const animacy = input.animacy ?? "inanimate";
  let full: string;
  if (pronounDeclinesLikeAdj(pronounId)) {
    full = adjForm(pronounId, caseId, number, gender, animacy);
  } else {
    full = simpleForm(pronounId, caseId) ?? lemma;
  }
  if (full === "—") full = lemma;
  return { full, unchanged: full === lemma, lemma };
}

export function lookupPronounLemma(word: string): string | undefined {
  const n = word.trim().toLowerCase();
  for (const [id, table] of Object.entries(PERSONAL)) {
    if (Object.values(table).some((f) => f.toLowerCase() === n) || pronounTitle(id).toLowerCase() === n) {
      return id;
    }
  }
  for (const [id, table] of Object.entries(SIMPLE)) {
    if (Object.values(table).some((f) => f.toLowerCase() === n) || pronounTitle(id).toLowerCase() === n) {
      return id;
    }
  }
  for (const id of Object.keys(ADJ_LIKE)) {
    const p = ADJ_LIKE[id];
    if (Object.values(p).some((f) => f.toLowerCase() === n)) return id;
    if (pronounTitle(id).toLowerCase() === n) return id;
  }
  if (n === "своя" || n === "своё" || n === "свои") return "svoj";
  return undefined;
}

export function getPronounResult(input: {
  type: PronounTypeId;
  pronounId: string;
  caseId: CaseId;
  number?: NumberId;
  gender?: GenderId;
  animacy?: AnimacyId;
}): TrainerResult {
  const { type, pronounId, caseId } = input;
  const number = input.number ?? "sg";
  const gender = input.gender ?? "m";
  const animacy = input.animacy ?? "inanimate";
  const lemma = pronounTitle(pronounId);
  const { full, unchanged } = inflectPronoun({ pronounId, caseId, number, gender, animacy });
  const ending = unchanged || full === lemma ? "" : full;
  const examples: TrainerExample[] = [
    {
      from: splitForm(lemma === "себя" ? "себя" : lemma, ""),
      form: splitForm(full, ""),
      en: unchanged ? "The form does not change." : `${CASE_LABEL[caseId]} form`,
    },
  ];

  if (pronounDeclinesLikeAdj(pronounId)) {
    const extra = ["m", "f", "n"].map((g) => {
      const f = adjForm(pronounId, caseId, number, g as GenderId, animacy);
      return {
        from: splitForm(lemma, ""),
        form: splitForm(f, ""),
        en: GENDER_LABEL[g as GenderId],
      };
    });
    if (number === "sg") examples.push(...extra.filter((e) => e.form.full !== full).slice(0, 3));
  }

  const notes: string[] = [];
  if (pronounId === "on" || pronounId === "ona" || pronounId === "ono" || pronounId === "oni") {
    notes.push("After a preposition, 3rd-person forms take н-: у него, к нему, с ним, о нём, у неё, о них.");
  }
  if (pronounIsFixed(pronounId)) {
    notes.push("Possessive его, её and их stay the same in every case.");
  }
  if (pronounId === "sebja") {
    notes.push("себя has no nominative. It refers back to the subject: Я вижу себя.");
  }

  let rule: string;
  if (pronounIsFixed(pronounId)) {
    rule = `${lemma} does not change. The form stays ${full}.`;
  } else if (unchanged) {
    rule = `In the ${CASE_LABEL[caseId]}, ${lemma} stays ${full}. The form does not change.`;
  } else {
    rule = `In the ${CASE_LABEL[caseId]}${
      pronounDeclinesLikeAdj(pronounId)
        ? `, ${number === "pl" ? "plural" : GENDER_LABEL[gender] + " singular"}`
        : ""
    }, ${lemma} → ${full}.`;
  }

  return {
    heading: `${lemma} · ${CASE_LABEL[caseId]}`,
    endingLabel: unchanged ? "the form stays" : full,
    endingSpoken: unchanged ? `${full}. The form does not change.` : full,
    endingDisplay: full,
    rule,
    notes,
    examples: examples.slice(0, 6),
  };
}

export function typeLabel(type: PronounTypeId): string {
  return PRONOUN_TYPE_CHOICES.find((c) => c.id === type)?.title ?? type;
}

export { NUMBER_LABEL, GENDER_LABEL };
