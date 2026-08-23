import type { AnimacyId, CaseId, GenderId, NumeralKind, NumberId } from "./types";

type C = CaseId;

function pick(
  caseId: C,
  forms: { nom: string; gen: string; dat: string; acc: string; ins: string; prep: string },
  animateAcc = false,
): string {
  if (caseId === "acc" && animateAcc) return forms.gen;
  return forms[caseId];
}

const ONE_M = {
  nom: "один",
  gen: "одного",
  dat: "одному",
  acc: "один",
  ins: "одним",
  prep: "одном",
};
const ONE_F = {
  nom: "одна",
  gen: "одной",
  dat: "одной",
  acc: "одну",
  ins: "одной",
  prep: "одной",
};
const ONE_N = {
  nom: "одно",
  gen: "одного",
  dat: "одному",
  acc: "одно",
  ins: "одним",
  prep: "одном",
};
const TWO_M = {
  nom: "два",
  gen: "двух",
  dat: "двум",
  acc: "два",
  ins: "двумя",
  prep: "двух",
};
const TWO_F = {
  nom: "две",
  gen: "двух",
  dat: "двум",
  acc: "две",
  ins: "двумя",
  prep: "двух",
};
const THREE = {
  nom: "три",
  gen: "трёх",
  dat: "трём",
  acc: "три",
  ins: "тремя",
  prep: "трёх",
};
const FOUR = {
  nom: "четыре",
  gen: "четырёх",
  dat: "четырём",
  acc: "четыре",
  ins: "четырьмя",
  prep: "четырёх",
};

const FIVE_TO_TWENTY: Record<number, { nom: string; gen: string; dat: string; acc: string; ins: string; prep: string }> = {
  5: { nom: "пять", gen: "пяти", dat: "пяти", acc: "пять", ins: "пятью", prep: "пяти" },
  6: { nom: "шесть", gen: "шести", dat: "шести", acc: "шесть", ins: "шестью", prep: "шести" },
  7: { nom: "семь", gen: "семи", dat: "семи", acc: "семь", ins: "семью", prep: "семи" },
  8: { nom: "восемь", gen: "восьми", dat: "восьми", acc: "восемь", ins: "восемью", prep: "восьми" },
  9: { nom: "девять", gen: "девяти", dat: "девяти", acc: "девять", ins: "девятью", prep: "девяти" },
  10: { nom: "десять", gen: "десяти", dat: "десяти", acc: "десять", ins: "десятью", prep: "десяти" },
  11: { nom: "одиннадцать", gen: "одиннадцати", dat: "одиннадцати", acc: "одиннадцать", ins: "одиннадцатью", prep: "одиннадцати" },
  12: { nom: "двенадцать", gen: "двенадцати", dat: "двенадцати", acc: "двенадцать", ins: "двенадцатью", prep: "двенадцати" },
  13: { nom: "тринадцать", gen: "тринадцати", dat: "тринадцати", acc: "тринадцать", ins: "тринадцатью", prep: "тринадцати" },
  14: { nom: "четырнадцать", gen: "четырнадцати", dat: "четырнадцати", acc: "четырнадцать", ins: "четырнадцатью", prep: "четырнадцати" },
  15: { nom: "пятнадцать", gen: "пятнадцати", dat: "пятнадцати", acc: "пятнадцать", ins: "пятнадцатью", prep: "пятнадцати" },
  16: { nom: "шестнадцать", gen: "шестнадцати", dat: "шестнадцати", acc: "шестнадцать", ins: "шестнадцатью", prep: "шестнадцати" },
  17: { nom: "семнадцать", gen: "семнадцати", dat: "семнадцати", acc: "семнадцать", ins: "семнадцатью", prep: "семнадцати" },
  18: { nom: "восемнадцать", gen: "восемнадцати", dat: "восемнадцати", acc: "восемнадцать", ins: "восемнадцатью", prep: "восемнадцати" },
  19: { nom: "девятнадцать", gen: "девятнадцати", dat: "девятнадцати", acc: "девятнадцать", ins: "девятнадцатью", prep: "девятнадцати" },
  20: { nom: "двадцать", gen: "двадцати", dat: "двадцати", acc: "двадцать", ins: "двадцатью", prep: "двадцати" },
  30: { nom: "тридцать", gen: "тридцати", dat: "тридцати", acc: "тридцать", ins: "тридцатью", prep: "тридцати" },
};

const FORTY = { nom: "сорок", gen: "сорока", dat: "сорока", acc: "сорок", ins: "сорока", prep: "сорока" };
const NINETY = { nom: "девяносто", gen: "девяноста", dat: "девяноста", acc: "девяносто", ins: "девяноста", prep: "девяноста" };
const HUNDRED = { nom: "сто", gen: "ста", dat: "ста", acc: "сто", ins: "ста", prep: "ста" };
const ZERO = { nom: "ноль", gen: "ноля", dat: "нолю", acc: "ноль", ins: "нолём", prep: "ноле" };

const TENS_COMPOUND: Record<number, { nom: string; gen: string; dat: string; acc: string; ins: string; prep: string }> = {
  50: { nom: "пятьдесят", gen: "пятидесяти", dat: "пятидесяти", acc: "пятьдесят", ins: "пятьюдесятью", prep: "пятидесяти" },
  60: { nom: "шестьдесят", gen: "шестидесяти", dat: "шестидесяти", acc: "шестьдесят", ins: "шестьюдесятью", prep: "шестидесяти" },
  70: { nom: "семьдесят", gen: "семидесяти", dat: "семидесяти", acc: "семьдесят", ins: "семьюдесятью", prep: "семидесяти" },
  80: { nom: "восемьдесят", gen: "восьмидесяти", dat: "восьмидесяти", acc: "восемьдесят", ins: "восемьюдесятью", prep: "восьмидесяти" },
};

const HUNDREDS: Record<number, { nom: string; gen: string; dat: string; acc: string; ins: string; prep: string }> = {
  200: { nom: "двести", gen: "двухсот", dat: "двумстам", acc: "двести", ins: "двумястами", prep: "двухстах" },
  300: { nom: "триста", gen: "трёхсот", dat: "трёмстам", acc: "триста", ins: "тремястами", prep: "трёхстах" },
  400: { nom: "четыреста", gen: "четырёхсот", dat: "четырёмстам", acc: "четыреста", ins: "четырьмястами", prep: "четырёхстах" },
  500: { nom: "пятьсот", gen: "пятисот", dat: "пятистам", acc: "пятьсот", ins: "пятьюстами", prep: "пятистах" },
  600: { nom: "шестьсот", gen: "шестисот", dat: "шестистам", acc: "шестьсот", ins: "шестьюстами", prep: "шестистах" },
  700: { nom: "семьсот", gen: "семисот", dat: "семистам", acc: "семьсот", ins: "семьюстами", prep: "семистах" },
  800: { nom: "восемьсот", gen: "восьмисот", dat: "восьмистам", acc: "восемьсот", ins: "восемьюстами", prep: "восьмистах" },
  900: { nom: "девятьсот", gen: "девятисот", dat: "девятистам", acc: "девятьсот", ins: "девятьюстами", prep: "девятистах" },
};

function one(caseId: C, gender: GenderId, animate: boolean): string {
  const table = gender === "f" ? ONE_F : gender === "n" ? ONE_N : ONE_M;
  const animateAcc = animate && gender === "m";
  return pick(caseId, table, animateAcc);
}

function two(caseId: C, gender: GenderId, animate: boolean): string {
  const table = gender === "f" ? TWO_F : TWO_M;
  return pick(caseId, table, animate);
}

function belowThousand(
  n: number,
  caseId: C,
  gender: GenderId,
  animate: boolean,
): string {
  if (n <= 0) return "";
  const parts: string[] = [];
  const h = Math.floor(n / 100) * 100;
  const rest = n % 100;
  if (h === 100) parts.push(pick(caseId, HUNDRED));
  else if (h > 100) parts.push(pick(caseId, HUNDREDS[h]));

  if (rest === 0) return parts.join(" ");

  if (FIVE_TO_TWENTY[rest]) {
    parts.push(pick(caseId, FIVE_TO_TWENTY[rest]));
    return parts.join(" ");
  }
  if (rest === 40) {
    parts.push(pick(caseId, FORTY));
    return parts.join(" ");
  }
  if (rest === 90) {
    parts.push(pick(caseId, NINETY));
    return parts.join(" ");
  }

  const tens = Math.floor(rest / 10) * 10;
  const unit = rest % 10;
  if (tens === 20 || tens === 30) parts.push(pick(caseId, FIVE_TO_TWENTY[tens]));
  else if (tens === 40) parts.push(pick(caseId, FORTY));
  else if (tens === 90) parts.push(pick(caseId, NINETY));
  else if (tens >= 50) parts.push(pick(caseId, TENS_COMPOUND[tens]));

  if (unit === 1) parts.push(one(caseId, gender, animate));
  else if (unit === 2) parts.push(two(caseId, gender, animate));
  else if (unit === 3) parts.push(pick(caseId, THREE, animate));
  else if (unit === 4) parts.push(pick(caseId, FOUR, animate));
  else if (unit >= 5) parts.push(pick(caseId, FIVE_TO_TWENTY[unit]));

  return parts.join(" ");
}

const THOUSAND_SG = {
  nom: "тысяча",
  gen: "тысячи",
  dat: "тысяче",
  acc: "тысячу",
  ins: "тысячей",
  prep: "тысяче",
};
const THOUSAND_PL2 = {
  nom: "тысячи",
  gen: "тысяч",
  dat: "тысячам",
  acc: "тысячи",
  ins: "тысячами",
  prep: "тысячах",
};
const THOUSAND_PL5 = {
  nom: "тысяч",
  gen: "тысяч",
  dat: "тысячам",
  acc: "тысяч",
  ins: "тысячами",
  prep: "тысячах",
};
const MILLION_SG = {
  nom: "миллион",
  gen: "миллиона",
  dat: "миллиону",
  acc: "миллион",
  ins: "миллионом",
  prep: "миллионе",
};
const MILLION_PL2 = {
  nom: "миллиона",
  gen: "миллионов",
  dat: "миллионам",
  acc: "миллиона",
  ins: "миллионами",
  prep: "миллионах",
};
const MILLION_PL5 = {
  nom: "миллионов",
  gen: "миллионов",
  dat: "миллионам",
  acc: "миллионов",
  ins: "миллионами",
  prep: "миллионах",
};

function lastTwo(n: number): number {
  return n % 100;
}

function scaleWord(
  count: number,
  caseId: C,
  sg: typeof THOUSAND_SG,
  pl2: typeof THOUSAND_PL2,
  pl5: typeof THOUSAND_PL5,
  animateScale: boolean,
): string {
  const tail = lastTwo(count);
  const unit = count % 10;
  if (tail >= 11 && tail <= 14) return pick(caseId, pl5);
  if (unit === 1) return pick(caseId, sg, animateScale);
  if (unit >= 2 && unit <= 4) return pick(caseId, pl2);
  return pick(caseId, pl5);
}

export function cardinalInWords(
  n: number,
  caseId: C,
  gender: GenderId,
  animacy: AnimacyId,
): string {
  if (n === 0) return pick(caseId, ZERO);
  const animate = animacy === "animate";
  const parts: string[] = [];

  const millions = Math.floor(n / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;

  if (millions) {
    parts.push(belowThousand(millions, caseId, "m", animate && !thousands && !rest));
    parts.push(scaleWord(millions, caseId, MILLION_SG, MILLION_PL2, MILLION_PL5, animate && !thousands && !rest));
  }
  if (thousands) {
    parts.push(belowThousand(thousands, caseId, "f", false));
    parts.push(scaleWord(thousands, caseId, THOUSAND_SG, THOUSAND_PL2, THOUSAND_PL5, false));
  }
  if (rest) {
    parts.push(belowThousand(rest, caseId, gender, animate));
  }
  return parts.filter(Boolean).join(" ");
}

const ORD_HARD: Record<string, string> = {
  nom_sg_m: "ый",
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

function hardOrdinal(stem: string, stressedOj: boolean, caseId: C, number: NumberId, gender: GenderId, animate: boolean): string {
  const t: Record<string, string> = { ...ORD_HARD, nom_sg_m: stressedOj ? "ой" : "ый" };
  if (number === "pl") {
    if (caseId === "acc") return stem + (animate ? t.gen_pl : t.nom_pl);
    if (caseId === "nom") return stem + t.nom_pl;
    if (caseId === "gen") return stem + t.gen_pl;
    if (caseId === "dat") return stem + t.dat_pl;
    if (caseId === "ins") return stem + t.ins_pl;
    return stem + t.prep_pl;
  }
  if (caseId === "acc") {
    if (gender === "f") return stem + t.acc_sg_f;
    if (gender === "n") return stem + t.nom_sg_n;
    return stem + (animate ? t.gen_sg_m : t.nom_sg_m);
  }
  if (caseId === "nom") return stem + (gender === "f" ? t.nom_sg_f : gender === "n" ? t.nom_sg_n : t.nom_sg_m);
  if (caseId === "gen") return stem + (gender === "f" ? t.gen_sg_f : t.gen_sg_m);
  if (caseId === "dat") return stem + (gender === "f" ? t.dat_sg_f : t.dat_sg_m);
  if (caseId === "ins") return stem + (gender === "f" ? t.ins_sg_f : t.ins_sg_m);
  return stem + (gender === "f" ? t.prep_sg_f : t.prep_sg_m);
}

function third(caseId: C, number: NumberId, gender: GenderId, animate: boolean): string {
  const forms: Record<string, string> = {
    nom_sg_m: "третий",
    nom_sg_f: "третья",
    nom_sg_n: "третье",
    nom_pl: "третьи",
    gen_sg_m: "третьего",
    gen_sg_f: "третьей",
    gen_pl: "третьих",
    dat_sg_m: "третьему",
    dat_sg_f: "третьей",
    dat_pl: "третьим",
    acc_sg_f: "третью",
    ins_sg_m: "третьим",
    ins_sg_f: "третьей",
    ins_pl: "третьими",
    prep_sg_m: "третьем",
    prep_sg_f: "третьей",
    prep_pl: "третьих",
  };
  if (number === "pl") {
    if (caseId === "acc") return animate ? forms.gen_pl : forms.nom_pl;
    return forms[`${caseId}_pl`] ?? forms.nom_pl;
  }
  if (caseId === "acc") {
    if (gender === "f") return forms.acc_sg_f;
    if (gender === "n") return forms.nom_sg_n;
    return animate ? forms.gen_sg_m : forms.nom_sg_m;
  }
  const key = gender === "f" ? `${caseId}_sg_f` : `${caseId}_sg_m`;
  return forms[key] ?? forms.nom_sg_m;
}

const ORD_STEM: Record<number, { stem: string; oj?: boolean }> = {
  1: { stem: "перв" },
  2: { stem: "втор" },
  4: { stem: "четвёрт" },
  5: { stem: "пят" },
  6: { stem: "шест", oj: true },
  7: { stem: "седьм", oj: true },
  8: { stem: "восьм", oj: true },
  9: { stem: "девят" },
  10: { stem: "десят" },
  11: { stem: "одиннадцат" },
  12: { stem: "двенадцат" },
  13: { stem: "тринадцат" },
  14: { stem: "четырнадцат" },
  15: { stem: "пятнадцат" },
  16: { stem: "шестнадцат" },
  17: { stem: "семнадцат" },
  18: { stem: "восемнадцат" },
  19: { stem: "девятнадцат" },
  20: { stem: "двадцат" },
  30: { stem: "тридцат" },
  40: { stem: "сороков", oj: true },
  50: { stem: "пятидесят" },
  60: { stem: "шестидесят" },
  70: { stem: "семидесят" },
  80: { stem: "восьмидесят" },
  90: { stem: "девяност" },
  100: { stem: "сот" },
  200: { stem: "двухсот" },
  300: { stem: "трёхсот" },
  400: { stem: "четырёхсот" },
  500: { stem: "пятисот" },
  600: { stem: "шестисот" },
  700: { stem: "семисот" },
  800: { stem: "восьмисот" },
  900: { stem: "девятисот" },
  1000: { stem: "тысячн" },
};

function inflectOrdinalStem(
  n: number,
  caseId: C,
  number: NumberId,
  gender: GenderId,
  animate: boolean,
): string {
  if (n === 3) return third(caseId, number, gender, animate);
  const row = ORD_STEM[n];
  if (!row) return String(n);
  return hardOrdinal(row.stem, Boolean(row.oj), caseId, number, gender, animate);
}

export function ordinalInWords(
  n: number,
  caseId: C,
  number: NumberId,
  gender: GenderId,
  animacy: AnimacyId,
): string {
  const animate = animacy === "animate";
  if (n <= 0) return inflectOrdinalStem(1, caseId, number, gender, animate);
  if (ORD_STEM[n] || n === 3) return inflectOrdinalStem(n, caseId, number, gender, animate);

  if (n > 1000) {
    const thousands = Math.floor(n / 1000);
    const rest = n % 1000;
    if (rest === 0) return inflectOrdinalStem(1000, caseId, number, gender, animate);
    const head = cardinalInWords(thousands * 1000, "nom", "m", "inanimate");
    return `${head} ${ordinalInWords(rest, caseId, number, gender, animacy)}`;
  }

  if (n > 100) {
    const h = Math.floor(n / 100) * 100;
    const rest = n % 100;
    if (rest === 0) return inflectOrdinalStem(h, caseId, number, gender, animate);
    const head = cardinalInWords(h, "nom", "m", "inanimate");
    return `${head} ${ordinalInWords(rest, caseId, number, gender, animacy)}`;
  }

  const tens = Math.floor(n / 10) * 10;
  const unit = n % 10;
  const head = cardinalInWords(tens, "nom", "m", "inanimate");
  return `${head} ${inflectOrdinalStem(unit, caseId, number, gender, animate)}`;
}

export function parseNumeralInput(raw: string): number | null {
  const trimmed = raw.trim().toLowerCase().replace(/\s+/g, "").replace(/,/g, "").replace(/_/g, "");
  if (!/^\d+$/.test(trimmed)) return null;
  if (trimmed.length > 9) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function numeralToWords(
  n: number,
  ctx: {
    kind?: NumeralKind;
    caseId?: CaseId;
    number?: NumberId;
    gender?: GenderId;
    animacy?: AnimacyId;
  },
): string {
  const caseId = ctx.caseId ?? "nom";
  const gender = ctx.gender ?? "m";
  const animacy = ctx.animacy ?? "inanimate";
  if (ctx.kind === "ordinal") {
    return ordinalInWords(n, caseId, ctx.number ?? "sg", gender, animacy);
  }
  return cardinalInWords(n, caseId, gender, animacy);
}
