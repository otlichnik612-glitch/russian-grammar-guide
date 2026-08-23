import { CASE_LABEL, GENDER_LABEL, NUMBER_LABEL } from "./labels";
import type { CaseId, GenderId, NumberId, StemType, TrainerExample, TrainerResult } from "./types";
import { splitForm } from "./types";

type AdjPair = {
  adj: string;
  noun: string;
  en: string;
  gender: GenderId;
  animate: boolean;
  stem: StemType;
};

type Cell = { ending: string; label: string; rule: string };

const HARD: Record<string, Cell> = {
  nom_sg_m: { ending: "ый / ой", label: "-ый or -ой", rule: "Hard-stem adjectives take -ый in the masculine nominative (новый). If the ending is stressed, you will see -ой (большой, молодой)." },
  nom_sg_f: { ending: "ая", label: "-ая", rule: "Hard-stem adjectives take -ая in the feminine nominative: новая, красная, большая." },
  nom_sg_n: { ending: "ое", label: "-ое", rule: "Hard-stem adjectives take -ое in the neuter nominative: новое, красное, большое." },
  nom_pl: { ending: "ые", label: "-ые", rule: "Hard-stem adjectives take -ые in the nominative plural for every gender: новые книги, большие дома." },
  gen_sg_m: { ending: "ого", label: "-ого", rule: "Masculine genitive singular is -ого: нового дома, большого парка. The г is pronounced like a v." },
  gen_sg_f: { ending: "ой", label: "-ой", rule: "Feminine genitive singular is -ой: новой книги, большой школы." },
  gen_sg_n: { ending: "ого", label: "-ого", rule: "Neuter genitive singular is -ого, the same as masculine: нового окна." },
  gen_pl: { ending: "ых", label: "-ых", rule: "Genitive plural is -ых for every gender: новых книг, больших домов." },
  dat_sg_m: { ending: "ому", label: "-ому", rule: "Masculine dative singular is -ому: новому студенту, большому столу." },
  dat_sg_f: { ending: "ой", label: "-ой", rule: "Feminine dative singular is -ой — the same spelling as genitive, instrumental and prepositional feminine: новой маме." },
  dat_sg_n: { ending: "ому", label: "-ому", rule: "Neuter dative singular is -ому: новому окну." },
  dat_pl: { ending: "ым", label: "-ым", rule: "Dative plural is -ым: новым друзьям, большим домам." },
  acc_sg_m: { ending: "ый or ого", label: "-ый (things) / -ого (people & animals)", rule: "Masculine accusative copies nominative for things (новый стол) and copies genitive for people and animals (нового студента). Look at the noun’s animacy." },
  acc_sg_f: { ending: "ую", label: "-ую", rule: "Feminine accusative singular is always -ую, for people and things: новую книгу, новую маму." },
  acc_sg_n: { ending: "ое", label: "-ое (same as nominative)", rule: "Neuter accusative singular equals nominative: новое окно." },
  acc_pl: { ending: "ые or ых", label: "-ые (things) / -ых (people & animals)", rule: "Plural accusative copies nominative for things (новые столы) and copies genitive for people and animals (новых студентов)." },
  ins_sg_m: { ending: "ым", label: "-ым", rule: "Masculine instrumental singular is -ым: новым столом, большим парком." },
  ins_sg_f: { ending: "ой", label: "-ой", rule: "Feminine instrumental singular is -ой: новой книгой, большой лампой." },
  ins_sg_n: { ending: "ым", label: "-ым", rule: "Neuter instrumental singular is -ым: новым окном." },
  ins_pl: { ending: "ыми", label: "-ыми", rule: "Instrumental plural is -ыми: новыми книгами, большими домами." },
  prep_sg_m: { ending: "ом", label: "-ом", rule: "Masculine prepositional singular is -ом: о новом доме, в большом парке." },
  prep_sg_f: { ending: "ой", label: "-ой", rule: "Feminine prepositional singular is -ой: о новой книге, в большой школе." },
  prep_sg_n: { ending: "ом", label: "-ом", rule: "Neuter prepositional singular is -ом: о новом окне." },
  prep_pl: { ending: "ых", label: "-ых", rule: "Prepositional plural is -ых, the same as genitive plural: о новых книгах." },
};

const SOFT: Record<string, Cell> = {
  nom_sg_m: { ending: "ий", label: "-ий", rule: "Soft-stem adjectives take -ий in the masculine nominative: синий, летний, хороший." },
  nom_sg_f: { ending: "яя", label: "-яя", rule: "Soft-stem adjectives take -яя in the feminine nominative: синяя, летняя. After ш (хороший) spelling forces -ая: хорошая." },
  nom_sg_n: { ending: "ее", label: "-ее", rule: "Soft-stem adjectives take -ее in the neuter nominative: синее, летнее, хорошее." },
  nom_pl: { ending: "ие", label: "-ие", rule: "Nominative plural is -ие: синие тетради, летние дни, хорошие люди." },
  gen_sg_m: { ending: "его", label: "-его", rule: "Masculine genitive singular is -его: синего шарфа, хорошего друга. The г sounds like v." },
  gen_sg_f: { ending: "ей", label: "-ей", rule: "Feminine genitive singular is -ей: синей тетради, хорошей книги." },
  gen_sg_n: { ending: "его", label: "-его", rule: "Neuter genitive singular is -его: синего моря, летнего утра." },
  gen_pl: { ending: "их", label: "-их", rule: "Genitive plural is -их: синих тетрадей, хороших людей." },
  dat_sg_m: { ending: "ему", label: "-ему", rule: "Masculine dative singular is -ему: синему шарфу, хорошему другу." },
  dat_sg_f: { ending: "ей", label: "-ей", rule: "Feminine dative singular is -ей: синей тетради, летней ночи." },
  dat_sg_n: { ending: "ему", label: "-ему", rule: "Neuter dative singular is -ему: синему морю." },
  dat_pl: { ending: "им", label: "-им", rule: "Dative plural is -им: синим тетрадям, хорошим людям." },
  acc_sg_m: { ending: "ий or его", label: "-ий (things) / -его (people & animals)", rule: "Masculine accusative copies nominative for things (синий шарф) and copies genitive for people and animals (синего мальчика, хорошего друга)." },
  acc_sg_f: { ending: "юю", label: "-юю", rule: "Feminine accusative singular is -юю: синюю тетрадь, летнюю ночь. After ш you will see -ую: хорошую книгу." },
  acc_sg_n: { ending: "ее", label: "-ее (same as nominative)", rule: "Neuter accusative singular equals nominative: синее море." },
  acc_pl: { ending: "ие or их", label: "-ие (things) / -их (people & animals)", rule: "Plural accusative copies nominative for things (синие тетради) and copies genitive for people and animals (хороших друзей)." },
  ins_sg_m: { ending: "им", label: "-им", rule: "Masculine instrumental singular is -им: синим шарфом, хорошим другом." },
  ins_sg_f: { ending: "ей", label: "-ей", rule: "Feminine instrumental singular is -ей: синей ручкой, хорошей книгой." },
  ins_sg_n: { ending: "им", label: "-им", rule: "Neuter instrumental singular is -им: синим морем." },
  ins_pl: { ending: "ими", label: "-ими", rule: "Instrumental plural is -ими: синими тетрадями, хорошими друзьями." },
  prep_sg_m: { ending: "ем", label: "-ем", rule: "Masculine prepositional singular is -ем: о синем шарфе, о хорошем друге." },
  prep_sg_f: { ending: "ей", label: "-ей", rule: "Feminine prepositional singular is -ей: о синей тетради, в летней школе." },
  prep_sg_n: { ending: "ем", label: "-ем", rule: "Neuter prepositional singular is -ем: о синем море." },
  prep_pl: { ending: "их", label: "-их", rule: "Prepositional plural is -их: о синих тетрадях, о хороших людях." },
};

const PAIRS: AdjPair[] = [
  { adj: "новый", noun: "стол", en: "new table", gender: "m", animate: false, stem: "hard" },
  { adj: "новый", noun: "студент", en: "new student", gender: "m", animate: true, stem: "hard" },
  { adj: "новая", noun: "книга", en: "new book", gender: "f", animate: false, stem: "hard" },
  { adj: "новая", noun: "мама", en: "new mum", gender: "f", animate: true, stem: "hard" },
  { adj: "новое", noun: "окно", en: "new window", gender: "n", animate: false, stem: "hard" },
  { adj: "красный", noun: "дом", en: "red house", gender: "m", animate: false, stem: "hard" },
  { adj: "красная", noun: "машина", en: "red car", gender: "f", animate: false, stem: "hard" },
  { adj: "красное", noun: "яблоко", en: "red apple", gender: "n", animate: false, stem: "hard" },
  { adj: "большой", noun: "парк", en: "big park", gender: "m", animate: false, stem: "hard" },
  { adj: "большая", noun: "школа", en: "big school", gender: "f", animate: false, stem: "hard" },
  { adj: "большое", noun: "море", en: "big sea", gender: "n", animate: false, stem: "hard" },
  { adj: "старый", noun: "друг", en: "old friend", gender: "m", animate: true, stem: "hard" },
  { adj: "синий", noun: "шарф", en: "blue scarf", gender: "m", animate: false, stem: "soft" },
  { adj: "синий", noun: "мальчик", en: "blue boy", gender: "m", animate: true, stem: "soft" },
  { adj: "синяя", noun: "тетрадь", en: "blue notebook", gender: "f", animate: false, stem: "soft" },
  { adj: "синее", noun: "море", en: "blue sea", gender: "n", animate: false, stem: "soft" },
  { adj: "летний", noun: "день", en: "summer day", gender: "m", animate: false, stem: "soft" },
  { adj: "летняя", noun: "ночь", en: "summer night", gender: "f", animate: false, stem: "soft" },
  { adj: "летнее", noun: "утро", en: "summer morning", gender: "n", animate: false, stem: "soft" },
  { adj: "хороший", noun: "друг", en: "good friend", gender: "m", animate: true, stem: "soft" },
  { adj: "хорошая", noun: "книга", en: "good book", gender: "f", animate: false, stem: "soft" },
  { adj: "хорошее", noun: "решение", en: "good decision", gender: "n", animate: false, stem: "soft" },
];

/** Full declined adjective + noun pairs for the result screen. */
const FORMS: Record<string, { adj: string; adjE: string; noun: string }> = {
  "новый|стол|nom|sg": { adj: "новый", adjE: "ый", noun: "стол" },
  "новый|стол|gen|sg": { adj: "нового", adjE: "ого", noun: "стола" },
  "новый|стол|dat|sg": { adj: "новому", adjE: "ому", noun: "столу" },
  "новый|стол|acc|sg": { adj: "новый", adjE: "ый", noun: "стол" },
  "новый|стол|ins|sg": { adj: "новым", adjE: "ым", noun: "столом" },
  "новый|стол|prep|sg": { adj: "новом", adjE: "ом", noun: "столе" },
  "новый|студент|nom|sg": { adj: "новый", adjE: "ый", noun: "студент" },
  "новый|студент|gen|sg": { adj: "нового", adjE: "ого", noun: "студента" },
  "новый|студент|dat|sg": { adj: "новому", adjE: "ому", noun: "студенту" },
  "новый|студент|acc|sg": { adj: "нового", adjE: "ого", noun: "студента" },
  "новый|студент|ins|sg": { adj: "новым", adjE: "ым", noun: "студентом" },
  "новый|студент|prep|sg": { adj: "новом", adjE: "ом", noun: "студенте" },
  "новая|книга|nom|sg": { adj: "новая", adjE: "ая", noun: "книга" },
  "новая|книга|gen|sg": { adj: "новой", adjE: "ой", noun: "книги" },
  "новая|книга|dat|sg": { adj: "новой", adjE: "ой", noun: "книге" },
  "новая|книга|acc|sg": { adj: "новую", adjE: "ую", noun: "книгу" },
  "новая|книга|ins|sg": { adj: "новой", adjE: "ой", noun: "книгой" },
  "новая|книга|prep|sg": { adj: "новой", adjE: "ой", noun: "книге" },
  "новое|окно|nom|sg": { adj: "новое", adjE: "ое", noun: "окно" },
  "новое|окно|gen|sg": { adj: "нового", adjE: "ого", noun: "окна" },
  "новое|окно|dat|sg": { adj: "новому", adjE: "ому", noun: "окну" },
  "новое|окно|acc|sg": { adj: "новое", adjE: "ое", noun: "окно" },
  "новое|окно|ins|sg": { adj: "новым", adjE: "ым", noun: "окном" },
  "новое|окно|prep|sg": { adj: "новом", adjE: "ом", noun: "окне" },
  "красный|дом|nom|sg": { adj: "красный", adjE: "ый", noun: "дом" },
  "красный|дом|gen|sg": { adj: "красного", adjE: "ого", noun: "дома" },
  "красный|дом|dat|sg": { adj: "красному", adjE: "ому", noun: "дому" },
  "красный|дом|acc|sg": { adj: "красный", adjE: "ый", noun: "дом" },
  "красный|дом|ins|sg": { adj: "красным", adjE: "ым", noun: "домом" },
  "красный|дом|prep|sg": { adj: "красном", adjE: "ом", noun: "доме" },
  "красная|машина|nom|sg": { adj: "красная", adjE: "ая", noun: "машина" },
  "красная|машина|gen|sg": { adj: "красной", adjE: "ой", noun: "машины" },
  "красная|машина|dat|sg": { adj: "красной", adjE: "ой", noun: "машине" },
  "красная|машина|acc|sg": { adj: "красную", adjE: "ую", noun: "машину" },
  "красная|машина|ins|sg": { adj: "красной", adjE: "ой", noun: "машиной" },
  "красная|машина|prep|sg": { adj: "красной", adjE: "ой", noun: "машине" },
  "красное|яблоко|nom|sg": { adj: "красное", adjE: "ое", noun: "яблоко" },
  "красное|яблоко|gen|sg": { adj: "красного", adjE: "ого", noun: "яблока" },
  "красное|яблоко|dat|sg": { adj: "красному", adjE: "ому", noun: "яблоку" },
  "красное|яблоко|acc|sg": { adj: "красное", adjE: "ое", noun: "яблоко" },
  "красное|яблоко|ins|sg": { adj: "красным", adjE: "ым", noun: "яблоком" },
  "красное|яблоко|prep|sg": { adj: "красном", adjE: "ом", noun: "яблоке" },
  "большой|парк|nom|sg": { adj: "большой", adjE: "ой", noun: "парк" },
  "большой|парк|gen|sg": { adj: "большого", adjE: "ого", noun: "парка" },
  "большой|парк|dat|sg": { adj: "большому", adjE: "ому", noun: "парку" },
  "большой|парк|acc|sg": { adj: "большой", adjE: "ой", noun: "парк" },
  "большой|парк|ins|sg": { adj: "большим", adjE: "им", noun: "парком" },
  "большой|парк|prep|sg": { adj: "большом", adjE: "ом", noun: "парке" },
  "большая|школа|nom|sg": { adj: "большая", adjE: "ая", noun: "школа" },
  "большая|школа|gen|sg": { adj: "большой", adjE: "ой", noun: "школы" },
  "большая|школа|dat|sg": { adj: "большой", adjE: "ой", noun: "школе" },
  "большая|школа|acc|sg": { adj: "большую", adjE: "ую", noun: "школу" },
  "большая|школа|ins|sg": { adj: "большой", adjE: "ой", noun: "школой" },
  "большая|школа|prep|sg": { adj: "большой", adjE: "ой", noun: "школе" },
  "большое|море|nom|sg": { adj: "большое", adjE: "ое", noun: "море" },
  "большое|море|gen|sg": { adj: "большого", adjE: "ого", noun: "моря" },
  "большое|море|dat|sg": { adj: "большому", adjE: "ому", noun: "морю" },
  "большое|море|acc|sg": { adj: "большое", adjE: "ое", noun: "море" },
  "большое|море|ins|sg": { adj: "большим", adjE: "им", noun: "морем" },
  "большое|море|prep|sg": { adj: "большом", adjE: "ом", noun: "море" },
  "старый|друг|nom|sg": { adj: "старый", adjE: "ый", noun: "друг" },
  "старый|друг|gen|sg": { adj: "старого", adjE: "ого", noun: "друга" },
  "старый|друг|dat|sg": { adj: "старому", adjE: "ому", noun: "другу" },
  "старый|друг|acc|sg": { adj: "старого", adjE: "ого", noun: "друга" },
  "старый|друг|ins|sg": { adj: "старым", adjE: "ым", noun: "другом" },
  "старый|друг|prep|sg": { adj: "старом", adjE: "ом", noun: "друге" },
  "синий|шарф|nom|sg": { adj: "синий", adjE: "ий", noun: "шарф" },
  "синий|шарф|gen|sg": { adj: "синего", adjE: "его", noun: "шарфа" },
  "синий|шарф|dat|sg": { adj: "синему", adjE: "ему", noun: "шарфу" },
  "синий|шарф|acc|sg": { adj: "синий", adjE: "ий", noun: "шарф" },
  "синий|шарф|ins|sg": { adj: "синим", adjE: "им", noun: "шарфом" },
  "синий|шарф|prep|sg": { adj: "синем", adjE: "ем", noun: "шарфе" },
  "синяя|тетрадь|nom|sg": { adj: "синяя", adjE: "яя", noun: "тетрадь" },
  "синяя|тетрадь|gen|sg": { adj: "синей", adjE: "ей", noun: "тетради" },
  "синяя|тетрадь|dat|sg": { adj: "синей", adjE: "ей", noun: "тетради" },
  "синяя|тетрадь|acc|sg": { adj: "синюю", adjE: "юю", noun: "тетрадь" },
  "синяя|тетрадь|ins|sg": { adj: "синей", adjE: "ей", noun: "тетрадью" },
  "синяя|тетрадь|prep|sg": { adj: "синей", adjE: "ей", noun: "тетради" },
  "синее|море|nom|sg": { adj: "синее", adjE: "ее", noun: "море" },
  "синее|море|gen|sg": { adj: "синего", adjE: "его", noun: "моря" },
  "синее|море|dat|sg": { adj: "синему", adjE: "ему", noun: "морю" },
  "синее|море|acc|sg": { adj: "синее", adjE: "ее", noun: "море" },
  "синее|море|ins|sg": { adj: "синим", adjE: "им", noun: "морем" },
  "синее|море|prep|sg": { adj: "синем", adjE: "ем", noun: "море" },
  "летний|день|nom|sg": { adj: "летний", adjE: "ий", noun: "день" },
  "летний|день|gen|sg": { adj: "летнего", adjE: "его", noun: "дня" },
  "летний|день|dat|sg": { adj: "летнему", adjE: "ему", noun: "дню" },
  "летний|день|acc|sg": { adj: "летний", adjE: "ий", noun: "день" },
  "летний|день|ins|sg": { adj: "летним", adjE: "им", noun: "днём" },
  "летний|день|prep|sg": { adj: "летнем", adjE: "ем", noun: "дне" },
  "летняя|ночь|nom|sg": { adj: "летняя", adjE: "яя", noun: "ночь" },
  "летняя|ночь|gen|sg": { adj: "летней", adjE: "ей", noun: "ночи" },
  "летняя|ночь|dat|sg": { adj: "летней", adjE: "ей", noun: "ночи" },
  "летняя|ночь|acc|sg": { adj: "летнюю", adjE: "юю", noun: "ночь" },
  "летняя|ночь|ins|sg": { adj: "летней", adjE: "ей", noun: "ночью" },
  "летняя|ночь|prep|sg": { adj: "летней", adjE: "ей", noun: "ночи" },
  "летнее|утро|nom|sg": { adj: "летнее", adjE: "ее", noun: "утро" },
  "летнее|утро|gen|sg": { adj: "летнего", adjE: "его", noun: "утра" },
  "летнее|утро|dat|sg": { adj: "летнему", adjE: "ему", noun: "утру" },
  "летнее|утро|acc|sg": { adj: "летнее", adjE: "ее", noun: "утро" },
  "летнее|утро|ins|sg": { adj: "летним", adjE: "им", noun: "утром" },
  "летнее|утро|prep|sg": { adj: "летнем", adjE: "ем", noun: "утре" },
  "хороший|друг|nom|sg": { adj: "хороший", adjE: "ий", noun: "друг" },
  "хороший|друг|gen|sg": { adj: "хорошего", adjE: "его", noun: "друга" },
  "хороший|друг|dat|sg": { adj: "хорошему", adjE: "ему", noun: "другу" },
  "хороший|друг|acc|sg": { adj: "хорошего", adjE: "его", noun: "друга" },
  "хороший|друг|ins|sg": { adj: "хорошим", adjE: "им", noun: "другом" },
  "хороший|друг|prep|sg": { adj: "хорошем", adjE: "ем", noun: "друге" },
  "хорошая|книга|nom|sg": { adj: "хорошая", adjE: "ая", noun: "книга" },
  "хорошая|книга|gen|sg": { adj: "хорошей", adjE: "ей", noun: "книги" },
  "хорошая|книга|dat|sg": { adj: "хорошей", adjE: "ей", noun: "книге" },
  "хорошая|книга|acc|sg": { adj: "хорошую", adjE: "ую", noun: "книгу" },
  "хорошая|книга|ins|sg": { adj: "хорошей", adjE: "ей", noun: "книгой" },
  "хорошая|книга|prep|sg": { adj: "хорошей", adjE: "ей", noun: "книге" },
  "хорошее|решение|nom|sg": { adj: "хорошее", adjE: "ее", noun: "решение" },
  "хорошее|решение|gen|sg": { adj: "хорошего", adjE: "его", noun: "решения" },
  "хорошее|решение|dat|sg": { adj: "хорошему", adjE: "ему", noun: "решению" },
  "хорошее|решение|acc|sg": { adj: "хорошее", adjE: "ее", noun: "решение" },
  "хорошее|решение|ins|sg": { adj: "хорошим", adjE: "им", noun: "решением" },
  "хорошее|решение|prep|sg": { adj: "хорошем", adjE: "ем", noun: "решении" },
};

const PLURAL_FORMS: Record<string, { adj: string; adjE: string; noun: string; en: string; stem: StemType; animate: boolean }> = {
  "hard|nom": { adj: "новые", adjE: "ые", noun: "книги", en: "new books", stem: "hard", animate: false },
  "hard|gen": { adj: "новых", adjE: "ых", noun: "книг", en: "of the new books", stem: "hard", animate: false },
  "hard|dat": { adj: "новым", adjE: "ым", noun: "книгам", en: "to the new books", stem: "hard", animate: false },
  "hard|acc-in": { adj: "новые", adjE: "ые", noun: "столы", en: "new tables (I see them)", stem: "hard", animate: false },
  "hard|acc-an": { adj: "новых", adjE: "ых", noun: "студентов", en: "new students (I see them)", stem: "hard", animate: true },
  "hard|ins": { adj: "новыми", adjE: "ыми", noun: "книгами", en: "with the new books", stem: "hard", animate: false },
  "hard|prep": { adj: "новых", adjE: "ых", noun: "книгах", en: "about the new books", stem: "hard", animate: false },
  "soft|nom": { adj: "синие", adjE: "ие", noun: "тетради", en: "blue notebooks", stem: "soft", animate: false },
  "soft|gen": { adj: "синих", adjE: "их", noun: "тетрадей", en: "of the blue notebooks", stem: "soft", animate: false },
  "soft|dat": { adj: "синим", adjE: "им", noun: "тетрадям", en: "to the blue notebooks", stem: "soft", animate: false },
  "soft|acc-in": { adj: "синие", adjE: "ие", noun: "тетради", en: "blue notebooks (I see them)", stem: "soft", animate: false },
  "soft|acc-an": { adj: "хороших", adjE: "их", noun: "друзей", en: "good friends (I see them)", stem: "soft", animate: true },
  "soft|ins": { adj: "синими", adjE: "ими", noun: "тетрадями", en: "with the blue notebooks", stem: "soft", animate: false },
  "soft|prep": { adj: "синих", adjE: "их", noun: "тетрадях", en: "about the blue notebooks", stem: "soft", animate: false },
};

const EXTRA_PLURAL: Record<string, TrainerExample[]> = {
  "hard|nom": [
    ex("новые", "ые", "дома", "new houses"),
    ex("большие", "ие", "парки", "big parks"),
    ex("красные", "ые", "машины", "red cars"),
    ex("старые", "ые", "друзья", "old friends"),
    ex("красивые", "ые", "цветы", "beautiful flowers"),
  ],
  "hard|gen": [
    ex("новых", "ых", "домов", "of the new houses"),
    ex("больших", "их", "парков", "of the big parks"),
    ex("красных", "ых", "машин", "of the red cars"),
    ex("старых", "ых", "друзей", "of the old friends"),
    ex("красивых", "ых", "цветов", "of the beautiful flowers"),
  ],
  "hard|dat": [
    ex("новым", "ым", "домам", "to the new houses"),
    ex("большим", "им", "паркам", "to the big parks"),
    ex("красным", "ым", "машинам", "to the red cars"),
    ex("старым", "ым", "друзьям", "to the old friends"),
    ex("красивым", "ым", "цветам", "to the beautiful flowers"),
  ],
  "hard|acc": [
    ex("новые", "ые", "столы", "I see the new tables (things)"),
    ex("новые", "ые", "книги", "I see the new books (things)"),
    ex("новых", "ых", "студентов", "I see the new students (people)"),
    ex("больших", "их", "собак", "I see the big dogs (animals)"),
    ex("старых", "ых", "друзей", "I see the old friends (people)"),
    ex("красные", "ые", "машины", "I see the red cars (things)"),
  ],
  "hard|ins": [
    ex("новыми", "ыми", "книгами", "with the new books"),
    ex("большими", "ими", "домами", "with the big houses"),
    ex("красными", "ыми", "машинами", "with the red cars"),
    ex("старыми", "ыми", "друзьями", "with the old friends"),
    ex("красивыми", "ыми", "цветами", "with the beautiful flowers"),
  ],
  "hard|prep": [
    ex("новых", "ых", "книгах", "about the new books"),
    ex("больших", "их", "домах", "in the big houses"),
    ex("красных", "ых", "машинах", "about the red cars"),
    ex("старых", "ых", "друзьях", "about the old friends"),
    ex("красивых", "ых", "цветах", "about the beautiful flowers"),
  ],
  "soft|nom": [
    ex("синие", "ие", "шары", "blue balloons"),
    ex("летние", "ие", "дни", "summer days"),
    ex("хорошие", "ие", "люди", "good people"),
    ex("зимние", "ие", "ночи", "winter nights"),
    ex("ранние", "ие", "утра", "early mornings"),
  ],
  "soft|gen": [
    ex("синих", "их", "тетрадей", "of the blue notebooks"),
    ex("летних", "их", "дней", "of the summer days"),
    ex("хороших", "их", "людей", "of the good people"),
    ex("зимних", "их", "ночей", "of the winter nights"),
    ex("ранних", "их", "утров", "of the early mornings"),
  ],
  "soft|dat": [
    ex("синим", "им", "тетрадям", "to the blue notebooks"),
    ex("летним", "им", "дням", "to the summer days"),
    ex("хорошим", "им", "людям", "to the good people"),
    ex("зимним", "им", "ночам", "to the winter nights"),
    ex("ранним", "им", "утрам", "to the early mornings"),
  ],
  "soft|acc": [
    ex("синие", "ие", "тетради", "I see the blue notebooks (things)"),
    ex("летние", "ие", "дни", "I see the summer days (things)"),
    ex("хороших", "их", "друзей", "I see the good friends (people)"),
    ex("синих", "их", "мальчиков", "I see the boys in blue (people)"),
    ex("хорошие", "ие", "решения", "I see the good decisions (things)"),
  ],
  "soft|ins": [
    ex("синими", "ими", "тетрадями", "with the blue notebooks"),
    ex("летними", "ими", "днями", "with the summer days"),
    ex("хорошими", "ими", "друзьями", "with the good friends"),
    ex("зимними", "ими", "ночами", "with the winter nights"),
    ex("ранними", "ими", "утрами", "with the early mornings"),
  ],
  "soft|prep": [
    ex("синих", "их", "тетрадях", "about the blue notebooks"),
    ex("летних", "их", "днях", "about the summer days"),
    ex("хороших", "их", "людях", "about the good people"),
    ex("зимних", "их", "ночах", "about the winter nights"),
    ex("ранних", "их", "утрах", "about the early mornings"),
  ],
};

function ex(adj: string, ending: string, noun: string, en: string): TrainerExample {
  return {
    form: splitForm(adj, ending),
    extraRu: noun,
    en,
  };
}

function cellFor(stem: StemType, caseId: CaseId, number: NumberId, gender: GenderId): Cell {
  const table = stem === "hard" ? HARD : SOFT;
  const key = number === "pl" ? `${caseId}_pl` : `${caseId}_sg_${gender}`;
  return table[key];
}

export function getAdjectiveResult(input: {
  caseId: CaseId;
  number: NumberId;
  gender: GenderId;
  stem: StemType;
}): TrainerResult {
  const { caseId, number, gender, stem } = input;
  const cell = cellFor(stem, caseId, number, gender);
  const stemLabel = stem === "hard" ? "Hard stem" : "Soft stem";
  const genderBit = number === "pl" ? "plural (all genders)" : GENDER_LABEL[gender];

  const examples: TrainerExample[] = [];
  if (number === "pl") {
    const extras = EXTRA_PLURAL[`${stem}|${caseId}`] ?? [];
    examples.push(...extras.slice(0, 6));
  } else {
    const pairs = PAIRS.filter((p) => p.stem === stem && p.gender === gender);
    for (const pair of pairs) {
      const row = FORMS[`${pair.adj}|${pair.noun}|${caseId}|sg`];
      if (!row) continue;
      examples.push({
        from: { full: pair.adj, stem: pair.adj, ending: "" },
        form: splitForm(row.adj, row.adjE),
        extraRu: row.noun,
        en: glossAdj(pair.en, caseId, pair.animate),
      });
    }
  }

  const notes = [
    stem === "hard"
      ? "After г, к, х, ж, ч, ш, щ the vowel in the ending may be spelled и instead of ы (большие, тихий)."
      : "хороший is grouped with soft stems because of -ий, but after ш the feminine is хорошая / хорошую (no я or ю after ш).",
  ];
  if (caseId === "acc" && (number === "pl" || gender === "m")) {
    notes.unshift("Animacy matters here. Things copy the nominative; people and animals copy the genitive.");
  }

  return {
    heading: `${stemLabel} · ${CASE_LABEL[caseId]} · ${number === "pl" ? "plural" : NUMBER_LABEL[number] + " " + genderBit}`,
    endingLabel: cell.label,
    endingSpoken: `the ending ${cell.label}`,
    endingDisplay: cell.label,
    rule: cell.rule,
    notes,
    examples: examples.slice(0, 6),
  };
}

function glossAdj(en: string, caseId: CaseId, animate: boolean): string {
  switch (caseId) {
    case "nom":
      return en;
    case "gen":
      return `of the ${en}`;
    case "dat":
      return `to the ${en}`;
    case "acc":
      return animate ? `I see the ${en}` : `I see the ${en}`;
    case "ins":
      return `with the ${en}`;
    case "prep":
      return `about the ${en}`;
  }
}

export const STEM_CHOICES = [
  {
    id: "hard" as const,
    title: "Hard stem",
    description: "dictionary form ends in -ый or -ой",
    ruExamples: ["новый", "красный", "большой"],
    ariaLabel: "Hard stem. Dictionary form ends in -ый or -ой. Examples: новый, красный, большой.",
  },
  {
    id: "soft" as const,
    title: "Soft stem",
    description: "dictionary form ends in -ий",
    ruExamples: ["синий", "летний", "хороший"],
    ariaLabel: "Soft stem. Dictionary form ends in -ий. Examples: синий, летний, хороший.",
  },
];
