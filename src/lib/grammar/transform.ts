import type { TransformContext, TransformResult } from "./types";
import {
  detectNounPattern,
  inflectedNounForm,
} from "./nouns";
import { inflectedVerbForm } from "./verbs";
import { inflectPronoun, lookupPronounLemma, pronounTitle } from "./pronouns";
import { numeralToWords, parseNumeralInput } from "./number-words";

const CYRILLIC = /[а-яё]/i;
const HUSHER = /[гкхжчшщ]$/;

function clean(word: string): string {
  return word.trim().toLowerCase().replace(/ё/g, "ё");
}

function apply(stem: string, ending: string): string {
  if (!ending) return stem;
  let e = ending;
  if (HUSHER.test(stem)) {
    if (e.startsWith("ы")) e = "и" + e.slice(1);
    if (e.startsWith("я")) e = "а" + e.slice(1);
    if (e.startsWith("ю")) e = "у" + e.slice(1);
  }
  return stem + e;
}

function nounStemAndKind(lemma: string, genderHint?: TransformContext["gender"]) {
  const pattern = detectNounPattern(lemma, genderHint);
  if (pattern === "f-iya") return { stem: lemma.slice(0, -1), pattern };
  if (pattern === "n-ie") return { stem: lemma.slice(0, -1), pattern };
  if (pattern === "f-a" || pattern === "n-o") return { stem: lemma.slice(0, -1), pattern };
  if (pattern === "f-ya") return { stem: lemma.slice(0, -1), pattern };
  if (pattern === "n-e") return { stem: lemma.slice(0, -1), pattern };
  if (pattern === "m-y") return { stem: lemma.slice(0, -1), pattern };
  if (pattern === "m-soft" || pattern === "f-soft") return { stem: lemma.slice(0, -1), pattern };
  return { stem: lemma, pattern };
}

function regularNoun(lemma: string, ctx: TransformContext): string {
  const number = ctx.number ?? "sg";
  const animacy = ctx.animacy ?? "inanimate";
  const { stem, pattern } = nounStemAndKind(lemma, ctx.gender);
  const caseId = ctx.caseId ?? "nom";
  const animateAcc =
    caseId === "acc" && animacy === "animate" && (number === "pl" || pattern.startsWith("m"));

  const table: Record<string, Record<string, string>> = {
    "m-cons": {
      nom_sg: "",
      gen_sg: "а",
      dat_sg: "у",
      acc_sg: "",
      ins_sg: "ом",
      prep_sg: "е",
      nom_pl: "ы",
      gen_pl: "ов",
      dat_pl: "ам",
      acc_pl: "ы",
      ins_pl: "ами",
      prep_pl: "ах",
    },
    "m-y": {
      nom_sg: "й",
      gen_sg: "я",
      dat_sg: "ю",
      acc_sg: "й",
      ins_sg: "ем",
      prep_sg: "е",
      nom_pl: "и",
      gen_pl: "ев",
      dat_pl: "ям",
      acc_pl: "и",
      ins_pl: "ями",
      prep_pl: "ях",
    },
    "m-soft": {
      nom_sg: "ь",
      gen_sg: "я",
      dat_sg: "ю",
      acc_sg: "ь",
      ins_sg: "ем",
      prep_sg: "е",
      nom_pl: "и",
      gen_pl: "ей",
      dat_pl: "ям",
      acc_pl: "и",
      ins_pl: "ями",
      prep_pl: "ях",
    },
    "f-a": {
      nom_sg: "а",
      gen_sg: "ы",
      dat_sg: "е",
      acc_sg: "у",
      ins_sg: "ой",
      prep_sg: "е",
      nom_pl: "ы",
      gen_pl: "",
      dat_pl: "ам",
      acc_pl: "ы",
      ins_pl: "ами",
      prep_pl: "ах",
    },
    "f-ya": {
      nom_sg: "я",
      gen_sg: "и",
      dat_sg: "е",
      acc_sg: "ю",
      ins_sg: "ей",
      prep_sg: "е",
      nom_pl: "и",
      gen_pl: "ь",
      dat_pl: "ям",
      acc_pl: "и",
      ins_pl: "ями",
      prep_pl: "ях",
    },
    "f-iya": {
      nom_sg: "я",
      gen_sg: "и",
      dat_sg: "и",
      acc_sg: "ю",
      ins_sg: "ей",
      prep_sg: "и",
      nom_pl: "и",
      gen_pl: "й",
      dat_pl: "ям",
      acc_pl: "и",
      ins_pl: "ями",
      prep_pl: "ях",
    },
    "f-soft": {
      nom_sg: "ь",
      gen_sg: "и",
      dat_sg: "и",
      acc_sg: "ь",
      ins_sg: "ью",
      prep_sg: "и",
      nom_pl: "и",
      gen_pl: "ей",
      dat_pl: "ям",
      acc_pl: "и",
      ins_pl: "ями",
      prep_pl: "ях",
    },
    "n-o": {
      nom_sg: "о",
      gen_sg: "а",
      dat_sg: "у",
      acc_sg: "о",
      ins_sg: "ом",
      prep_sg: "е",
      nom_pl: "а",
      gen_pl: "",
      dat_pl: "ам",
      acc_pl: "а",
      ins_pl: "ами",
      prep_pl: "ах",
    },
    "n-e": {
      nom_sg: "е",
      gen_sg: "я",
      dat_sg: "ю",
      acc_sg: "е",
      ins_sg: "ем",
      prep_sg: "е",
      nom_pl: "я",
      gen_pl: "ей",
      dat_pl: "ям",
      acc_pl: "я",
      ins_pl: "ями",
      prep_pl: "ях",
    },
    "n-ie": {
      nom_sg: "е",
      gen_sg: "я",
      dat_sg: "ю",
      acc_sg: "е",
      ins_sg: "ем",
      prep_sg: "и",
      nom_pl: "я",
      gen_pl: "й",
      dat_pl: "ям",
      acc_pl: "я",
      ins_pl: "ями",
      prep_pl: "ях",
    },
  };

  const row = table[pattern];
  let slot: string = `${caseId}_${number}`;
  if (caseId === "acc" && animateAcc) slot = `gen_${number}`;
  const ending = row[slot] ?? row[`nom_${number}`] ?? "";
  return apply(stem, ending);
}

function adjStem(lemma: string): { stem: string; soft: boolean; stressedOj: boolean } {
  if (lemma.endsWith("ой")) return { stem: lemma.slice(0, -2), soft: false, stressedOj: true };
  if (lemma.endsWith("ый")) return { stem: lemma.slice(0, -2), soft: false, stressedOj: false };
  if (lemma.endsWith("ий")) return { stem: lemma.slice(0, -2), soft: true, stressedOj: false };
  if (lemma.endsWith("ая") || lemma.endsWith("ое") || lemma.endsWith("ые")) {
    return { stem: lemma.slice(0, -2), soft: false, stressedOj: false };
  }
  if (lemma.endsWith("яя") || lemma.endsWith("ее") || lemma.endsWith("ие")) {
    return { stem: lemma.slice(0, -2), soft: true, stressedOj: false };
  }
  return { stem: lemma, soft: false, stressedOj: false };
}

function regularAdj(lemma: string, ctx: TransformContext): string {
  const { stem, soft, stressedOj } = adjStem(lemma);
  const number = ctx.number ?? "sg";
  const gender = ctx.gender ?? "m";
  const caseId = ctx.caseId ?? "nom";
  const animacy = ctx.animacy ?? "inanimate";
  const hard = {
    nom_sg_m: stressedOj ? "ой" : "ый",
    nom_sg_f: "ая",
    nom_sg_n: "ое",
    nom_pl: "ые",
    gen_sg_m: "ого",
    gen_sg_f: "ой",
    gen_pl: "ых",
    dat_sg_m: "ому",
    dat_sg_f: "ой",
    dat_pl: "ым",
    acc_sg_f: "ую",
    ins_sg_m: "ым",
    ins_sg_f: "ой",
    ins_pl: "ыми",
    prep_sg_m: "ом",
    prep_sg_f: "ой",
    prep_pl: "ых",
  };
  const sft = {
    nom_sg_m: "ий",
    nom_sg_f: "яя",
    nom_sg_n: "ее",
    nom_pl: "ие",
    gen_sg_m: "его",
    gen_sg_f: "ей",
    gen_pl: "их",
    dat_sg_m: "ему",
    dat_sg_f: "ей",
    dat_pl: "им",
    acc_sg_f: "юю",
    ins_sg_m: "им",
    ins_sg_f: "ей",
    ins_pl: "ими",
    prep_sg_m: "ем",
    prep_sg_f: "ей",
    prep_pl: "их",
  };
  const t = soft ? sft : hard;
  if (number === "pl") {
    if (caseId === "acc") return apply(stem, animacy === "animate" ? t.gen_pl : t.nom_pl);
    if (caseId === "nom") return apply(stem, t.nom_pl);
    if (caseId === "gen") return apply(stem, t.gen_pl);
    if (caseId === "dat") return apply(stem, t.dat_pl);
    if (caseId === "ins") return apply(stem, t.ins_pl);
    return apply(stem, t.prep_pl);
  }
  if (caseId === "acc") {
    if (gender === "f") return apply(stem, t.acc_sg_f);
    if (gender === "n") return apply(stem, t.nom_sg_n);
    return apply(stem, animacy === "animate" ? t.gen_sg_m : t.nom_sg_m);
  }
  if (caseId === "nom") {
    return apply(stem, gender === "f" ? t.nom_sg_f : gender === "n" ? t.nom_sg_n : t.nom_sg_m);
  }
  if (caseId === "gen") return apply(stem, gender === "f" ? t.gen_sg_f : t.gen_sg_m);
  if (caseId === "dat") return apply(stem, gender === "f" ? t.dat_sg_f : t.dat_sg_m);
  if (caseId === "ins") return apply(stem, gender === "f" ? t.ins_sg_f : t.ins_sg_m);
  return apply(stem, gender === "f" ? t.prep_sg_f : t.prep_sg_m);
}

function regularVerb(inf: string, ctx: TransformContext): string | undefined {
  if (!inf.endsWith("ть")) return undefined;
  const stem = inf.slice(0, -2);
  const tense = ctx.tense ?? "present";
  const number = ctx.number ?? "sg";
  const person = ctx.person ?? "1";
  const gender = ctx.gender ?? "m";
  const aspect = ctx.aspect ?? (inf.startsWith("по") || inf.startsWith("про") ? "perfective" : "imperfective");
  const second = ctx.conjugation === "second" || inf.endsWith("ить");

  if (tense === "past") {
    if (number === "pl") return stem + "ли";
    if (gender === "f") return stem + "ла";
    if (gender === "n") return stem + "ло";
    return stem + "л";
  }
  if (tense === "future" && aspect === "imperfective") {
    const be: Record<string, string> = {
      "1_sg": "буду",
      "2_sg": "будешь",
      "3_sg": "будет",
      "1_pl": "будем",
      "2_pl": "будете",
      "3_pl": "будут",
    };
    return `${be[`${person}_${number}`] ?? "буду"} ${inf}`;
  }
  const first: Record<string, string> = {
    "1_sg": "ю",
    "2_sg": "ешь",
    "3_sg": "ет",
    "1_pl": "ем",
    "2_pl": "ете",
    "3_pl": "ют",
  };
  const scd: Record<string, string> = {
    "1_sg": "ю",
    "2_sg": "ишь",
    "3_sg": "ит",
    "1_pl": "им",
    "2_pl": "ите",
    "3_pl": "ят",
  };
  const table = second ? scd : first;
  return stem + (table[`${person}_${number}`] ?? "ю");
}

const NUMERALS: Record<string, Record<string, string>> = {
  один: { nom: "один", gen: "одного", dat: "одному", acc: "один", ins: "одним", prep: "одном" },
  одна: { nom: "одна", gen: "одной", dat: "одной", acc: "одну", ins: "одной", prep: "одной" },
  одно: { nom: "одно", gen: "одного", dat: "одному", acc: "одно", ins: "одним", prep: "одном" },
  два: { nom: "два", gen: "двух", dat: "двум", acc: "два", ins: "двумя", prep: "двух" },
  две: { nom: "две", gen: "двух", dat: "двум", acc: "две", ins: "двумя", prep: "двух" },
  три: { nom: "три", gen: "трёх", dat: "трём", acc: "три", ins: "тремя", prep: "трёх" },
  четыре: { nom: "четыре", gen: "четырёх", dat: "четырём", acc: "четыре", ins: "четырьмя", prep: "четырёх" },
  пять: { nom: "пять", gen: "пяти", dat: "пяти", acc: "пять", ins: "пятью", prep: "пяти" },
  шесть: { nom: "шесть", gen: "шести", dat: "шести", acc: "шесть", ins: "шестью", prep: "шести" },
  семь: { nom: "семь", gen: "семи", dat: "семи", acc: "семь", ins: "семью", prep: "семи" },
  восемь: { nom: "восемь", gen: "восьми", dat: "восьми", acc: "восемь", ins: "восемью", prep: "восьми" },
  девять: { nom: "девять", gen: "девяти", dat: "девяти", acc: "девять", ins: "девятью", prep: "девяти" },
  десять: { nom: "десять", gen: "десяти", dat: "десяти", acc: "десять", ins: "десятью", prep: "десяти" },
  сто: { nom: "сто", gen: "ста", dat: "ста", acc: "сто", ins: "ста", prep: "ста" },
  тысяча: { nom: "тысяча", gen: "тысячи", dat: "тысяче", acc: "тысячу", ins: "тысячей", prep: "тысяче" },
};

export function transformWord(raw: string, ctx: TransformContext): TransformResult {
  const input = clean(raw);
  if (!input) {
    return {
      input: "",
      output: "",
      unchanged: true,
      error: ctx.pos === "numerals" ? "Type a number, for example 5." : "Type a Russian word first.",
    };
  }
  if (ctx.pos !== "numerals" && !CYRILLIC.test(input)) {
    return { input, output: "", unchanged: true, error: "Type the word in Russian." };
  }

  if (ctx.pos === "nouns") {
    const caseId = ctx.caseId ?? "nom";
    const number = ctx.number ?? "sg";
    const animacy = ctx.animacy ?? "inanimate";
    const known = inflectedNounForm(input, caseId, number, animacy, ctx.gender);
    const output = known?.full ?? regularNoun(input, ctx);
    return {
      input,
      output,
      unchanged: output === input,
      note: known ? undefined : "Regular pattern — some nouns are irregular.",
    };
  }

  if (ctx.pos === "adjectives") {
    const output = regularAdj(input, ctx);
    return { input, output, unchanged: output === input };
  }

  if (ctx.pos === "verbs") {
    const known = inflectedVerbForm({
      inf: input,
      tense: ctx.tense ?? "present",
      aspect: ctx.aspect,
      person: ctx.person,
      number: ctx.number ?? "sg",
      gender: ctx.gender,
    });
    const output = known?.full ?? regularVerb(input, ctx);
    if (!output) {
      return { input, output: "", unchanged: true, error: "Enter the infinitive, for example читать." };
    }
    return { input, output, unchanged: output === input };
  }

  if (ctx.pos === "numerals") {
    const n = parseNumeralInput(raw);
    if (n !== null) {
      const output = numeralToWords(n, {
        kind: ctx.numeralKind,
        caseId: ctx.caseId,
        number: ctx.number,
        gender: ctx.gender,
        animacy: ctx.animacy,
      });
      return { input: String(n), output, unchanged: false };
    }
    const caseId = ctx.caseId ?? "nom";
    const table = NUMERALS[input];
    if (!table) {
      return {
        input,
        output: "",
        unchanged: true,
        error: "Type digits (5, 21, 100) or a word like пять.",
      };
    }
    let output = table[caseId];
    if (caseId === "acc" && ctx.animacy === "animate" && (input === "один" || input === "два" || input === "три" || input === "четыре")) {
      output = table.gen;
    }
    if (input === "один" && ctx.gender === "f") output = NUMERALS.одна[caseId];
    if (input === "один" && ctx.gender === "n") output = NUMERALS.одно[caseId];
    if (input === "два" && ctx.gender === "f" && caseId === "nom") output = "две";
    if (input === "два" && ctx.gender === "f" && caseId === "acc" && ctx.animacy !== "animate") output = "две";
    return { input, output, unchanged: output === input };
  }

  if (ctx.pos === "pronouns") {
    const id = ctx.pronounId ?? lookupPronounLemma(input);
    if (!id) {
      return {
        input,
        output: "",
        unchanged: true,
        error: "Try я, ты, он, мой, этот, себя, кто.",
      };
    }
    const { full, unchanged } = inflectPronoun({
      pronounId: id,
      caseId: ctx.caseId ?? "nom",
      number: ctx.number,
      gender: ctx.gender,
      animacy: ctx.animacy,
    });
    return { input, output: full, unchanged, note: pronounTitle(id) !== input ? `From ${pronounTitle(id)}.` : undefined };
  }

  return { input, output: input, unchanged: true };
}

export const ENTER_WORD: Record<TransformContext["pos"], string> = {
  nouns: "noun",
  adjectives: "adjective",
  verbs: "verb",
  numerals: "numeral",
  pronouns: "pronoun",
};
