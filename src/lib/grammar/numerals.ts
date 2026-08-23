import { CASE_LABEL, GENDER_LABEL } from "./labels";
import type {
  AnimacyId,
  CaseId,
  Choice,
  GenderId,
  NumeralKind,
  NumberId,
  TrainerExample,
  TrainerResult,
} from "./types";
import { splitForm } from "./types";

export type CardinalId = "1" | "2" | "3" | "4" | "5" | "40" | "1000";

export const CARDINAL_CHOICES: Choice[] = [
  {
    id: "1",
    title: "1 — один",
    description: "один / одна / одно",
    ariaLabel: "The number one.",
  },
  {
    id: "2",
    title: "2 — два / две",
    description: "два for masculine and neuter, две for feminine",
    ariaLabel: "The number two.",
  },
  {
    id: "3",
    title: "3 — три",
    description: "no gender split",
    ariaLabel: "The number three.",
  },
  {
    id: "4",
    title: "4 — четыре",
    description: "same pattern as три",
    ariaLabel: "The number four.",
  },
  {
    id: "5",
    title: "5–20 and 30",
    description: "пять, десять, двадцать",
    ariaLabel: "Numbers from five to twenty and thirty.",
  },
  {
    id: "40",
    title: "40, 90, 100",
    description: "сорок, девяносто, сто",
    ariaLabel: "Forty, ninety and a hundred.",
  },
  {
    id: "1000",
    title: "1,000 — тысяча",
    description: "declines like a feminine noun in -а",
    ariaLabel: "One thousand.",
  },
];

type FormRow = { full: string; ending: string; phrase: string; phraseEn: string };

function row(full: string, ending: string, phrase: string, phraseEn: string): FormRow {
  return { full, ending, phrase, phraseEn };
}

/** cardinal → case → optional gender/animacy key → forms */
function oneForms(caseId: CaseId, gender: GenderId, animacy: AnimacyId): FormRow[] {
  const g = gender;
  const an = animacy === "animate";
  const table: Record<string, FormRow[]> = {
    nom_m: [
      row("один", "ин", "один стол", "one table"),
      row("один", "ин", "один студент", "one student"),
      row("один", "ин", "один день", "one day"),
      row("один", "ин", "один фильм", "one film"),
      row("один", "ин", "один друг", "one friend"),
    ],
    nom_f: [
      row("одна", "а", "одна книга", "one book"),
      row("одна", "а", "одна мама", "one mum"),
      row("одна", "а", "одна ночь", "one night"),
      row("одна", "а", "одна машина", "one car"),
      row("одна", "а", "одна идея", "one idea"),
    ],
    nom_n: [
      row("одно", "о", "одно окно", "one window"),
      row("одно", "о", "одно слово", "one word"),
      row("одно", "о", "одно место", "one place"),
      row("одно", "о", "одно море", "one sea"),
      row("одно", "о", "одно решение", "one decision"),
    ],
    gen_m: [
      row("одного", "ого", "одного стола", "of one table"),
      row("одного", "ого", "одного студента", "of one student"),
      row("одного", "ого", "нет одного друга", "there is not one friend"),
      row("одного", "ого", "из одного фильма", "from one film"),
      row("одного", "ого", "у одного окна? wait", "of one day"),
    ],
  };
  void table;
  void g;
  void an;

  const data: Record<CaseId, Record<GenderId, FormRow[]>> = {
    nom: {
      m: [
        row("один", "", "один стол", "one table"),
        row("один", "", "один студент", "one student"),
        row("один", "", "один день", "one day"),
        row("один", "", "один фильм", "one film"),
        row("один", "", "один парк", "one park"),
      ],
      f: [
        row("одна", "а", "одна книга", "one book"),
        row("одна", "а", "одна мама", "one mum"),
        row("одна", "а", "одна ночь", "one night"),
        row("одна", "а", "одна машина", "one car"),
        row("одна", "а", "одна школа", "one school"),
      ],
      n: [
        row("одно", "о", "одно окно", "one window"),
        row("одно", "о", "одно слово", "one word"),
        row("одно", "о", "одно место", "one place"),
        row("одно", "о", "одно море", "one sea"),
        row("одно", "о", "одно яблоко", "one apple"),
      ],
    },
    gen: {
      m: [
        row("одного", "ого", "нет одного стола", "there is not one table"),
        row("одного", "ого", "у одного студента", "at one student’s (place)"),
        row("одного", "ого", "из одного фильма", "from one film"),
        row("одного", "ого", "для одного друга", "for one friend"),
        row("одного", "ого", "без одного дня", "without one day"),
      ],
      f: [
        row("одной", "ой", "нет одной книги", "there is not one book"),
        row("одной", "ой", "у одной мамы", "at one mum’s (place)"),
        row("одной", "ой", "из одной школы", "from one school"),
        row("одной", "ой", "для одной машины", "for one car"),
        row("одной", "ой", "без одной ночи", "without one night"),
      ],
      n: [
        row("одного", "ого", "нет одного окна", "there is not one window"),
        row("одного", "ого", "из одного слова", "from one word"),
        row("одного", "ого", "для одного места", "for one place"),
        row("одного", "ого", "без одного яблока", "without one apple"),
        row("одного", "ого", "у одного моря", "by one sea"),
      ],
    },
    dat: {
      m: [
        row("одному", "ому", "к одному столу", "towards one table"),
        row("одному", "ому", "одному студенту", "to one student"),
        row("одному", "ому", "по одному дню", "one day each"),
        row("одному", "ому", "одному другу", "to one friend"),
        row("одному", "ому", "к одному парку", "towards one park"),
      ],
      f: [
        row("одной", "ой", "к одной книге", "towards one book"),
        row("одной", "ой", "одной маме", "to one mum"),
        row("одной", "ой", "по одной улице", "along one street"),
        row("одной", "ой", "к одной школе", "towards one school"),
        row("одной", "ой", "одной машине", "to one car"),
      ],
      n: [
        row("одному", "ому", "к одному окну", "towards one window"),
        row("одному", "ому", "одному слову", "to one word"),
        row("одному", "ому", "по одному месту", "to one place each"),
        row("одному", "ому", "к одному морю", "towards one sea"),
        row("одному", "ому", "одному яблоку", "to one apple"),
      ],
    },
    acc: {
      m: an
        ? [
            row("одного", "ого", "вижу одного студента", "I see one student"),
            row("одного", "ого", "вижу одного друга", "I see one friend"),
            row("одного", "ого", "вижу одного кота", "I see one cat"),
            row("одного", "ого", "знаю одного врача", "I know one doctor"),
            row("одного", "ого", "люблю одного актёра", "I love one actor"),
          ]
        : [
            row("один", "", "вижу один стол", "I see one table"),
            row("один", "", "смотрю один фильм", "I watch one film"),
            row("один", "", "беру один день", "I take one day"),
            row("один", "", "покупаю один билет", "I buy one ticket"),
            row("один", "", "вижу один парк", "I see one park"),
          ],
      f: [
        row("одну", "у", "вижу одну книгу", "I see one book"),
        row("одну", "у", "вижу одну маму", "I see one mum"),
        row("одну", "у", "беру одну машину", "I take one car"),
        row("одну", "у", "знаю одну песню", "I know one song"),
        row("одну", "у", "открываю одну дверь", "I open one door"),
      ],
      n: [
        row("одно", "о", "вижу одно окно", "I see one window"),
        row("одно", "о", "помню одно слово", "I remember one word"),
        row("одно", "о", "выбираю одно место", "I choose one place"),
        row("одно", "о", "ем одно яблоко", "I eat one apple"),
        row("одно", "о", "принимаю одно решение", "I make one decision"),
      ],
    },
    ins: {
      m: [
        row("одним", "им", "с одним столом", "with one table"),
        row("одним", "им", "с одним студентом", "with one student"),
        row("одним", "им", "одним днём", "in one day"),
        row("одним", "им", "с одним другом", "with one friend"),
        row("одним", "им", "одним билетом", "with one ticket"),
      ],
      f: [
        row("одной", "ой", "с одной книгой", "with one book"),
        row("одной", "ой", "с одной мамой", "with one mum"),
        row("одной", "ой", "одной машиной", "by one car"),
        row("одной", "ой", "одной рукой", "with one hand"),
        row("одной", "ой", "с одной собакой", "with one dog"),
      ],
      n: [
        row("одним", "им", "с одним окном", "with one window"),
        row("одним", "им", "одним словом", "in a word / with one word"),
        row("одним", "им", "одним местом", "with one place"),
        row("одним", "им", "одним яблоком", "with one apple"),
        row("одним", "им", "одним решением", "with one decision"),
      ],
    },
    prep: {
      m: [
        row("одном", "ом", "об одном столе", "about one table"),
        row("одном", "ом", "об одном студенте", "about one student"),
        row("одном", "ом", "в одном фильме", "in one film"),
        row("одном", "ом", "об одном дне", "about one day"),
        row("одном", "ом", "в одном парке", "in one park"),
      ],
      f: [
        row("одной", "ой", "об одной книге", "about one book"),
        row("одной", "ой", "об одной маме", "about one mum"),
        row("одной", "ой", "в одной школе", "in one school"),
        row("одной", "ой", "о одной машине", "about one car"),
        row("одной", "ой", "в одной комнате", "in one room"),
      ],
      n: [
        row("одном", "ом", "об одном окне", "about one window"),
        row("одном", "ом", "об одном слове", "about one word"),
        row("одном", "ом", "в одном месте", "in one place"),
        row("одном", "ом", "об одном море", "about one sea"),
        row("одном", "ом", "в одном здании", "in one building"),
      ],
    },
  };
  return data[caseId][gender];
}

function twoForms(caseId: CaseId, gender: GenderId, animacy: AnimacyId): FormRow[] {
  const fem = gender === "f";
  const an = animacy === "animate";
  switch (caseId) {
    case "nom":
      return fem
        ? [
            row("две", "е", "две книги", "two books"),
            row("две", "е", "две сестры", "two sisters"),
            row("две", "е", "две машины", "two cars"),
            row("две", "е", "две ночи", "two nights"),
            row("две", "е", "две школы", "two schools"),
          ]
        : gender === "n"
          ? [
              row("два", "а", "два окна", "two windows"),
              row("два", "а", "два слова", "two words"),
              row("два", "а", "два места", "two places"),
              row("два", "а", "два моря", "two seas"),
              row("два", "а", "два яблока", "two apples"),
            ]
          : [
              row("два", "а", "два стола", "two tables"),
              row("два", "а", "два студента", "two students"),
              row("два", "а", "два дня", "two days"),
              row("два", "а", "два фильма", "two films"),
              row("два", "а", "два друга", "two friends"),
            ];
    case "gen":
      return [
        row("двух", "ух", fem ? "двух книг" : gender === "n" ? "двух окон" : "двух столов", fem ? "of two books" : gender === "n" ? "of two windows" : "of two tables"),
        row("двух", "ух", fem ? "двух сестёр" : "двух студентов", fem ? "of two sisters" : "of two students"),
        row("двух", "ух", fem ? "двух машин" : "двух дней", fem ? "of two cars" : "of two days"),
        row("двух", "ух", "нет двух билетов", "there are not two tickets"),
        row("двух", "ух", "из двух городов", "from two cities"),
      ];
    case "dat":
      return [
        row("двум", "ум", fem ? "двум книгам" : "двум столам", fem ? "to two books" : "to two tables"),
        row("двум", "ум", fem ? "двум сёстрам" : "двум студентам", fem ? "to two sisters" : "to two students"),
        row("двум", "ум", "к двум домам", "towards two houses"),
        row("двум", "ум", "двум друзьям", "to two friends"),
        row("двум", "ум", "по двум улицам", "along two streets"),
      ];
    case "acc":
      if (an && gender !== "n") {
        return [
          row("двух", "ух", fem ? "вижу двух сестёр" : "вижу двух студентов", fem ? "I see two sisters" : "I see two students"),
          row("двух", "ух", fem ? "знаю двух мам" : "знаю двух друзей", fem ? "I know two mums" : "I know two friends"),
          row("двух", "ух", fem ? "вижу двух собак" : "вижу двух котов", fem ? "I see two dogs" : "I see two cats"),
          row("двух", "ух", "встречаю двух учителей", "I meet two teachers"),
          row("двух", "ух", "люблю двух актёров", "I love two actors"),
        ];
      }
      return fem
        ? [
            row("две", "е", "вижу две книги", "I see two books"),
            row("две", "е", "беру две машины", "I take two cars"),
            row("две", "е", "читаю две газеты", "I read two newspapers"),
            row("две", "е", "открываю две двери", "I open two doors"),
            row("две", "е", "покупаю две лампы", "I buy two lamps"),
          ]
        : [
            row("два", "а", gender === "n" ? "вижу два окна" : "вижу два стола", gender === "n" ? "I see two windows" : "I see two tables"),
            row("два", "а", gender === "n" ? "выбираю два места" : "беру два билета", gender === "n" ? "I choose two places" : "I take two tickets"),
            row("два", "а", gender === "n" ? "помню два слова" : "смотрю два фильма", gender === "n" ? "I remember two words" : "I watch two films"),
            row("два", "а", "ем два яблока", "I eat two apples"),
            row("два", "а", "вижу два дома", "I see two houses"),
          ];
    case "ins":
      return [
        row("двумя", "умя", fem ? "с двумя книгами" : "с двумя столами", fem ? "with two books" : "with two tables"),
        row("двумя", "умя", fem ? "с двумя сёстрами" : "с двумя друзьями", fem ? "with two sisters" : "with two friends"),
        row("двумя", "умя", "двумя руками", "with two hands"),
        row("двумя", "умя", "двумя словами", "in two words"),
        row("двумя", "умя", "между двумя домами", "between two houses"),
      ];
    case "prep":
      return [
        row("двух", "ух", fem ? "о двух книгах" : "о двух столах", fem ? "about two books" : "about two tables"),
        row("двух", "ух", fem ? "о двух сёстрах" : "о двух студентах", fem ? "about two sisters" : "about two students"),
        row("двух", "ух", "в двух комнатах", "in two rooms"),
        row("двух", "ух", "на двух языках", "in two languages"),
        row("двух", "ух", "о двух днях", "about two days"),
      ];
  }
}

function threeFourForms(n: "3" | "4", caseId: CaseId, animacy: AnimacyId): FormRow[] {
  const enWord = n === "3" ? "three" : "four";
  const an = animacy === "animate";
  const map: Record<CaseId, { full: string; ending: string }> = n === "3"
    ? {
        nom: { full: "три", ending: "и" },
        gen: { full: "трёх", ending: "ёх" },
        dat: { full: "трём", ending: "ём" },
        acc: an ? { full: "трёх", ending: "ёх" } : { full: "три", ending: "и" },
        ins: { full: "тремя", ending: "емя" },
        prep: { full: "трёх", ending: "ёх" },
      }
    : {
        nom: { full: "четыре", ending: "е" },
        gen: { full: "четырёх", ending: "ёх" },
        dat: { full: "четырём", ending: "ём" },
        acc: an ? { full: "четырёх", ending: "ёх" } : { full: "четыре", ending: "е" },
        ins: { full: "четырьмя", ending: "ьмя" },
        prep: { full: "четырёх", ending: "ёх" },
      };
  const f = map[caseId];
  const nounNomish = n === "3" ? "три стола" : "четыре стола";
  const phrases: Record<CaseId, [string, string][]> = {
    nom: [
      [n === "3" ? "три стола" : "четыре стола", `${enWord} tables — noun in genitive singular`],
      [n === "3" ? "три книги" : "четыре книги", `${enWord} books`],
      [n === "3" ? "три студента" : "четыре студента", `${enWord} students`],
      [n === "3" ? "три окна" : "четыре окна", `${enWord} windows`],
      [n === "3" ? "три дня" : "четыре дня", `${enWord} days`],
    ],
    gen: [
      [n === "3" ? "нет трёх столов" : "нет четырёх столов", `there are not ${enWord} tables`],
      [n === "3" ? "из трёх книг" : "из четырёх книг", `from ${enWord} books`],
      [n === "3" ? "у трёх друзей" : "у четырёх друзей", `at ${enWord} friends’ place`],
      [n === "3" ? "для трёх детей" : "для четырёх детей", `for ${enWord} children`],
      [n === "3" ? "без трёх дней" : "без четырёх дней", `without ${enWord} days`],
    ],
    dat: [
      [n === "3" ? "к трём столам" : "к четырём столам", `towards ${enWord} tables`],
      [n === "3" ? "трём друзьям" : "четырём друзьям", `to ${enWord} friends`],
      [n === "3" ? "по трём улицам" : "по четырём улицам", `along ${enWord} streets`],
      [n === "3" ? "трём студентам" : "четырём студентам", `to ${enWord} students`],
      [n === "3" ? "к трём окнам" : "к четырём окнам", `towards ${enWord} windows`],
    ],
    acc: an
      ? [
          [n === "3" ? "вижу трёх студентов" : "вижу четырёх студентов", `I see ${enWord} students`],
          [n === "3" ? "знаю трёх друзей" : "знаю четырёх друзей", `I know ${enWord} friends`],
          [n === "3" ? "вижу трёх котов" : "вижу четырёх котов", `I see ${enWord} cats`],
          [n === "3" ? "встречаю трёх сестёр" : "встречаю четырёх сестёр", `I meet ${enWord} sisters`],
          [n === "3" ? "люблю трёх актёров" : "люблю четырёх актёров", `I love ${enWord} actors`],
        ]
      : [
          [n === "3" ? "вижу три стола" : "вижу четыре стола", `I see ${enWord} tables`],
          [n === "3" ? "беру три книги" : "беру четыре книги", `I take ${enWord} books`],
          [n === "3" ? "смотрю три фильма" : "смотрю четыре фильма", `I watch ${enWord} films`],
          [n === "3" ? "открываю три окна" : "открываю четыре окна", `I open ${enWord} windows`],
          [n === "3" ? "покупаю три билета" : "покупаю четыре билета", `I buy ${enWord} tickets`],
        ],
    ins: [
      [n === "3" ? "с тремя друзьями" : "с четырьмя друзьями", `with ${enWord} friends`],
      [n === "3" ? "тремя словами" : "четырьмя словами", `in ${enWord} words`],
      [n === "3" ? "между тремя домами" : "между четырьмя домами", `between ${enWord} houses`],
      [n === "3" ? "тремя руками" : "четырьмя руками", `with ${enWord} hands`],
      [n === "3" ? "с тремя книгами" : "с четырьмя книгами", `with ${enWord} books`],
    ],
    prep: [
      [n === "3" ? "о трёх столах" : "о четырёх столах", `about ${enWord} tables`],
      [n === "3" ? "о трёх друзьях" : "о четырёх друзьях", `about ${enWord} friends`],
      [n === "3" ? "в трёх комнатах" : "в четырёх комнатах", `in ${enWord} rooms`],
      [n === "3" ? "на трёх языках" : "на четырёх языках", `in ${enWord} languages`],
      [n === "3" ? "о трёх днях" : "о четырёх днях", `about ${enWord} days`],
    ],
  };
  void nounNomish;
  return phrases[caseId].map(([phrase, en]) => row(f.full, f.ending, phrase, en));
}

function fiveForms(caseId: CaseId): FormRow[] {
  const map: Record<CaseId, { full: string; ending: string }> = {
    nom: { full: "пять", ending: "ь" },
    gen: { full: "пяти", ending: "и" },
    dat: { full: "пяти", ending: "и" },
    acc: { full: "пять", ending: "ь" },
    ins: { full: "пятью", ending: "ью" },
    prep: { full: "пяти", ending: "и" },
  };
  const f = map[caseId];
  const phrases: Record<CaseId, [string, string][]> = {
    nom: [
      ["пять книг", "five books (noun in genitive plural)"],
      ["десять столов", "ten tables"],
      ["шесть окон", "six windows"],
      ["семь дней", "seven days"],
      ["двадцать студентов", "twenty students"],
    ],
    gen: [
      ["нет пяти книг", "there are not five books"],
      ["из десяти столов", "from ten tables"],
      ["без шести окон", "without six windows"],
      ["для семи дней", "for seven days"],
      ["у двадцати студентов", "at the twenty students’"],
    ],
    dat: [
      ["к пяти книгам", "towards five books"],
      ["десяти друзьям", "to ten friends"],
      ["по шести урокам", "over six lessons"],
      ["семи студентам", "to seven students"],
      ["к двадцати домам", "towards twenty houses"],
    ],
    acc: [
      ["вижу пять книг", "I see five books"],
      ["беру десять столов", "I take ten tables"],
      ["открываю шесть окон", "I open six windows"],
      ["знаю семь студентов", "I know seven students — the numeral stays пять-type, the noun is genitive plural"],
      ["покупаю двадцать билетов", "I buy twenty tickets"],
    ],
    ins: [
      ["с пятью книгами", "with five books"],
      ["десятью словами", "in ten words"],
      ["с шестью друзьями", "with six friends"],
      ["семью днями", "over seven days"],
      ["с двадцатью студентами", "with twenty students"],
    ],
    prep: [
      ["о пяти книгах", "about five books"],
      ["о десяти столах", "about ten tables"],
      ["в шести комнатах", "in six rooms"],
      ["на семи языках", "in seven languages"],
      ["о двадцати студентах", "about twenty students"],
    ],
  };
  return phrases[caseId].map(([phrase, en]) => row(f.full, f.ending, phrase, en));
}

function fortyForms(caseId: CaseId): FormRow[] {
  const oblique = caseId !== "nom" && caseId !== "acc";
  const f = oblique
    ? { full: "сорока", ending: "а" }
    : { full: "сорок", ending: "" };
  const sto = oblique ? "ста" : "сто";
  const dev = oblique ? "девяноста" : "девяносто";
  const phrases: Record<CaseId, [string, string][]> = {
    nom: [
      ["сорок студентов", "forty students"],
      ["девяносто дней", "ninety days"],
      ["сто книг", "a hundred books"],
      ["сорок окон", "forty windows"],
      ["сто рублей", "a hundred roubles"],
    ],
    gen: [
      ["нет сорока студентов", "there are not forty students"],
      ["из девяноста дней", "from ninety days"],
      ["без ста книг", "without a hundred books"],
      ["до сорока окон", "up to forty windows"],
      ["из ста рублей", "from a hundred roubles"],
    ],
    dat: [
      ["к сорока студентам", "towards forty students"],
      ["к девяноста дням", "towards ninety days"],
      ["к ста книгам", "towards a hundred books"],
      ["сорока друзьям", "to forty friends"],
      ["ста рублям", "to a hundred roubles"],
    ],
    acc: [
      ["вижу сорок студентов", "I see forty students"],
      ["жду девяносто дней", "I wait ninety days"],
      ["беру сто книг", "I take a hundred books"],
      ["плачу сто рублей", "I pay a hundred roubles"],
      ["открываю сорок окон", "I open forty windows"],
    ],
    ins: [
      ["с сорока студентами", "with forty students"],
      ["с девяноста днями", "with ninety days"],
      ["со ста книгами", "with a hundred books"],
      ["сорока рублями", "with forty roubles"],
      ["со ста друзьями", "with a hundred friends"],
    ],
    prep: [
      ["о сорока студентах", "about forty students"],
      ["о девяноста днях", "about ninety days"],
      ["о ста книгах", "about a hundred books"],
      ["в сорока комнатах", "in forty rooms"],
      ["на ста страницах", "on a hundred pages"],
    ],
  };
  void sto;
  void dev;
  return phrases[caseId].map(([phrase, en]) => row(f.full, f.ending, phrase, en));
}

function thousandForms(caseId: CaseId): FormRow[] {
  const map: Record<CaseId, { full: string; ending: string }> = {
    nom: { full: "тысяча", ending: "а" },
    gen: { full: "тысячи", ending: "и" },
    dat: { full: "тысяче", ending: "е" },
    acc: { full: "тысячу", ending: "у" },
    ins: { full: "тысячей", ending: "ей" },
    prep: { full: "тысяче", ending: "е" },
  };
  const f = map[caseId];
  const phrases: Record<CaseId, [string, string][]> = {
    nom: [
      ["тысяча рублей", "a thousand roubles"],
      ["тысяча человек", "a thousand people"],
      ["тысяча книг", "a thousand books"],
      ["одна тысяча", "one thousand"],
      ["тысяча окон", "a thousand windows"],
    ],
    gen: [
      ["нет тысячи рублей", "there is not a thousand roubles"],
      ["из тысячи книг", "from a thousand books"],
      ["до тысячи человек", "up to a thousand people"],
      ["без тысячи причин", "without a thousand reasons"],
      ["у тысячи окон", "at a thousand windows"],
    ],
    dat: [
      ["к тысяче рублей", "towards a thousand roubles"],
      ["тысяче человек", "to a thousand people"],
      ["к тысяче книг", "towards a thousand books"],
      ["по тысяче причин", "for a thousand reasons"],
      ["к тысяче окон", "towards a thousand windows"],
    ],
    acc: [
      ["вижу тысячу рублей", "I see a thousand roubles"],
      ["получаю тысячу писем", "I receive a thousand letters"],
      ["читаю тысячу страниц", "I read a thousand pages"],
      ["знаю тысячу слов", "I know a thousand words"],
      ["трачу тысячу рублей", "I spend a thousand roubles"],
    ],
    ins: [
      ["с тысячей рублей", "with a thousand roubles"],
      ["тысячей причин", "for a thousand reasons"],
      ["с тысячей друзей", "with a thousand friends"],
      ["между тысячей окон", "among a thousand windows"],
      ["тысячей слов", "in a thousand words"],
    ],
    prep: [
      ["о тысяче рублей", "about a thousand roubles"],
      ["о тысяче человек", "about a thousand people"],
      ["в тысяче книг", "in a thousand books"],
      ["на тысяче страниц", "on a thousand pages"],
      ["о тысяче окон", "about a thousand windows"],
    ],
  };
  return phrases[caseId].map(([phrase, en]) => row(f.full, f.ending, phrase, en));
}

const CARDINAL_RULES: Record<CardinalId, Record<CaseId, string>> = {
  "1": {
    nom: "Masculine один, feminine одна, neuter одно: один стол, одна книга, одно окно.",
    gen: "Genitive of 1 is одного (m/n) or одной (f), like a hard adjective.",
    dat: "Dative of 1 is одному (m/n) or одной (f).",
    acc: "Accusative of 1 copies nominative for things (один стол, одно окно) and genitive for people and animals (одного студента). Feminine is always одну.",
    ins: "Instrumental of 1 is одним (m/n) or одной (f).",
    prep: "Prepositional of 1 is одном (m/n) or одной (f): в одном доме, об одной книге.",
  },
  "2": {
    nom: "два is used with masculine and neuter nouns; две is used with feminine nouns. The noun is genitive singular: два стола, две книги, два окна.",
    gen: "Both genders share двух in the genitive. The noun is genitive plural: двух столов, двух книг.",
    dat: "Both genders share двум. The noun is dative plural: двум столам.",
    acc: "For things, accusative = nominative (два стола, две книги). For people and animals, accusative = genitive (двух студентов, двух сестёр). Neuter everyday nouns stay два.",
    ins: "Both genders share двумя. The noun is instrumental plural: двумя столами, двумя руками.",
    prep: "Both genders share двух. The noun is prepositional plural: о двух столах.",
  },
  "3": {
    nom: "три does not change for gender. The following noun is genitive singular: три стола, три книги, три окна.",
    gen: "трёх + genitive plural: нет трёх столов.",
    dat: "трём + dative plural: к трём друзьям.",
    acc: "Things: три + genitive singular. People and animals: трёх + genitive plural (вижу трёх студентов).",
    ins: "тремя + instrumental plural: с тремя друзьями.",
    prep: "трёх + prepositional plural: о трёх днях.",
  },
  "4": {
    nom: "четыре follows the same pattern as три. The noun is genitive singular: четыре стола, четыре книги.",
    gen: "четырёх + genitive plural.",
    dat: "четырём + dative plural.",
    acc: "Things keep четыре; people and animals take четырёх.",
    ins: "четырьмя + instrumental plural. Note the soft sign: четырьмя.",
    prep: "четырёх + prepositional plural.",
  },
  "5": {
    nom: "пять, шесть, семь… twenty and thirty decline like feminine nouns in ь. The following noun is genitive plural: пять книг, десять столов.",
    gen: "пяти, шести, семи… The noun stays genitive plural: нет пяти книг.",
    dat: "пяти, шести, семи… + dative plural of the noun: к пяти домам.",
    acc: "Accusative of 5–20 and 30 is the same as nominative, even with people: вижу пять студентов. The noun is still genitive plural.",
    ins: "пятью, шестью, семью… + instrumental plural: с пятью друзьями.",
    prep: "пяти, шести, семи… + prepositional plural: о пяти книгах.",
  },
  "40": {
    nom: "сорок, девяносто and сто have one nominative form. The noun is genitive plural: сорок студентов, сто книг.",
    gen: "The oblique form is сорока / девяноста / ста: нет ста книг, из сорока студентов.",
    dat: "Same oblique form: к ста домам, к сорока друзьям.",
    acc: "Accusative equals nominative: вижу сорок студентов, плачу сто рублей.",
    ins: "Oblique form: с сорока студентами, со ста книгами (со is used before ста).",
    prep: "Oblique form: о ста книгах, в сорока комнатах.",
  },
  "1000": {
    nom: "тысяча declines like a feminine noun in -а. The counted noun is genitive plural: тысяча рублей.",
    gen: "тысячи: нет тысячи рублей.",
    dat: "тысяче: к тысяче рублей.",
    acc: "тысячу: вижу тысячу рублей, получаю тысячу писем.",
    ins: "тысячей (or the older тысячью): с тысячей рублей.",
    prep: "тысяче: о тысяче человек.",
  },
};

const GOVERNMENT: Record<CardinalId, string> = {
  "1": "1 takes a noun in the same case and gender: один стол, одну книгу.",
  "2": "2, 3 and 4 take genitive singular in nominative and inanimate accusative: два стола, три книги. In other cases the noun matches the case in the plural.",
  "3": "2, 3 and 4 take genitive singular in nominative and inanimate accusative: три стола. Other cases: plural of that case.",
  "4": "2, 3 and 4 take genitive singular in nominative and inanimate accusative: четыре стола. Other cases: plural of that case.",
  "5": "5 and above take genitive plural of the noun in nominative and accusative: пять книг. Other cases: the noun is plural of that case.",
  "40": "40, 90 and 100 take genitive plural of the noun in nominative and accusative: сто книг.",
  "1000": "тысяча takes genitive plural of the counted noun: тысяча рублей.",
};

export function getCardinalResult(input: {
  cardinal: CardinalId;
  caseId: CaseId;
  gender: GenderId;
  animacy: AnimacyId;
}): TrainerResult {
  const { cardinal, caseId, gender, animacy } = input;
  let rows: FormRow[] = [];
  if (cardinal === "1") rows = oneForms(caseId, gender, animacy);
  else if (cardinal === "2") rows = twoForms(caseId, gender, animacy);
  else if (cardinal === "3" || cardinal === "4") rows = threeFourForms(cardinal, caseId, animacy);
  else if (cardinal === "5") rows = fiveForms(caseId);
  else if (cardinal === "40") rows = fortyForms(caseId);
  else rows = thousandForms(caseId);

  const examples: TrainerExample[] = rows.slice(0, 6).map((r) => ({
    form: splitForm(r.full, r.ending),
    extraRu: r.phrase,
    en: r.phraseEn,
  }));

  const title =
    CARDINAL_CHOICES.find((c) => c.id === cardinal)?.title ?? cardinal;

  return {
    heading: `${title} · ${CASE_LABEL[caseId]}`,
    endingLabel: rows[0]?.full ?? "",
    endingSpoken: `the form ${rows[0]?.full ?? ""}`,
    endingDisplay: rows[0]?.full ?? "",
    rule: CARDINAL_RULES[cardinal][caseId],
    notes: [
      GOVERNMENT[cardinal],
      cardinal === "1" ? `Gender here: ${GENDER_LABEL[gender]}.` : "",
      caseId === "acc" && (cardinal === "1" || cardinal === "2" || cardinal === "3" || cardinal === "4")
        ? `Animacy here: ${animacy}. Things copy nominative; people and animals copy genitive (except feminine одну, which is always -у).`
        : "",
    ].filter(Boolean),
    examples,
  };
}

type OrdinalKey = `${CaseId}_${NumberId}_${GenderId | "pl"}`;

const ORDINAL_ENDINGS: Record<string, { label: string; rule: string }> = {
  nom_sg_m: { label: "-ый / -ой", rule: "Masculine nominative: первый, второй, пятый. третий is a special soft type." },
  nom_sg_f: { label: "-ая", rule: "Feminine nominative: первая, вторая, пятая." },
  nom_sg_n: { label: "-ое", rule: "Neuter nominative: первое, второе, пятое." },
  nom_pl_pl: { label: "-ые", rule: "Plural nominative: первые, вторые, пятые." },
  gen_sg_m: { label: "-ого", rule: "Masculine/neuter genitive: первого, второго, пятого." },
  gen_sg_f: { label: "-ой", rule: "Feminine genitive: первой, второй, пятой." },
  gen_sg_n: { label: "-ого", rule: "Neuter genitive: первого, второго." },
  gen_pl_pl: { label: "-ых", rule: "Plural genitive: первых, вторых, пятых." },
  dat_sg_m: { label: "-ому", rule: "Masculine/neuter dative: первому, второму." },
  dat_sg_f: { label: "-ой", rule: "Feminine dative: первой, второй." },
  dat_sg_n: { label: "-ому", rule: "Neuter dative: первому." },
  dat_pl_pl: { label: "-ым", rule: "Plural dative: первым, вторым." },
  acc_sg_m: { label: "-ый or -ого", rule: "Masculine accusative copies nominative for things (первый день) and genitive for people (первого студента)." },
  acc_sg_f: { label: "-ую", rule: "Feminine accusative: первую, вторую, пятую." },
  acc_sg_n: { label: "-ое", rule: "Neuter accusative equals nominative: первое окно." },
  acc_pl_pl: { label: "-ые or -ых", rule: "Plural accusative: things take -ые (первые дни); people take -ых (первых студентов)." },
  ins_sg_m: { label: "-ым", rule: "Masculine/neuter instrumental: первым, вторым, пятым." },
  ins_sg_f: { label: "-ой", rule: "Feminine instrumental: первой, второй." },
  ins_sg_n: { label: "-ым", rule: "Neuter instrumental: первым." },
  ins_pl_pl: { label: "-ыми", rule: "Plural instrumental: первыми, вторыми." },
  prep_sg_m: { label: "-ом", rule: "Masculine/neuter prepositional: о первом, во втором, в пятом." },
  prep_sg_f: { label: "-ой", rule: "Feminine prepositional: о первой, во второй." },
  prep_sg_n: { label: "-ом", rule: "Neuter prepositional: о первом." },
  prep_pl_pl: { label: "-ых", rule: "Plural prepositional: о первых, во вторых." },
};

const ORDINAL_EXAMPLES: Record<string, TrainerExample[]> = {
  nom_sg_m: [
    { form: splitForm("первый", "ый"), extraRu: "день", en: "the first day" },
    { form: splitForm("второй", "ой"), extraRu: "урок", en: "the second lesson" },
    { form: splitForm("третий", "ий"), extraRu: "этаж", en: "the third floor (special stem)" },
    { form: splitForm("пятый", "ый"), extraRu: "час", en: "the fifth hour / five o’clock" },
    { form: splitForm("десятый", "ый"), extraRu: "номер", en: "the tenth number" },
  ],
  nom_sg_f: [
    { form: splitForm("первая", "ая"), extraRu: "книга", en: "the first book" },
    { form: splitForm("вторая", "ая"), extraRu: "глава", en: "the second chapter" },
    { form: splitForm("третья", "ья"), extraRu: "улица", en: "the third street" },
    { form: splitForm("пятая", "ая"), extraRu: "страница", en: "the fifth page" },
    { form: splitForm("десятая", "ая"), extraRu: "минута", en: "the tenth minute" },
  ],
  nom_sg_n: [
    { form: splitForm("первое", "ое"), extraRu: "окно", en: "the first window" },
    { form: splitForm("второе", "ое"), extraRu: "место", en: "the second place" },
    { form: splitForm("третье", "ье"), extraRu: "письмо", en: "the third letter" },
    { form: splitForm("пятое", "ое"), extraRu: "упражнение", en: "the fifth exercise" },
    { form: splitForm("десятое", "ое"), extraRu: "правило", en: "the tenth rule" },
  ],
  nom_pl_pl: [
    { form: splitForm("первые", "ые"), extraRu: "дни", en: "the first days" },
    { form: splitForm("вторые", "ые"), extraRu: "уроки", en: "the second lessons" },
    { form: splitForm("третьи", "ьи"), extraRu: "этажи", en: "the third floors" },
    { form: splitForm("пятые", "ые"), extraRu: "страницы", en: "the fifth pages" },
    { form: splitForm("десятые", "ые"), extraRu: "номера", en: "the tenth numbers" },
  ],
  gen_sg_m: [
    { form: splitForm("первого", "ого"), extraRu: "дня", en: "of the first day" },
    { form: splitForm("второго", "ого"), extraRu: "урока", en: "of the second lesson" },
    { form: splitForm("третьего", "его"), extraRu: "этажа", en: "of the third floor" },
    { form: splitForm("пятого", "ого"), extraRu: "часа", en: "of the fifth hour" },
    { form: splitForm("десятого", "ого"), extraRu: "номера", en: "of the tenth number" },
  ],
  gen_sg_f: [
    { form: splitForm("первой", "ой"), extraRu: "книги", en: "of the first book" },
    { form: splitForm("второй", "ой"), extraRu: "главы", en: "of the second chapter" },
    { form: splitForm("третьей", "ей"), extraRu: "улицы", en: "of the third street" },
    { form: splitForm("пятой", "ой"), extraRu: "страницы", en: "of the fifth page" },
    { form: splitForm("десятой", "ой"), extraRu: "минуты", en: "of the tenth minute" },
  ],
  gen_sg_n: [
    { form: splitForm("первого", "ого"), extraRu: "окна", en: "of the first window" },
    { form: splitForm("второго", "ого"), extraRu: "места", en: "of the second place" },
    { form: splitForm("третьего", "его"), extraRu: "письма", en: "of the third letter" },
    { form: splitForm("пятого", "ого"), extraRu: "упражнения", en: "of the fifth exercise" },
    { form: splitForm("десятого", "ого"), extraRu: "правила", en: "of the tenth rule" },
  ],
  gen_pl_pl: [
    { form: splitForm("первых", "ых"), extraRu: "дней", en: "of the first days" },
    { form: splitForm("вторых", "ых"), extraRu: "уроков", en: "of the second lessons" },
    { form: splitForm("третьих", "их"), extraRu: "этажей", en: "of the third floors" },
    { form: splitForm("пятых", "ых"), extraRu: "страниц", en: "of the fifth pages" },
    { form: splitForm("десятых", "ых"), extraRu: "номеров", en: "of the tenth numbers" },
  ],
  dat_sg_m: [
    { form: splitForm("первому", "ому"), extraRu: "дню", en: "to the first day" },
    { form: splitForm("второму", "ому"), extraRu: "уроку", en: "to the second lesson" },
    { form: splitForm("третьему", "ему"), extraRu: "этажу", en: "to the third floor" },
    { form: splitForm("пятому", "ому"), extraRu: "часу", en: "to the fifth hour" },
    { form: splitForm("десятому", "ому"), extraRu: "номеру", en: "to the tenth number" },
  ],
  dat_sg_f: [
    { form: splitForm("первой", "ой"), extraRu: "книге", en: "to the first book" },
    { form: splitForm("второй", "ой"), extraRu: "главе", en: "to the second chapter" },
    { form: splitForm("третьей", "ей"), extraRu: "улице", en: "to the third street" },
    { form: splitForm("пятой", "ой"), extraRu: "странице", en: "to the fifth page" },
    { form: splitForm("десятой", "ой"), extraRu: "минуте", en: "to the tenth minute" },
  ],
  dat_sg_n: [
    { form: splitForm("первому", "ому"), extraRu: "окну", en: "to the first window" },
    { form: splitForm("второму", "ому"), extraRu: "месту", en: "to the second place" },
    { form: splitForm("третьему", "ему"), extraRu: "письму", en: "to the third letter" },
    { form: splitForm("пятому", "ому"), extraRu: "упражнению", en: "to the fifth exercise" },
    { form: splitForm("десятому", "ому"), extraRu: "правилу", en: "to the tenth rule" },
  ],
  dat_pl_pl: [
    { form: splitForm("первым", "ым"), extraRu: "дням", en: "to the first days" },
    { form: splitForm("вторым", "ым"), extraRu: "урокам", en: "to the second lessons" },
    { form: splitForm("третьим", "им"), extraRu: "этажам", en: "to the third floors" },
    { form: splitForm("пятым", "ым"), extraRu: "страницам", en: "to the fifth pages" },
    { form: splitForm("десятым", "ым"), extraRu: "номерам", en: "to the tenth numbers" },
  ],
  acc_sg_m: [
    { form: splitForm("первый", "ый"), extraRu: "день", en: "I see the first day (thing)" },
    { form: splitForm("второй", "ой"), extraRu: "урок", en: "I see the second lesson (thing)" },
    { form: splitForm("первого", "ого"), extraRu: "студента", en: "I see the first student (person)" },
    { form: splitForm("пятый", "ый"), extraRu: "час", en: "I see five o’clock / the fifth hour" },
    { form: splitForm("третьего", "его"), extraRu: "друга", en: "I see the third friend (person)" },
  ],
  acc_sg_f: [
    { form: splitForm("первую", "ую"), extraRu: "книгу", en: "the first book (object)" },
    { form: splitForm("вторую", "ую"), extraRu: "главу", en: "the second chapter" },
    { form: splitForm("третью", "ью"), extraRu: "улицу", en: "the third street" },
    { form: splitForm("пятую", "ую"), extraRu: "страницу", en: "the fifth page" },
    { form: splitForm("десятую", "ую"), extraRu: "минуту", en: "the tenth minute" },
  ],
  acc_sg_n: [
    { form: splitForm("первое", "ое"), extraRu: "окно", en: "the first window" },
    { form: splitForm("второе", "ое"), extraRu: "место", en: "the second place" },
    { form: splitForm("третье", "ье"), extraRu: "письмо", en: "the third letter" },
    { form: splitForm("пятое", "ое"), extraRu: "упражнение", en: "the fifth exercise" },
    { form: splitForm("десятое", "ое"), extraRu: "правило", en: "the tenth rule" },
  ],
  acc_pl_pl: [
    { form: splitForm("первые", "ые"), extraRu: "дни", en: "the first days (things)" },
    { form: splitForm("первых", "ых"), extraRu: "студентов", en: "the first students (people)" },
    { form: splitForm("вторые", "ые"), extraRu: "уроки", en: "the second lessons (things)" },
    { form: splitForm("пятые", "ые"), extraRu: "страницы", en: "the fifth pages (things)" },
    { form: splitForm("третьих", "их"), extraRu: "друзей", en: "the third friends (people)" },
  ],
  ins_sg_m: [
    { form: splitForm("первым", "ым"), extraRu: "днём", en: "with the first day" },
    { form: splitForm("вторым", "ым"), extraRu: "уроком", en: "with the second lesson" },
    { form: splitForm("третьим", "им"), extraRu: "этажом", en: "with the third floor" },
    { form: splitForm("пятым", "ым"), extraRu: "часом", en: "with the fifth hour" },
    { form: splitForm("десятым", "ым"), extraRu: "номером", en: "with the tenth number" },
  ],
  ins_sg_f: [
    { form: splitForm("первой", "ой"), extraRu: "книгой", en: "with the first book" },
    { form: splitForm("второй", "ой"), extraRu: "главой", en: "with the second chapter" },
    { form: splitForm("третьей", "ей"), extraRu: "улицей", en: "with the third street" },
    { form: splitForm("пятой", "ой"), extraRu: "страницей", en: "with the fifth page" },
    { form: splitForm("десятой", "ой"), extraRu: "минутой", en: "with the tenth minute" },
  ],
  ins_sg_n: [
    { form: splitForm("первым", "ым"), extraRu: "окном", en: "with the first window" },
    { form: splitForm("вторым", "ым"), extraRu: "местом", en: "with the second place" },
    { form: splitForm("третьим", "им"), extraRu: "письмом", en: "with the third letter" },
    { form: splitForm("пятым", "ым"), extraRu: "упражнением", en: "with the fifth exercise" },
    { form: splitForm("десятым", "ым"), extraRu: "правилом", en: "with the tenth rule" },
  ],
  ins_pl_pl: [
    { form: splitForm("первыми", "ыми"), extraRu: "днями", en: "with the first days" },
    { form: splitForm("вторыми", "ыми"), extraRu: "уроками", en: "with the second lessons" },
    { form: splitForm("третьими", "ими"), extraRu: "этажами", en: "with the third floors" },
    { form: splitForm("пятыми", "ыми"), extraRu: "страницами", en: "with the fifth pages" },
    { form: splitForm("десятыми", "ыми"), extraRu: "номерами", en: "with the tenth numbers" },
  ],
  prep_sg_m: [
    { form: splitForm("первом", "ом"), extraRu: "дне", en: "about the first day" },
    { form: splitForm("втором", "ом"), extraRu: "уроке", en: "in the second lesson" },
    { form: splitForm("третьем", "ем"), extraRu: "этаже", en: "on the third floor" },
    { form: splitForm("пятом", "ом"), extraRu: "часе", en: "at the fifth hour" },
    { form: splitForm("десятом", "ом"), extraRu: "номере", en: "in the tenth number" },
  ],
  prep_sg_f: [
    { form: splitForm("первой", "ой"), extraRu: "книге", en: "about the first book" },
    { form: splitForm("второй", "ой"), extraRu: "главе", en: "in the second chapter" },
    { form: splitForm("третьей", "ей"), extraRu: "улице", en: "on the third street" },
    { form: splitForm("пятой", "ой"), extraRu: "странице", en: "on the fifth page" },
    { form: splitForm("десятой", "ой"), extraRu: "минуте", en: "in the tenth minute" },
  ],
  prep_sg_n: [
    { form: splitForm("первом", "ом"), extraRu: "окне", en: "about the first window" },
    { form: splitForm("втором", "ом"), extraRu: "месте", en: "in the second place" },
    { form: splitForm("третьем", "ем"), extraRu: "письме", en: "in the third letter" },
    { form: splitForm("пятом", "ом"), extraRu: "упражнении", en: "in the fifth exercise" },
    { form: splitForm("десятом", "ом"), extraRu: "правиле", en: "in the tenth rule" },
  ],
  prep_pl_pl: [
    { form: splitForm("первых", "ых"), extraRu: "днях", en: "about the first days" },
    { form: splitForm("вторых", "ых"), extraRu: "уроках", en: "in the second lessons" },
    { form: splitForm("третьих", "их"), extraRu: "этажах", en: "on the third floors" },
    { form: splitForm("пятых", "ых"), extraRu: "страницах", en: "on the fifth pages" },
    { form: splitForm("десятых", "ых"), extraRu: "номерах", en: "in the tenth numbers" },
  ],
};

export function getOrdinalResult(input: {
  caseId: CaseId;
  number: NumberId;
  gender: GenderId;
}): TrainerResult {
  const { caseId, number, gender } = input;
  const gKey = number === "pl" ? "pl" : gender;
  const key = `${caseId}_${number}_${gKey}`;
  const cell = ORDINAL_ENDINGS[key];
  const examples = ORDINAL_EXAMPLES[key] ?? [];
  return {
    heading: `Ordinal · ${CASE_LABEL[caseId]} · ${number === "pl" ? "plural" : GENDER_LABEL[gender] + " singular"}`,
    endingLabel: cell.label,
    endingSpoken: `the ending ${cell.label}`,
    endingDisplay: cell.label,
    rule: cell.rule,
    notes: [
      "третий is slightly softer: третья, третье, третьего, третью.",
      "Use ordinals for dates, floors, chapters and clock hours: первое мая, третий этаж, пятый час.",
    ],
    examples: examples.slice(0, 6),
  };
}

export function needsCardinalGender(id: CardinalId): boolean {
  return id === "1" || id === "2";
}

export function needsCardinalAnimacy(id: CardinalId, caseId: CaseId): boolean {
  if (caseId !== "acc") return false;
  return id === "1" || id === "2" || id === "3" || id === "4";
}

export type { NumeralKind };
