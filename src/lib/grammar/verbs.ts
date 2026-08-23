import type {
  AspectId,
  ConjugationId,
  GenderId,
  NumberId,
  PersonId,
  TenseId,
  TrainerExample,
  TrainerResult,
} from "./types";
import { splitForm } from "./types";

type VerbWord = {
  inf: string;
  en: string;
  aspect: AspectId;
  conj: ConjugationId;
  present: Record<string, { full: string; ending: string }>;
  past: Record<string, { full: string; ending: string }>;
};

const PERSON_KEY: Record<string, string> = {
  "1_sg": "1sg",
  "2_sg": "2sg",
  "3_sg": "3sg",
  "1_pl": "1pl",
  "2_pl": "2pl",
  "3_pl": "3pl",
};

const PERSON_LABEL: Record<string, string> = {
  "1_sg": "1st person singular (я)",
  "2_sg": "2nd person singular (ты)",
  "3_sg": "3rd person singular (он / она / оно)",
  "1_pl": "1st person plural (мы)",
  "2_pl": "2nd person plural (вы)",
  "3_pl": "3rd person plural (они)",
};

const BE_FUTURE: Record<string, { full: string; ending: string }> = {
  "1_sg": { full: "буду", ending: "у" },
  "2_sg": { full: "будешь", ending: "ешь" },
  "3_sg": { full: "будет", ending: "ет" },
  "1_pl": { full: "будем", ending: "ем" },
  "2_pl": { full: "будете", ending: "ете" },
  "3_pl": { full: "будут", ending: "ут" },
};

const VERBS: VerbWord[] = [
  verb(
    "читать",
    "read",
    "imperfective",
    "first",
    { "1sg": ["читаю", "ю"], "2sg": ["читаешь", "ешь"], "3sg": ["читает", "ет"], "1pl": ["читаем", "ем"], "2pl": ["читаете", "ете"], "3pl": ["читают", "ют"] },
    { m: ["читал", "л"], f: ["читала", "ла"], n: ["читало", "ло"], pl: ["читали", "ли"] },
  ),
  verb(
    "работать",
    "work",
    "imperfective",
    "first",
    { "1sg": ["работаю", "ю"], "2sg": ["работаешь", "ешь"], "3sg": ["работает", "ет"], "1pl": ["работаем", "ем"], "2pl": ["работаете", "ете"], "3pl": ["работают", "ют"] },
    { m: ["работал", "л"], f: ["работала", "ла"], n: ["работало", "ло"], pl: ["работали", "ли"] },
  ),
  verb(
    "играть",
    "play",
    "imperfective",
    "first",
    { "1sg": ["играю", "ю"], "2sg": ["играешь", "ешь"], "3sg": ["играет", "ет"], "1pl": ["играем", "ем"], "2pl": ["играете", "ете"], "3pl": ["играют", "ют"] },
    { m: ["играл", "л"], f: ["играла", "ла"], n: ["играло", "ло"], pl: ["играли", "ли"] },
  ),
  verb(
    "знать",
    "know",
    "imperfective",
    "first",
    { "1sg": ["знаю", "ю"], "2sg": ["знаешь", "ешь"], "3sg": ["знает", "ет"], "1pl": ["знаем", "ем"], "2pl": ["знаете", "ете"], "3pl": ["знают", "ют"] },
    { m: ["знал", "л"], f: ["знала", "ла"], n: ["знало", "ло"], pl: ["знали", "ли"] },
  ),
  verb(
    "думать",
    "think",
    "imperfective",
    "first",
    { "1sg": ["думаю", "ю"], "2sg": ["думаешь", "ешь"], "3sg": ["думает", "ет"], "1pl": ["думаем", "ем"], "2pl": ["думаете", "ете"], "3pl": ["думают", "ют"] },
    { m: ["думал", "л"], f: ["думала", "ла"], n: ["думало", "ло"], pl: ["думали", "ли"] },
  ),
  verb(
    "прочитать",
    "read (to the end)",
    "perfective",
    "first",
    { "1sg": ["прочитаю", "ю"], "2sg": ["прочитаешь", "ешь"], "3sg": ["прочитает", "ет"], "1pl": ["прочитаем", "ем"], "2pl": ["прочитаете", "ете"], "3pl": ["прочитают", "ют"] },
    { m: ["прочитал", "л"], f: ["прочитала", "ла"], n: ["прочитало", "ло"], pl: ["прочитали", "ли"] },
  ),
  verb(
    "сыграть",
    "play (a game, to completion)",
    "perfective",
    "first",
    { "1sg": ["сыграю", "ю"], "2sg": ["сыграешь", "ешь"], "3sg": ["сыграет", "ет"], "1pl": ["сыграем", "ем"], "2pl": ["сыграете", "ете"], "3pl": ["сыграют", "ют"] },
    { m: ["сыграл", "л"], f: ["сыграла", "ла"], n: ["сыграло", "ло"], pl: ["сыграли", "ли"] },
  ),
  verb(
    "узнать",
    "find out",
    "perfective",
    "first",
    { "1sg": ["узнаю", "ю"], "2sg": ["узнаешь", "ешь"], "3sg": ["узнает", "ет"], "1pl": ["узнаем", "ем"], "2pl": ["узнаете", "ете"], "3pl": ["узнают", "ют"] },
    { m: ["узнал", "л"], f: ["узнала", "ла"], n: ["узнало", "ло"], pl: ["узнали", "ли"] },
  ),
  verb(
    "поработать",
    "do some work",
    "perfective",
    "first",
    { "1sg": ["поработаю", "ю"], "2sg": ["поработаешь", "ешь"], "3sg": ["поработает", "ет"], "1pl": ["поработаем", "ем"], "2pl": ["поработаете", "ете"], "3pl": ["поработают", "ют"] },
    { m: ["поработал", "л"], f: ["поработала", "ла"], n: ["поработало", "ло"], pl: ["поработали", "ли"] },
  ),
  verb(
    "придумать",
    "come up with",
    "perfective",
    "first",
    { "1sg": ["придумаю", "ю"], "2sg": ["придумаешь", "ешь"], "3sg": ["придумает", "ет"], "1pl": ["придумаем", "ем"], "2pl": ["придумаете", "ете"], "3pl": ["придумают", "ют"] },
    { m: ["придумал", "л"], f: ["придумала", "ла"], n: ["придумало", "ло"], pl: ["придумали", "ли"] },
  ),
  verb(
    "говорить",
    "speak / talk",
    "imperfective",
    "second",
    { "1sg": ["говорю", "ю"], "2sg": ["говоришь", "ишь"], "3sg": ["говорит", "ит"], "1pl": ["говорим", "им"], "2pl": ["говорите", "ите"], "3pl": ["говорят", "ят"] },
    { m: ["говорил", "л"], f: ["говорила", "ла"], n: ["говорило", "ло"], pl: ["говорили", "ли"] },
  ),
  verb(
    "звонить",
    "call / ring",
    "imperfective",
    "second",
    { "1sg": ["звоню", "ю"], "2sg": ["звонишь", "ишь"], "3sg": ["звонит", "ит"], "1pl": ["звоним", "им"], "2pl": ["звоните", "ите"], "3pl": ["звонят", "ят"] },
    { m: ["звонил", "л"], f: ["звонила", "ла"], n: ["звонило", "ло"], pl: ["звонили", "ли"] },
  ),
  verb(
    "смотреть",
    "watch / look",
    "imperfective",
    "second",
    { "1sg": ["смотрю", "ю"], "2sg": ["смотришь", "ишь"], "3sg": ["смотрит", "ит"], "1pl": ["смотрим", "им"], "2pl": ["смотрите", "ите"], "3pl": ["смотрят", "ят"] },
    { m: ["смотрел", "л"], f: ["смотрела", "ла"], n: ["смотрело", "ло"], pl: ["смотрели", "ли"] },
  ),
  verb(
    "строить",
    "build",
    "imperfective",
    "second",
    { "1sg": ["строю", "ю"], "2sg": ["строишь", "ишь"], "3sg": ["строит", "ит"], "1pl": ["строим", "им"], "2pl": ["строите", "ите"], "3pl": ["строят", "ят"] },
    { m: ["строил", "л"], f: ["строила", "ла"], n: ["строило", "ло"], pl: ["строили", "ли"] },
  ),
  verb(
    "верить",
    "believe",
    "imperfective",
    "second",
    { "1sg": ["верю", "ю"], "2sg": ["веришь", "ишь"], "3sg": ["верит", "ит"], "1pl": ["верим", "им"], "2pl": ["верите", "ите"], "3pl": ["верят", "ят"] },
    { m: ["верил", "л"], f: ["верила", "ла"], n: ["верило", "ло"], pl: ["верили", "ли"] },
  ),
  verb(
    "поговорить",
    "have a talk",
    "perfective",
    "second",
    { "1sg": ["поговорю", "ю"], "2sg": ["поговоришь", "ишь"], "3sg": ["поговорит", "ит"], "1pl": ["поговорим", "им"], "2pl": ["поговорите", "ите"], "3pl": ["поговорят", "ят"] },
    { m: ["поговорил", "л"], f: ["поговорила", "ла"], n: ["поговорило", "ло"], pl: ["поговорили", "ли"] },
  ),
  verb(
    "позвонить",
    "give a call",
    "perfective",
    "second",
    { "1sg": ["позвоню", "ю"], "2sg": ["позвонишь", "ишь"], "3sg": ["позвонит", "ит"], "1pl": ["позвоним", "им"], "2pl": ["позвоните", "ите"], "3pl": ["позвонят", "ят"] },
    { m: ["позвонил", "л"], f: ["позвонила", "ла"], n: ["позвонило", "ло"], pl: ["позвонили", "ли"] },
  ),
  verb(
    "посмотреть",
    "take a look / watch (to the end)",
    "perfective",
    "second",
    { "1sg": ["посмотрю", "ю"], "2sg": ["посмотришь", "ишь"], "3sg": ["посмотрит", "ит"], "1pl": ["посмотрим", "им"], "2pl": ["посмотрите", "ите"], "3pl": ["посмотрят", "ят"] },
    { m: ["посмотрел", "л"], f: ["посмотрела", "ла"], n: ["посмотрело", "ло"], pl: ["посмотрели", "ли"] },
  ),
  verb(
    "построить",
    "build (finish building)",
    "perfective",
    "second",
    { "1sg": ["построю", "ю"], "2sg": ["построишь", "ишь"], "3sg": ["построит", "ит"], "1pl": ["построим", "им"], "2pl": ["построите", "ите"], "3pl": ["построят", "ят"] },
    { m: ["построил", "л"], f: ["построила", "ла"], n: ["построило", "ло"], pl: ["построили", "ли"] },
  ),
  verb(
    "поверить",
    "come to believe / trust",
    "perfective",
    "second",
    { "1sg": ["поверю", "ю"], "2sg": ["поверишь", "ишь"], "3sg": ["поверит", "ит"], "1pl": ["поверим", "им"], "2pl": ["поверите", "ите"], "3pl": ["поверят", "ят"] },
    { m: ["поверил", "л"], f: ["поверила", "ла"], n: ["поверило", "ло"], pl: ["поверили", "ли"] },
  ),
];

function verb(
  inf: string,
  en: string,
  aspect: AspectId,
  conj: ConjugationId,
  present: Record<string, [string, string]>,
  past: Record<string, [string, string]>,
): VerbWord {
  const p: VerbWord["present"] = {};
  for (const [k, [full, ending]] of Object.entries(present)) p[k] = { full, ending };
  const pa: VerbWord["past"] = {};
  for (const [k, [full, ending]] of Object.entries(past)) pa[k] = { full, ending };
  return { inf, en, aspect, conj, present: p, past: pa };
}

const FIRST_ENDINGS: Record<string, string> = {
  "1_sg": "-ю (sometimes -у)",
  "2_sg": "-ешь",
  "3_sg": "-ет",
  "1_pl": "-ем",
  "2_pl": "-ете",
  "3_pl": "-ют (sometimes -ут)",
};

const SECOND_ENDINGS: Record<string, string> = {
  "1_sg": "-ю (sometimes -у)",
  "2_sg": "-ишь",
  "3_sg": "-ит",
  "1_pl": "-им",
  "2_pl": "-ите",
  "3_pl": "-ят (sometimes -ат)",
};

const PAST_ENDINGS: Record<string, string> = {
  m: "-л",
  f: "-ла",
  n: "-ло",
  pl: "-ли",
};

export function getVerbResult(input: {
  tense: TenseId;
  aspect: AspectId;
  person?: PersonId;
  number: NumberId;
  gender?: GenderId;
  conjugation?: ConjugationId;
}): TrainerResult {
  const { tense, aspect, person, number, gender, conjugation } = input;
  const personKey = person ? `${person}_${number}` : "";

  if (tense === "past") {
    const pastKey = number === "pl" ? "pl" : (gender ?? "m");
    const ending = PAST_ENDINGS[pastKey];
    const words = VERBS.filter((v) => v.aspect === aspect).slice(0, 6);
    const examples: TrainerExample[] = words.map((v) => {
      const form = v.past[pastKey];
      return {
        from: splitForm(v.inf, "ть"),
        form: splitForm(form.full, form.ending),
        en: `${pastGloss(aspect, v.en)} — ${whoPast(number, gender)}`,
      };
    });
    const who =
      number === "pl"
        ? "the plural (we / you / they — gender does not matter)"
        : `${genderLabel(gender ?? "m")} singular`;
    return {
      heading: `Past · ${aspect} · ${who}`,
      endingLabel: ending,
      endingSpoken: `the ending ${ending}`,
      endingDisplay: ending,
      rule:
        aspect === "imperfective"
          ? `The imperfective past describes an action that was in progress, repeated, or not focused on a result. Add ${ending} to the past stem (infinitive minus -ть).`
          : `The perfective past describes a completed action with a result. Add ${ending} to the past stem. Person does not change the past form — only gender (in the singular) and number.`,
      notes: [
        "Past forms do not change for я / ты / он. Он читал, она читала, оно читало, они читали.",
        "If the infinitive ends in -чь or -ти, the stem is irregular (мочь → мог, идти → шёл). This trainer shows the regular -ть pattern.",
      ],
      examples,
      typicalUse: "Use the past to tell what happened: Вчера я читал книгу.",
    };
  }

  if (tense === "future" && aspect === "imperfective") {
    const be = BE_FUTURE[personKey];
    const words = VERBS.filter((v) => v.aspect === "imperfective").slice(0, 6);
    const examples: TrainerExample[] = words.map((v) => ({
      form: splitForm(be.full, be.ending),
      extraRu: v.inf,
      en: `I/you/… will be ${v.en.replace(/^\w/, (c) => c)}ing — ${PERSON_LABEL[personKey]}`,
    }));
    // Fix English glosses more cleanly
    const who = PERSON_LABEL[personKey];
    return {
      heading: `Future · imperfective · ${who}`,
      endingLabel: `${be.full} + infinitive`,
      endingSpoken: `${be.full} plus the imperfective infinitive`,
      endingDisplay: `${be.full} + infinitive`,
      rule: `The imperfective future is a form of “to be” plus the imperfective infinitive. For ${who} the helping verb is ${be.full}. The main verb does not take a personal ending.`,
      notes: [
        "Imperfective future = ongoing or repeated action in the future: Я буду читать каждый день.",
        "Perfective future is different: it uses present-looking endings and means a completed future action (Я прочитаю книгу).",
        "будешь / будет / будем / будете keep the same first-conjugation endings as a present-tense verb.",
      ],
      examples: VERBS.filter((v) => v.aspect === "imperfective")
        .slice(0, 6)
        .map((v) => ({
          form: splitForm(be.full, be.ending),
          extraRu: v.inf,
          en: `${who}: will ${v.en}`,
        })),
      typicalUse: "Use this for “will be doing” or a repeated future habit.",
    };
  }

  // Present of imperfective, OR present-looking forms of perfective (which mean future),
  // OR future of perfective (same endings).
  const conj = conjugation ?? "first";
  const endingMap = conj === "first" ? FIRST_ENDINGS : SECOND_ENDINGS;
  const endingLabel = endingMap[personKey];
  const words = VERBS.filter((v) => v.aspect === aspect && v.conj === conj).slice(0, 6);
  const pk = PERSON_KEY[personKey];
  const examples: TrainerExample[] = words.map((v) => {
    const form = v.present[pk];
    return {
      from: splitForm(v.inf, "ть"),
      form: splitForm(form.full, form.ending),
      en:
        aspect === "perfective" || tense === "future"
          ? `${PERSON_LABEL[personKey]} will ${v.en}`
          : `${PERSON_LABEL[personKey]} ${presentEn(v.en, personKey)}`,
    };
  });

  const isFutureMeaning = aspect === "perfective" || tense === "future";
  const headingTense = isFutureMeaning ? "Future (perfective)" : "Present";
  const conjName = conj === "first" ? "first conjugation" : "second conjugation";

  let rule: string;
  if (tense === "present" && aspect === "perfective") {
    rule = `Perfective verbs have no present-tense meaning. The forms that look like the present are used as the future. For ${PERSON_LABEL[personKey]}, ${conjName} adds ${endingLabel}. Я прочитаю = I will read it (to the end), not “I am reading”.`;
  } else if (isFutureMeaning) {
    rule = `The perfective future uses the same personal endings as the present tense. For ${PERSON_LABEL[personKey]}, ${conjName} adds ${endingLabel}. The meaning is a completed action in the future.`;
  } else {
    rule = `Imperfective present describes what is happening now, or what happens regularly. For ${PERSON_LABEL[personKey]}, ${conjName} adds ${endingLabel}.`;
  }

  const notes = [
    conj === "first"
      ? "First conjugation test: the ты form has е — читаешь, работает. The они form has у/ю — читают."
      : "Second conjugation test: the ты form has и — говоришь, звонит. The они form has а/я — говорят.",
    "Some verbs change a consonant only in the я form (любить → люблю, видеть → вижу). The other persons stay regular.",
    tense === "present" && aspect === "imperfective"
      ? "There is no present tense for perfective verbs. To talk about now, use the imperfective."
      : "Compare: Я буду читать (I will be reading / I will read regularly) vs Я прочитаю (I will get the reading done).",
  ];

  return {
    heading: `${headingTense} · ${aspect} · ${conjName} · ${PERSON_LABEL[personKey]}`,
    endingLabel,
    endingSpoken: `the ending ${endingLabel}`,
    endingDisplay: endingLabel,
    rule,
    notes,
    examples,
    typicalUse: isFutureMeaning
      ? "Use the perfective future when the action will be completed: Завтра я прочитаю эту главу."
      : "Use the present for now and for habits: Я читаю каждый вечер.",
  };
}

function genderLabel(g: GenderId): string {
  return g === "m" ? "masculine" : g === "f" ? "feminine" : "neuter";
}

function whoPast(number: NumberId, gender?: GenderId): string {
  if (number === "pl") return "мы / вы / они";
  if (gender === "f") return "я / ты / она (feminine)";
  if (gender === "n") return "оно (neuter or impersonal)";
  return "я / ты / он (masculine)";
}

function pastGloss(aspect: AspectId, en: string): string {
  return aspect === "perfective" ? `completed: ${en}` : `was / used to ${en}`;
}

function presentEn(en: string, personKey: string): string {
  if (personKey.startsWith("3") && !en.endsWith("s")) {
    if (en.includes(" / ")) return en;
    return `${en}s`;
  }
  return en;
}

export function findVerb(inf: string) {
  const n = inf.trim().toLowerCase();
  return VERBS.find((v) => v.inf === n);
}

export function inflectedVerbForm(input: {
  inf: string;
  tense: TenseId;
  aspect?: AspectId;
  person?: PersonId;
  number: NumberId;
  gender?: GenderId;
}): { full: string; extra?: string } | undefined {
  const v = findVerb(input.inf);
  const personKey = `${input.person ?? "1"}_${input.number}`;
  if (input.tense === "past") {
    const pastKey = input.number === "pl" ? "pl" : (input.gender ?? "m");
    if (v) return { full: v.past[pastKey].full };
    return undefined;
  }
  if (input.tense === "future" && (input.aspect ?? v?.aspect) === "imperfective") {
    const be = BE_FUTURE[personKey];
    const inf = v?.inf ?? input.inf.trim().toLowerCase();
    return { full: `${be.full} ${inf}`, extra: inf };
  }
  if (v) {
    const pk = PERSON_KEY[personKey];
    const form = v.present[pk];
    if (form) return { full: form.full };
  }
  return undefined;
}
