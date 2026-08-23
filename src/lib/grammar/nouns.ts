import { ANIMACY_LABEL, CASE_LABEL, GENDER_LABEL, NUMBER_LABEL } from "./labels";
import type {
  AnimacyId,
  CaseId,
  Choice,
  GenderId,
  NumberId,
  TrainerExample,
  TrainerResult,
} from "./types";
import { splitForm } from "./types";

export type NounPatternId =
  | "m-cons"
  | "m-y"
  | "m-soft"
  | "f-a"
  | "f-ya"
  | "f-iya"
  | "f-soft"
  | "n-o"
  | "n-e"
  | "n-ie";

type Cell = {
  ending: string;
  label: string;
  rule: string;
  note?: string;
};

type NounWord = {
  lemma: string;
  en: string;
  patternId: NounPatternId;
  animate: boolean;
  /** nom gen dat acc(inan) ins prep */
  sg: [string, string, string, string, string, string];
  pl: [string, string, string, string, string, string];
  sgE: [string, string, string, string, string, string];
  plE: [string, string, string, string, string, string];
};

const IDX: Record<Exclude<CaseId, "acc"> | "accInan", number> = {
  nom: 0,
  gen: 1,
  dat: 2,
  accInan: 3,
  ins: 4,
  prep: 5,
};

export const NOUN_PATTERNS: Array<{
  id: NounPatternId;
  gender: GenderId;
  title: string;
  description: string;
  ruExamples: string[];
  ariaLabel: string;
}> = [
  {
    id: "m-cons",
    gender: "m",
    title: "Ends with a consonant",
    description: "",
    ruExamples: ["стол", "парк", "студент"],
    ariaLabel: "Ends with a consonant. Examples: стол, парк, студент.",
  },
  {
    id: "m-y",
    gender: "m",
    title: "Ends with -й",
    description: "",
    ruExamples: ["музей", "герой", "чай"],
    ariaLabel: "Ends with й. Examples: музей, герой, чай.",
  },
  {
    id: "m-soft",
    gender: "m",
    title: "Ends with a soft sign -ь",
    description: "",
    ruExamples: ["словарь", "день", "писатель"],
    ariaLabel: "Ends with ь. Examples: словарь, день, писатель.",
  },
  {
    id: "f-a",
    gender: "f",
    title: "Ends with -a",
    description: "",
    ruExamples: ["книга", "мама", "школа"],
    ariaLabel: "Ends with a. Examples: книга, мама, школа.",
  },
  {
    id: "f-ya",
    gender: "f",
    title: "Ends with -я",
    description: "",
    ruExamples: ["неделя", "земля", "тётя"],
    ariaLabel: "Ends with я. Examples: неделя, земля, тётя.",
  },
  {
    id: "f-iya",
    gender: "f",
    title: "Ends with -ия",
    description: "",
    ruExamples: ["история", "фамилия", "Россия"],
    ariaLabel: "Ends with ия. Examples: история, фамилия, Россия.",
  },
  {
    id: "f-soft",
    gender: "f",
    title: "Ends with a soft sign -ь",
    description: "",
    ruExamples: ["ночь", "дверь", "мышь"],
    ariaLabel: "Ends with ь. Examples: ночь, дверь, мышь.",
  },
  {
    id: "n-o",
    gender: "n",
    title: "Ends with -о",
    description: "",
    ruExamples: ["окно", "слово", "молоко"],
    ariaLabel: "Ends with о. Examples: окно, слово, молоко.",
  },
  {
    id: "n-e",
    gender: "n",
    title: "Ends with -е",
    description: "",
    ruExamples: ["море", "поле", "платье"],
    ariaLabel: "Ends with е. Examples: море, поле, платье.",
  },
  {
    id: "n-ie",
    gender: "n",
    title: "Ends with -ие",
    description: "",
    ruExamples: ["здание", "упражнение", "занятие"],
    ariaLabel: "Ends with ие. Examples: здание, упражнение, занятие.",
  },
];

const WORDS: NounWord[] = [
  w("стол", "table", "m-cons", false, ["стол", "стола", "столу", "стол", "столом", "столе"], ["столы", "столов", "столам", "столы", "столами", "столах"], ["", "а", "у", "", "ом", "е"], ["ы", "ов", "ам", "ы", "ами", "ах"]),
  w("парк", "park", "m-cons", false, ["парк", "парка", "парку", "парк", "парком", "парке"], ["парки", "парков", "паркам", "парки", "парками", "парках"], ["", "а", "у", "", "ом", "е"], ["и", "ов", "ам", "и", "ами", "ах"]),
  w("магазин", "shop", "m-cons", false, ["магазин", "магазина", "магазину", "магазин", "магазином", "магазине"], ["магазины", "магазинов", "магазинам", "магазины", "магазинами", "магазинах"], ["", "а", "у", "", "ом", "е"], ["ы", "ов", "ам", "ы", "ами", "ах"]),
  w("фильм", "film", "m-cons", false, ["фильм", "фильма", "фильму", "фильм", "фильмом", "фильме"], ["фильмы", "фильмов", "фильмам", "фильмы", "фильмами", "фильмах"], ["", "а", "у", "", "ом", "е"], ["ы", "ов", "ам", "ы", "ами", "ах"]),
  w("студент", "student", "m-cons", true, ["студент", "студента", "студенту", "студента", "студентом", "студенте"], ["студенты", "студентов", "студентам", "студентов", "студентами", "студентах"], ["", "а", "у", "а", "ом", "е"], ["ы", "ов", "ам", "ов", "ами", "ах"]),
  w("кот", "cat", "m-cons", true, ["кот", "кота", "коту", "кота", "котом", "коте"], ["коты", "котов", "котам", "котов", "котами", "котах"], ["", "а", "у", "а", "ом", "е"], ["ы", "ов", "ам", "ов", "ами", "ах"]),
  w("артист", "performer", "m-cons", true, ["артист", "артиста", "артисту", "артиста", "артистом", "артисте"], ["артисты", "артистов", "артистам", "артистов", "артистами", "артистах"], ["", "а", "у", "а", "ом", "е"], ["ы", "ов", "ам", "ов", "ами", "ах"]),
  w("футболист", "footballer", "m-cons", true, ["футболист", "футбориста", "футболисту", "футбориста", "футболистом", "футболисте"], ["футболисты", "футболистов", "футболистам", "футболистов", "футболистами", "футболистах"], ["", "а", "у", "а", "ом", "е"], ["ы", "ов", "ам", "ов", "ами", "ах"]),
  w("инженер", "engineer", "m-cons", true, ["инженер", "инженера", "инженеру", "инженера", "инженером", "инженере"], ["инженеры", "инженеров", "инженерам", "инженеров", "инженерами", "инженерах"], ["", "а", "у", "а", "ом", "е"], ["ы", "ов", "ам", "ов", "ами", "ах"]),
  w("турист", "tourist", "m-cons", true, ["турист", "туриста", "туристу", "туриста", "туристом", "туристе"], ["туристы", "туристов", "туристам", "туристов", "туристами", "туристах"], ["", "а", "у", "а", "ом", "е"], ["ы", "ов", "ам", "ов", "ами", "ах"]),
  w("музей", "museum", "m-y", false, ["музей", "музея", "музею", "музей", "музеем", "музее"], ["музеи", "музеев", "музеям", "музеи", "музеями", "музеях"], ["й", "я", "ю", "й", "ем", "е"], ["и", "ев", "ям", "и", "ями", "ях"]),
  w("чай", "tea", "m-y", false, ["чай", "чая", "чаю", "чай", "чаем", "чае"], ["чаи", "чаёв", "чаям", "чаи", "чаями", "чаях"], ["й", "я", "ю", "й", "ем", "е"], ["и", "ёв", "ям", "и", "ями", "ях"]),
  w("трамвай", "tram", "m-y", false, ["трамвай", "трамвая", "трамваю", "трамвай", "трамваем", "трамвае"], ["трамваи", "трамваев", "трамваям", "трамваи", "трамваями", "трамваях"], ["й", "я", "ю", "й", "ем", "е"], ["и", "ев", "ям", "и", "ями", "ях"]),
  w("случай", "case / occasion", "m-y", false, ["случай", "случая", "случаю", "случай", "случаем", "случае"], ["случаи", "случаев", "случаям", "случаи", "случаями", "случаях"], ["й", "я", "ю", "й", "ем", "е"], ["и", "ев", "ям", "и", "ями", "ях"]),
  w("герой", "hero", "m-y", true, ["герой", "героя", "герою", "героя", "героем", "герое"], ["герои", "героев", "героям", "героев", "героями", "героях"], ["й", "я", "ю", "я", "ем", "е"], ["и", "ев", "ям", "ев", "ями", "ях"]),
  w("злодей", "villain", "m-y", true, ["злодей", "злодея", "злодею", "злодея", "злодеем", "злодее"], ["злодеи", "злодеев", "злодеям", "злодеев", "злодеями", "злодеях"], ["й", "я", "ю", "я", "ем", "е"], ["и", "ев", "ям", "ев", "ями", "ях"]),
  w("попугай", "parrot", "m-y", true, ["попугай", "попугая", "попугаю", "попугая", "попугаем", "попугае"], ["попугаи", "попугаев", "попугаям", "попугаев", "попугаями", "попугаях"], ["й", "я", "ю", "я", "ем", "е"], ["и", "ев", "ям", "ев", "ями", "ях"]),
  w("словарь", "dictionary", "m-soft", false, ["словарь", "словаря", "словарю", "словарь", "словарём", "словаре"], ["словари", "словарей", "словарям", "словари", "словарями", "словарях"], ["ь", "я", "ю", "ь", "ём", "е"], ["и", "ей", "ям", "и", "ями", "ях"]),
  w("фонарь", "lantern", "m-soft", false, ["фонарь", "фонаря", "фонарю", "фонарь", "фонарём", "фонаре"], ["фонари", "фонарей", "фонарям", "фонари", "фонарями", "фонарях"], ["ь", "я", "ю", "ь", "ём", "е"], ["и", "ей", "ям", "и", "ями", "ях"]),
  w("календарь", "calendar", "m-soft", false, ["календарь", "календаря", "календарю", "календарь", "календарём", "календаре"], ["календари", "календарей", "календарям", "календари", "календарями", "календарях"], ["ь", "я", "ю", "ь", "ём", "е"], ["и", "ей", "ям", "и", "ями", "ях"]),
  w("автомобиль", "car", "m-soft", false, ["автомобиль", "автомобиля", "автомобилю", "автомобиль", "автомобилем", "автомобиле"], ["автомобили", "автомобилей", "автомобилям", "автомобили", "автомобилями", "автомобилях"], ["ь", "я", "ю", "ь", "ем", "е"], ["и", "ей", "ям", "и", "ями", "ях"]),
  w("писатель", "writer", "m-soft", true, ["писатель", "писателя", "писателю", "писателя", "писателем", "писателе"], ["писатели", "писателей", "писателям", "писателей", "писателями", "писателях"], ["ь", "я", "ю", "я", "ем", "е"], ["и", "ей", "ям", "ей", "ями", "ях"]),
  w("житель", "resident", "m-soft", true, ["житель", "жителя", "жителю", "жителя", "жителем", "жителе"], ["жители", "жителей", "жителям", "жителей", "жителями", "жителях"], ["ь", "я", "ю", "я", "ем", "е"], ["и", "ей", "ям", "ей", "ями", "ях"]),
  w("медведь", "bear", "m-soft", true, ["медведь", "медведя", "медведю", "медведя", "медведем", "медведе"], ["медведи", "медведей", "медведям", "медведей", "медведями", "медведях"], ["ь", "я", "ю", "я", "ем", "е"], ["и", "ей", "ям", "ей", "ями", "ях"]),
  w("книга", "book", "f-a", false, ["книга", "книги", "книге", "книгу", "книгой", "книге"], ["книги", "книг", "книгам", "книги", "книгами", "книгах"], ["а", "и", "е", "у", "ой", "е"], ["и", "", "ам", "и", "ами", "ах"]),
  w("школа", "school", "f-a", false, ["школа", "школы", "школе", "школу", "школой", "школе"], ["школы", "школ", "школам", "школы", "школами", "школах"], ["а", "ы", "е", "у", "ой", "е"], ["ы", "", "ам", "ы", "ами", "ах"]),
  w("лампа", "lamp", "f-a", false, ["лампа", "лампы", "лампе", "лампу", "лампой", "лампе"], ["лампы", "ламп", "лампам", "лампы", "лампами", "лампах"], ["а", "ы", "е", "у", "ой", "е"], ["ы", "", "ам", "ы", "ами", "ах"]),
  w("газета", "newspaper", "f-a", false, ["газета", "газеты", "газете", "газету", "газетой", "газете"], ["газеты", "газет", "газетам", "газеты", "газетами", "газетах"], ["а", "ы", "е", "у", "ой", "е"], ["ы", "", "ам", "ы", "ами", "ах"]),
  w("комната", "room", "f-a", false, ["комната", "комнаты", "комнате", "комнату", "комнатой", "комнате"], ["комнаты", "комнат", "комнатам", "комнаты", "комнатами", "комнатах"], ["а", "ы", "е", "у", "ой", "е"], ["ы", "", "ам", "ы", "ами", "ах"]),
  w("мама", "mum", "f-a", true, ["мама", "мамы", "маме", "маму", "мамой", "маме"], ["мамы", "мам", "мамам", "мам", "мамами", "мамах"], ["а", "ы", "е", "у", "ой", "е"], ["ы", "", "ам", "", "ами", "ах"]),
  w("собака", "dog", "f-a", true, ["собака", "собаки", "собаке", "собаку", "собакой", "собаке"], ["собаки", "собак", "собакам", "собак", "собаками", "собаках"], ["а", "и", "е", "у", "ой", "е"], ["и", "", "ам", "", "ами", "ах"]),
  w("кошка", "cat (female)", "f-a", true, ["кошка", "кошки", "кошке", "кошку", "кошкой", "кошке"], ["кошки", "кошек", "кошкам", "кошек", "кошками", "кошках"], ["а", "и", "е", "у", "ой", "е"], ["и", "ек", "ам", "ек", "ами", "ах"]),
  w("девочка", "girl", "f-a", true, ["девочка", "девочки", "девочке", "девочку", "девочкой", "девочке"], ["девочки", "девочек", "девочкам", "девочек", "девочками", "девочках"], ["а", "и", "е", "у", "ой", "е"], ["и", "ек", "ам", "ек", "ами", "ах"]),
  w("учительница", "teacher (female)", "f-a", true, ["учительница", "учительницы", "учительнице", "учительницу", "учительницей", "учительнице"], ["учительницы", "учительниц", "учительницам", "учительниц", "учительницами", "учительницах"], ["а", "ы", "е", "у", "ой", "е"], ["ы", "", "ам", "", "ами", "ах"]),
  w("неделя", "week", "f-ya", false, ["неделя", "недели", "неделе", "неделю", "неделей", "неделе"], ["недели", "недель", "неделям", "недели", "неделями", "неделях"], ["я", "и", "е", "ю", "ей", "е"], ["и", "ь", "ям", "и", "ями", "ях"]),
  w("песня", "song", "f-ya", false, ["песня", "песни", "песне", "песню", "песней", "песне"], ["песни", "песен", "песням", "песни", "песнями", "песнях"], ["я", "и", "е", "ю", "ей", "е"], ["и", "ен", "ям", "и", "ями", "ях"]),
  w("башня", "tower", "f-ya", false, ["башня", "башни", "башне", "башню", "башней", "башне"], ["башни", "башен", "башням", "башни", "башнями", "башнях"], ["я", "и", "е", "ю", "ей", "е"], ["и", "ен", "ям", "и", "ями", "ях"]),
  w("деревня", "village", "f-ya", false, ["деревня", "деревни", "деревне", "деревню", "деревней", "деревне"], ["деревни", "деревень", "деревням", "деревни", "деревнями", "деревнях"], ["я", "и", "е", "ю", "ей", "е"], ["и", "ень", "ям", "и", "ями", "ях"]),
  w("земля", "land / earth", "f-ya", false, ["земля", "земли", "земле", "землю", "землёй", "земле"], ["земли", "земель", "землям", "земли", "землями", "землях"], ["я", "и", "е", "ю", "ёй", "е"], ["и", "ель", "ям", "и", "ями", "ях"]),
  w("тётя", "aunt", "f-ya", true, ["тётя", "тёти", "тёте", "тётю", "тётей", "тёте"], ["тёти", "тётей", "тётям", "тётей", "тётями", "тётях"], ["я", "и", "е", "ю", "ей", "е"], ["и", "ей", "ям", "ей", "ями", "ях"]),
  w("история", "history / story", "f-iya", false, ["история", "истории", "истории", "историю", "историей", "истории"], ["истории", "историй", "историям", "истории", "историями", "историях"], ["я", "и", "и", "ю", "ей", "и"], ["и", "й", "ям", "и", "ями", "ях"]),
  w("фамилия", "surname", "f-iya", false, ["фамилия", "фамилии", "фамилии", "фамилию", "фамилией", "фамилии"], ["фамилии", "фамилий", "фамилиям", "фамилии", "фамилиями", "фамилиях"], ["я", "и", "и", "ю", "ей", "и"], ["и", "й", "ям", "и", "ями", "ях"]),
  w("лекция", "lecture", "f-iya", false, ["лекция", "лекции", "лекции", "лекцию", "лекцией", "лекции"], ["лекции", "лекций", "лекциям", "лекции", "лекциями", "лекциях"], ["я", "и", "и", "ю", "ей", "и"], ["и", "й", "ям", "и", "ями", "ях"]),
  w("линия", "line", "f-iya", false, ["линия", "линии", "линии", "линию", "линией", "линии"], ["линии", "линий", "линиям", "линии", "линиями", "линиях"], ["я", "и", "и", "ю", "ей", "и"], ["и", "й", "ям", "и", "ями", "ях"]),
  w("армия", "army", "f-iya", false, ["армия", "армии", "армии", "армию", "армией", "армии"], ["армии", "армий", "армиям", "армии", "армиями", "армиях"], ["я", "и", "и", "ю", "ей", "и"], ["и", "й", "ям", "и", "ями", "ях"]),
  w("компания", "company", "f-iya", false, ["компания", "компании", "компании", "компанию", "компанией", "компании"], ["компании", "компаний", "компаниям", "компании", "компаниями", "компаниях"], ["я", "и", "и", "ю", "ей", "и"], ["и", "й", "ям", "и", "ями", "ях"]),
  w("дверь", "door", "f-soft", false, ["дверь", "двери", "двери", "дверь", "дверью", "двери"], ["двери", "дверей", "дверям", "двери", "дверями", "дверях"], ["ь", "и", "и", "ь", "ью", "и"], ["и", "ей", "ям", "и", "ями", "ях"]),
  w("ночь", "night", "f-soft", false, ["ночь", "ночи", "ночи", "ночь", "ночью", "ночи"], ["ночи", "ночей", "ночам", "ночи", "ночами", "ночах"], ["ь", "и", "и", "ь", "ью", "и"], ["и", "ей", "ам", "и", "ами", "ах"]),
  w("тетрадь", "notebook", "f-soft", false, ["тетрадь", "тетради", "тетради", "тетрадь", "тетрадью", "тетради"], ["тетради", "тетрадей", "тетрадям", "тетради", "тетрадями", "тетрадях"], ["ь", "и", "и", "ь", "ью", "и"], ["и", "ей", "ям", "и", "ями", "ях"]),
  w("площадь", "square / plaza", "f-soft", false, ["площадь", "площади", "площади", "площадь", "площадью", "площади"], ["площади", "площадей", "площадям", "площади", "площадями", "площадях"], ["ь", "и", "и", "ь", "ью", "и"], ["и", "ей", "ям", "и", "ями", "ях"]),
  w("кровать", "bed", "f-soft", false, ["кровать", "кровати", "кровати", "кровать", "кроватью", "кровати"], ["кровати", "кроватей", "кроватям", "кровати", "кроватями", "кроватях"], ["ь", "и", "и", "ь", "ью", "и"], ["и", "ей", "ям", "и", "ями", "ях"]),
  w("мышь", "mouse", "f-soft", true, ["мышь", "мыши", "мыши", "мышь", "мышью", "мыши"], ["мыши", "мышей", "мышам", "мышей", "мышами", "мышах"], ["ь", "и", "и", "ь", "ью", "и"], ["и", "ей", "ам", "ей", "ами", "ах"]),
  w("лошадь", "horse", "f-soft", true, ["лошадь", "лошади", "лошади", "лошадь", "лошадью", "лошади"], ["лошади", "лошадей", "лошадям", "лошадей", "лошадьми", "лошадях"], ["ь", "и", "и", "ь", "ью", "и"], ["и", "ей", "ям", "ей", "ьми", "ях"]),
  w("окно", "window", "n-o", false, ["окно", "окна", "окну", "окно", "окном", "окне"], ["окна", "окон", "окнам", "окна", "окнами", "окнах"], ["о", "а", "у", "о", "ом", "е"], ["а", "", "ам", "а", "ами", "ах"]),
  w("слово", "word", "n-o", false, ["слово", "слова", "слову", "слово", "словом", "слове"], ["слова", "слов", "словам", "слова", "словами", "словах"], ["о", "а", "у", "о", "ом", "е"], ["а", "", "ам", "а", "ами", "ах"]),
  w("место", "place", "n-o", false, ["место", "места", "месту", "место", "местом", "месте"], ["места", "мест", "местам", "места", "местами", "местах"], ["о", "а", "у", "о", "ом", "е"], ["а", "", "ам", "а", "ами", "ах"]),
  w("дело", "matter / affair", "n-o", false, ["дело", "дела", "делу", "дело", "делом", "деле"], ["дела", "дел", "делам", "дела", "делами", "делах"], ["о", "а", "у", "о", "ом", "е"], ["а", "", "ам", "а", "ами", "ах"]),
  w("яблоко", "apple", "n-o", false, ["яблоко", "яблока", "яблоку", "яблоко", "яблоком", "яблоке"], ["яблоки", "яблок", "яблокам", "яблоки", "яблоками", "яблоках"], ["о", "а", "у", "о", "ом", "е"], ["и", "", "ам", "и", "ами", "ах"]),
  w("зеркало", "mirror", "n-o", false, ["зеркало", "зеркала", "зеркалу", "зеркало", "зеркалом", "зеркале"], ["зеркала", "зеркал", "зеркалам", "зеркала", "зеркалами", "зеркалах"], ["о", "а", "у", "о", "ом", "е"], ["а", "", "ам", "а", "ами", "ах"]),
  w("море", "sea", "n-e", false, ["море", "моря", "морю", "море", "морем", "море"], ["моря", "морей", "морям", "моря", "морями", "морях"], ["е", "я", "ю", "е", "ем", "е"], ["я", "ей", "ям", "я", "ями", "ях"]),
  w("поле", "field", "n-e", false, ["поле", "поля", "полю", "поле", "полем", "поле"], ["поля", "полей", "полям", "поля", "полями", "полях"], ["е", "я", "ю", "е", "ем", "е"], ["я", "ей", "ям", "я", "ями", "ях"]),
  w("горе", "grief", "n-e", false, ["горе", "горя", "горю", "горе", "горем", "горе"], ["горя", "горей", "горям", "горя", "горями", "горях"], ["е", "я", "ю", "е", "ем", "е"], ["я", "ей", "ям", "я", "ями", "ях"]),
  w("солнце", "sun", "n-e", false, ["солнце", "солнца", "солнцу", "солнце", "солнцем", "солнце"], ["солнца", "солнц", "солнцам", "солнца", "солнцами", "солнцах"], ["е", "а", "у", "е", "ем", "е"], ["а", "", "ам", "а", "ами", "ах"]),
  w("сердце", "heart", "n-e", false, ["сердце", "сердца", "сердцу", "сердце", "сердцем", "сердце"], ["сердца", "сердец", "сердцам", "сердца", "сердцами", "сердцах"], ["е", "а", "у", "е", "ем", "е"], ["а", "ец", "ам", "а", "ами", "ах"]),
  w("полотенце", "towel", "n-e", false, ["полотенце", "полотенца", "полотенцу", "полотенце", "полотенцем", "полотенце"], ["полотенца", "полотенец", "полотенцам", "полотенца", "полотенцами", "полотенцах"], ["е", "а", "у", "е", "ем", "е"], ["а", "ец", "ам", "а", "ами", "ах"]),
  w("здание", "building", "n-ie", false, ["здание", "здания", "зданию", "здание", "зданием", "здании"], ["здания", "зданий", "зданиям", "здания", "зданиями", "зданиях"], ["е", "я", "ю", "е", "ем", "и"], ["я", "й", "ям", "я", "ями", "ях"]),
  w("упражнение", "exercise", "n-ie", false, ["упражнение", "упражнения", "упражнению", "упражнение", "упражнением", "упражнении"], ["упражнения", "упражнений", "упражнениям", "упражнения", "упражнениями", "упражнениях"], ["е", "я", "ю", "е", "ем", "и"], ["я", "й", "ям", "я", "ями", "ях"]),
  w("решение", "decision", "n-ie", false, ["решение", "решения", "решению", "решение", "решением", "решении"], ["решения", "решений", "решениям", "решения", "решениями", "решениях"], ["е", "я", "ю", "е", "ем", "и"], ["я", "й", "ям", "я", "ями", "ях"]),
  w("приглашение", "invitation", "n-ie", false, ["приглашение", "приглашения", "приглашению", "приглашение", "приглашением", "приглашении"], ["приглашения", "приглашений", "приглашениям", "приглашения", "приглашениями", "приглашениях"], ["е", "я", "ю", "е", "ем", "и"], ["я", "й", "ям", "я", "ями", "ях"]),
  w("собрание", "meeting", "n-ie", false, ["собрание", "собрания", "собранию", "собрание", "собранием", "собрании"], ["собрания", "собраний", "собраниям", "собрания", "собраниями", "собраниях"], ["е", "я", "ю", "е", "ем", "и"], ["я", "й", "ям", "я", "ями", "ях"]),
  w("окончание", "ending", "n-ie", false, ["окончание", "окончания", "окончанию", "окончание", "окончанием", "окончании"], ["окончания", "окончаний", "окончаниям", "окончания", "окончаниями", "окончаниях"], ["е", "я", "ю", "е", "ем", "и"], ["я", "й", "ям", "я", "ями", "ях"]),
];

function w(
  lemma: string,
  en: string,
  patternId: NounPatternId,
  animate: boolean,
  sg: NounWord["sg"],
  pl: NounWord["pl"],
  sgE: NounWord["sgE"],
  plE: NounWord["plE"],
): NounWord {
  return { lemma, en, patternId, animate, sg, pl, sgE, plE };
}

const CELLS: Record<NounPatternId, Record<string, Cell>> = {
  "m-cons": {
    nom_sg: { ending: "", label: "no extra ending", rule: "Masculine nouns with a consonant in the nominative keep that consonant. This is the dictionary form." },
    gen_sg: { ending: "а", label: "-а", rule: "Masculine consonant-stem nouns take -а in the genitive singular (of the table, of the student)." },
    dat_sg: { ending: "у", label: "-у", rule: "Masculine consonant-stem nouns take -у in the dative singular (to the table, to the student)." },
    acc_sg_inan: { ending: "", label: "same as nominative", rule: "For inanimate masculine nouns, the accusative singular is identical to the nominative: you see the table, not a new ending." },
    acc_sg_an: { ending: "а", label: "-а (same as genitive)", rule: "For animate masculine nouns, the accusative singular copies the genitive: you see the student — студента." },
    ins_sg: { ending: "ом", label: "-ом", rule: "Masculine consonant-stem nouns take -ом in the instrumental singular (with the table, with the student)." },
    prep_sg: { ending: "е", label: "-е", rule: "Masculine consonant-stem nouns take -е in the prepositional singular. Always use a preposition: о столе, в парке." },
    nom_pl: { ending: "ы / и", label: "-ы or -и", rule: "Masculine consonant-stem nouns take -ы in the nominative plural. After г, к, х, ж, ч, ш, щ write -и instead (парки)." },
    gen_pl: { ending: "ов", label: "-ов", rule: "Masculine consonant-stem nouns take -ов in the genitive plural (of the tables, of the students)." },
    dat_pl: { ending: "ам", label: "-ам", rule: "Masculine consonant-stem nouns take -ам in the dative plural." },
    acc_pl_inan: { ending: "ы / и", label: "same as nominative", rule: "For inanimate masculine nouns, the accusative plural matches the nominative plural." },
    acc_pl_an: { ending: "ов", label: "-ов (same as genitive)", rule: "For animate masculine nouns, the accusative plural copies the genitive plural: I see the students — студентов." },
    ins_pl: { ending: "ами", label: "-ами", rule: "Masculine consonant-stem nouns take -ами in the instrumental plural." },
    prep_pl: { ending: "ах", label: "-ах", rule: "Masculine consonant-stem nouns take -ах in the prepositional plural: о столах, в парках." },
  },
  "m-y": {
    nom_sg: { ending: "й", label: "-й", rule: "These masculine nouns end in -й in the nominative singular. That -й is the dictionary ending." },
    gen_sg: { ending: "я", label: "-я", rule: "Replace -й with -я in the genitive singular: музей → музея, герой → героя." },
    dat_sg: { ending: "ю", label: "-ю", rule: "Replace -й with -ю in the dative singular: музею, герою." },
    acc_sg_inan: { ending: "й", label: "same as nominative", rule: "Inanimate nouns in -й keep -й in the accusative singular: I see the museum — музей." },
    acc_sg_an: { ending: "я", label: "-я (same as genitive)", rule: "Animate nouns in -й take the genitive form in the accusative singular: I see the hero — героя." },
    ins_sg: { ending: "ем", label: "-ем", rule: "Replace -й with -ем in the instrumental singular: музеем, героем." },
    prep_sg: { ending: "е", label: "-е", rule: "Replace -й with -е in the prepositional singular: в музее, о герое. (Nouns in -ий, like сценарий, take -ии instead.)" },
    nom_pl: { ending: "и", label: "-и", rule: "Replace -й with -и in the nominative plural: музеи, герои." },
    gen_pl: { ending: "ев", label: "-ев", rule: "Replace -й with -ев in the genitive plural: музеев, героев." },
    dat_pl: { ending: "ям", label: "-ям", rule: "Replace -й with -ям in the dative plural: музеям, героям." },
    acc_pl_inan: { ending: "и", label: "same as nominative", rule: "Inanimate accusative plural matches nominative: музеи." },
    acc_pl_an: { ending: "ев", label: "-ев (same as genitive)", rule: "Animate accusative plural copies genitive: героев." },
    ins_pl: { ending: "ями", label: "-ями", rule: "Replace -й with -ями in the instrumental plural." },
    prep_pl: { ending: "ях", label: "-ях", rule: "Replace -й with -ях in the prepositional plural: в музеях." },
  },
  "m-soft": {
    nom_sg: { ending: "ь", label: "-ь", rule: "Masculine nouns with a soft sign keep ь in the nominative singular. ь is not a sound — it marks a soft stem." },
    gen_sg: { ending: "я", label: "-я", rule: "Replace ь with -я in the genitive singular: словарь → словаря, писатель → писателя." },
    dat_sg: { ending: "ю", label: "-ю", rule: "Replace ь with -ю in the dative singular: словарю, писателю." },
    acc_sg_inan: { ending: "ь", label: "same as nominative", rule: "Inanimate masculine nouns in ь keep ь in the accusative: I see the dictionary — словарь." },
    acc_sg_an: { ending: "я", label: "-я (same as genitive)", rule: "Animate masculine nouns in ь take the genitive in the accusative: I see the writer — писателя." },
    ins_sg: { ending: "ем / ём", label: "-ем or -ём", rule: "Replace ь with -ем (or stressed -ём) in the instrumental singular: писателем, словарём." },
    prep_sg: { ending: "е", label: "-е", rule: "Replace ь with -е in the prepositional singular: в словаре, о писателе." },
    nom_pl: { ending: "и", label: "-и", rule: "Replace ь with -и in the nominative plural: словари, писатели." },
    gen_pl: { ending: "ей", label: "-ей", rule: "Replace ь with -ей in the genitive plural: словарей, писателей." },
    dat_pl: { ending: "ям", label: "-ям", rule: "Replace ь with -ям in the dative plural." },
    acc_pl_inan: { ending: "и", label: "same as nominative", rule: "Inanimate accusative plural matches nominative: словари." },
    acc_pl_an: { ending: "ей", label: "-ей (same as genitive)", rule: "Animate accusative plural copies genitive: писателей." },
    ins_pl: { ending: "ями", label: "-ями", rule: "Replace ь with -ями in the instrumental plural." },
    prep_pl: { ending: "ях", label: "-ях", rule: "Replace ь with -ях in the prepositional plural." },
  },
  "f-a": {
    nom_sg: { ending: "а", label: "-а", rule: "Feminine nouns in -а keep -а in the nominative singular. This is the dictionary form." },
    gen_sg: { ending: "ы / и", label: "-ы or -и", rule: "Replace -а with -ы in the genitive singular. After г, к, х, ж, ч, ш, щ write -и: книга → книги, школа → школы." },
    dat_sg: { ending: "е", label: "-е", rule: "Replace -а with -е in the dative singular: книге, маме, школе." },
    acc_sg_inan: { ending: "у", label: "-у", rule: "Feminine nouns in -а always take -у in the accusative singular, whether they are people or things: книгу, маму." },
    acc_sg_an: { ending: "у", label: "-у", rule: "Feminine nouns in -а always take -у in the accusative singular — animacy does not change this ending: маму, собаку." },
    ins_sg: { ending: "ой", label: "-ой", rule: "Replace -а with -ой in the instrumental singular: книгой, мамой. (A rare extra form -ою exists in poetry.)" },
    prep_sg: { ending: "е", label: "-е", rule: "Replace -а with -е in the prepositional singular — the same ending as the dative: в книге, о маме." },
    nom_pl: { ending: "ы / и", label: "-ы or -и", rule: "Replace -а with -ы in the nominative plural, or -и after г, к, х, ж, ч, ш, щ: школы, книги." },
    gen_pl: { ending: "— (zero)", label: "no extra ending", rule: "Drop -а in the genitive plural. The stem may add a filler vowel: книга → книг, окно-style filler appears in some words (кошка → кошек)." },
    dat_pl: { ending: "ам", label: "-ам", rule: "Replace -а with -ам in the dative plural: книгам, мамам." },
    acc_pl_inan: { ending: "ы / и", label: "same as nominative", rule: "Inanimate feminine accusative plural matches nominative: книги, школы." },
    acc_pl_an: { ending: "zero / genitive", label: "same as genitive", rule: "Animate feminine accusative plural copies genitive: I see the mums — мам; I see the dogs — собак." },
    ins_pl: { ending: "ами", label: "-ами", rule: "Replace -а with -ами in the instrumental plural." },
    prep_pl: { ending: "ах", label: "-ах", rule: "Replace -а with -ах in the prepositional plural: в школах, о мамах." },
  },
  "f-ya": {
    nom_sg: { ending: "я", label: "-я", rule: "Feminine nouns in -я keep -я in the nominative singular." },
    gen_sg: { ending: "и", label: "-и", rule: "Replace -я with -и in the genitive singular: неделя → недели, песня → песни." },
    dat_sg: { ending: "е", label: "-е", rule: "Replace -я with -е in the dative singular: неделе, песне. (The -ия type is different — see Ends in ия.)" },
    acc_sg_inan: { ending: "ю", label: "-ю", rule: "Feminine nouns in -я take -ю in the accusative singular: неделю, песню." },
    acc_sg_an: { ending: "ю", label: "-ю", rule: "Animate feminine nouns in -я still take -ю in the accusative singular: тётю." },
    ins_sg: { ending: "ей / ёй", label: "-ей or -ёй", rule: "Replace -я with -ей (or stressed -ёй) in the instrumental singular: неделей, землёй." },
    prep_sg: { ending: "е", label: "-е", rule: "Replace -я with -е in the prepositional singular: о неделе, в деревне." },
    nom_pl: { ending: "и", label: "-и", rule: "Replace -я with -и in the nominative plural: недели, песни." },
    gen_pl: { ending: "ь or filler", label: "soft sign or filler vowel", rule: "The genitive plural often ends in a soft sign or inserts a vowel: недели → недель, песня → песен, деревня → деревень." },
    dat_pl: { ending: "ям", label: "-ям", rule: "Replace -я with -ям in the dative plural." },
    acc_pl_inan: { ending: "и", label: "same as nominative", rule: "Inanimate accusative plural matches nominative: песни, недели." },
    acc_pl_an: { ending: "genitive form", label: "same as genitive", rule: "Animate accusative plural copies genitive: тётей." },
    ins_pl: { ending: "ями", label: "-ями", rule: "Replace -я with -ями in the instrumental plural." },
    prep_pl: { ending: "ях", label: "-ях", rule: "Replace -я with -ях in the prepositional plural." },
  },
  "f-iya": {
    nom_sg: { ending: "я", label: "-ия", rule: "These feminine nouns end in -ия. Treat the changing ending as -я on a stem that already ends in и." },
    gen_sg: { ending: "и", label: "-ии", rule: "Genitive singular is -ии: история → истории. It looks the same as dative and prepositional." },
    dat_sg: { ending: "и", label: "-ии", rule: "Dative singular is -ии, not -е: к истории, к фамилии. This is the key difference from ordinary -я nouns." },
    acc_sg_inan: { ending: "ю", label: "-ию", rule: "Accusative singular replaces -я with -ю: историю, фамилию." },
    acc_sg_an: { ending: "ю", label: "-ию", rule: "Accusative singular is still -ию even if the noun refers to people in a group sense." },
    ins_sg: { ending: "ей", label: "-ией", rule: "Instrumental singular is -ией: историей, фамилией." },
    prep_sg: { ending: "и", label: "-ии", rule: "Prepositional singular is -ии: об истории, в армии. Same spelling as genitive and dative singular." },
    nom_pl: { ending: "и", label: "-ии", rule: "Nominative plural is -ии: истории, фамилии." },
    gen_pl: { ending: "й", label: "-ий", rule: "Genitive plural is -ий: историй, фамилий, лекций." },
    dat_pl: { ending: "ям", label: "-иям", rule: "Dative plural is -иям: историям." },
    acc_pl_inan: { ending: "и", label: "same as nominative", rule: "Inanimate accusative plural matches nominative: истории, лекции." },
    acc_pl_an: { ending: "й", label: "same as genitive", rule: "If the noun is used as animate in the plural, accusative copies genitive: -ий." },
    ins_pl: { ending: "ями", label: "-иями", rule: "Instrumental plural is -иями: историями." },
    prep_pl: { ending: "ях", label: "-иях", rule: "Prepositional plural is -иях: об историях." },
  },
  "f-soft": {
    nom_sg: { ending: "ь", label: "-ь", rule: "Feminine nouns in ь keep the soft sign in the nominative singular." },
    gen_sg: { ending: "и", label: "-и", rule: "Replace ь with -и in the genitive singular: дверь → двери, тетрадь → тетради. This form is shared with dative and prepositional." },
    dat_sg: { ending: "и", label: "-и", rule: "Dative singular is also -и: к двери, к площади." },
    acc_sg_inan: { ending: "ь", label: "same as nominative", rule: "Feminine nouns in ь keep ь in the accusative singular: I see the door — дверь; I see the notebook — тетрадь." },
    acc_sg_an: { ending: "ь", label: "same as nominative", rule: "Even animate feminine nouns in ь keep ь in the accusative singular: I see the horse — лошадь. Animacy only changes the plural." },
    ins_sg: { ending: "ью", label: "-ью", rule: "Replace ь with -ью in the instrumental singular: дверью, ночью, тетрадью." },
    prep_sg: { ending: "и", label: "-и", rule: "Prepositional singular is -и: о двери, в тетради, о ночи." },
    nom_pl: { ending: "и", label: "-и", rule: "Replace ь with -и in the nominative plural: двери, тетради, ночи." },
    gen_pl: { ending: "ей", label: "-ей", rule: "Replace ь with -ей in the genitive plural: дверей, тетрадей, ночей." },
    dat_pl: { ending: "ям / ам", label: "-ям or -ам", rule: "Most take -ям (тетрадям). After ж, ч, ш, щ the spelling is -ам: ночам, мышам." },
    acc_pl_inan: { ending: "и", label: "same as nominative", rule: "Inanimate accusative plural matches nominative: двери, тетради." },
    acc_pl_an: { ending: "ей", label: "same as genitive", rule: "Animate accusative plural copies genitive: мышей, лошадей." },
    ins_pl: { ending: "ями / ами", label: "-ями or -ами", rule: "Most take -ями. After husher consonants: ночами, мышами. A few old words have -ьми (лошадьми)." },
    prep_pl: { ending: "ях / ах", label: "-ях or -ах", rule: "Most take -ях. After husher consonants: о ночах, о мышах." },
  },
  "n-o": {
    nom_sg: { ending: "о", label: "-о", rule: "Neuter nouns in -о keep -о in the nominative singular." },
    gen_sg: { ending: "а", label: "-а", rule: "Replace -о with -а in the genitive singular: окно → окна, слово → слова." },
    dat_sg: { ending: "у", label: "-у", rule: "Replace -о with -у in the dative singular: окну, слову." },
    acc_sg_inan: { ending: "о", label: "same as nominative", rule: "Neuter accusative singular is the same as nominative: I see the window — окно. Common neuter nouns are inanimate." },
    acc_sg_an: { ending: "о", label: "same as nominative", rule: "Almost all everyday neuter nouns are inanimate, so accusative singular still equals nominative." },
    ins_sg: { ending: "ом", label: "-ом", rule: "Replace -о with -ом in the instrumental singular: окном, словом." },
    prep_sg: { ending: "е", label: "-е", rule: "Replace -о with -е in the prepositional singular: в окне, о слове." },
    nom_pl: { ending: "а / и", label: "-а (sometimes -и)", rule: "Replace -о with -а in the nominative plural: окна, слова, места. A few words (яблоко → яблоки) take -и." },
    gen_pl: { ending: "— (zero)", label: "no extra ending", rule: "Drop -о in the genitive plural. A filler vowel often appears: окно → окон, письмо → писем, яблоко → яблок." },
    dat_pl: { ending: "ам", label: "-ам", rule: "Replace -о with -ам in the dative plural: окнам, словам." },
    acc_pl_inan: { ending: "а / и", label: "same as nominative", rule: "Inanimate accusative plural matches nominative: окна, слова." },
    acc_pl_an: { ending: "zero", label: "same as genitive", rule: "On the rare occasion a neuter noun is treated as animate in the plural, accusative copies genitive." },
    ins_pl: { ending: "ами", label: "-ами", rule: "Replace -о with -ами in the instrumental plural." },
    prep_pl: { ending: "ах", label: "-ах", rule: "Replace -о with -ах in the prepositional plural: в окнах, о словах." },
  },
  "n-e": {
    nom_sg: { ending: "е", label: "-е", rule: "Neuter nouns in -е keep -е in the nominative singular. This is a small but useful group: море, поле." },
    gen_sg: { ending: "я / а", label: "-я or -а", rule: "Soft stems like море take -я (моря). Nouns in -це such as солнце take -а (солнца)." },
    dat_sg: { ending: "ю / у", label: "-ю or -у", rule: "Soft stems take -ю (морю, полю). Nouns in -це take -у (солнцу, сердцу)." },
    acc_sg_inan: { ending: "е", label: "same as nominative", rule: "Accusative singular equals nominative: I see the sea — море." },
    acc_sg_an: { ending: "е", label: "same as nominative", rule: "Everyday neuter nouns are inanimate, so accusative singular stays -е." },
    ins_sg: { ending: "ем", label: "-ем", rule: "Instrumental singular is -ем: морем, полем, солнцем." },
    prep_sg: { ending: "е", label: "-е", rule: "Prepositional singular stays -е: в море, в поле, о солнце. (Do not confuse this with -ие nouns, which take -ии.)" },
    nom_pl: { ending: "я / а", label: "-я or -а", rule: "море → моря, поле → поля. Nouns in -це take -а: сердца, солнца." },
    gen_pl: { ending: "ей or zero", label: "-ей or no ending", rule: "море → морей, поле → полей. Nouns in -це often have a zero ending: солнц, полотенец, сердец." },
    dat_pl: { ending: "ям / ам", label: "-ям or -ам", rule: "морям, полям, but сердцам, солнцам." },
    acc_pl_inan: { ending: "я / а", label: "same as nominative", rule: "Accusative plural matches nominative: моря, поля." },
    acc_pl_an: { ending: "ей", label: "same as genitive", rule: "Rare for this group; if treated as animate, copy the genitive." },
    ins_pl: { ending: "ями / ами", label: "-ями or -ами", rule: "морями, полями; сердцами, солнцами." },
    prep_pl: { ending: "ях / ах", label: "-ях or -ах", rule: "о морях, в полях; о сердцах." },
  },
  "n-ie": {
    nom_sg: { ending: "е", label: "-ие", rule: "These neuter nouns end in -ие. Extremely common for buildings, events and abstract words." },
    gen_sg: { ending: "я", label: "-ия", rule: "Genitive singular is -ия: здание → здания, упражнение → упражнения." },
    dat_sg: { ending: "ю", label: "-ию", rule: "Dative singular is -ию: к зданию, к решению." },
    acc_sg_inan: { ending: "е", label: "same as nominative", rule: "Accusative singular equals nominative: I see the building — здание." },
    acc_sg_an: { ending: "е", label: "same as nominative", rule: "These nouns are inanimate, so accusative singular stays -ие." },
    ins_sg: { ending: "ем", label: "-ием", rule: "Instrumental singular is -ием: зданием, упражнением." },
    prep_sg: { ending: "и", label: "-ии", rule: "Prepositional singular is -ии: в здании, в упражнении, на собрании. This -ии is the form learners most often miss." },
    nom_pl: { ending: "я", label: "-ия", rule: "Nominative plural is -ия: здания, упражнения, решения." },
    gen_pl: { ending: "й", label: "-ий", rule: "Genitive plural is -ий: зданий, упражнений, решений." },
    dat_pl: { ending: "ям", label: "-иям", rule: "Dative plural is -иям: зданиям." },
    acc_pl_inan: { ending: "я", label: "same as nominative", rule: "Accusative plural matches nominative: здания, упражнения." },
    acc_pl_an: { ending: "й", label: "same as genitive", rule: "Not used with this inanimate group in everyday speech." },
    ins_pl: { ending: "ями", label: "-иями", rule: "Instrumental plural is -иями: зданиями." },
    prep_pl: { ending: "ях", label: "-иях", rule: "Prepositional plural is -иях: в зданиях, на собраниях." },
  },
};

const CASE_USE: Record<CaseId, string> = {
  nom: "Use this form for the subject: The book is on the table.",
  gen: "Use this form after нет, для, из, у, after numbers 2–4 (genitive singular) and 5+ (genitive plural), and to mean “of”.",
  dat: "Use this form for the person something is given to, and after к and по.",
  acc: "Use this form for the direct object after verbs like see, take, read, love.",
  ins: "Use this form after с (with), and for the tool you use or the role you work as.",
  prep: "Always pair this form with a preposition: в, на, о / об.",
};

function cellKey(caseId: CaseId, number: NumberId, animacy: AnimacyId): string {
  if (caseId === "acc") return `acc_${number}_${animacy === "animate" ? "an" : "inan"}`;
  return `${caseId}_${number}`;
}

function accUsesGenitive(gender: GenderId, number: NumberId): boolean {
  if (number === "pl") return true;
  return gender === "m";
}

export function nounPatternChoices(gender: GenderId): Choice[] {
  return NOUN_PATTERNS.filter((p) => p.gender === gender).map((p) => ({
    id: p.id,
    title: p.title,
    ruExamples: p.ruExamples,
    ariaLabel: p.ariaLabel,
  }));
}

export function getNounResult(input: {
  caseId: CaseId;
  number: NumberId;
  gender: GenderId;
  animacy: AnimacyId;
  patternId: NounPatternId;
}): TrainerResult {
  const { caseId, number, gender, animacy, patternId } = input;
  const key = cellKey(caseId, number, animacy);
  const cell = CELLS[patternId][key];
  const pattern = NOUN_PATTERNS.find((p) => p.id === patternId)!;
  const words = WORDS.filter((word) => {
    if (word.patternId !== patternId) return false;
    if (caseId !== "acc") return true;
    if (gender === "n") return true;
    if (!accUsesGenitive(gender, number)) return true;
    return word.animate === (animacy === "animate");
  }).slice(0, 6);

  const examples: TrainerExample[] = (words.length ? words : WORDS.filter((wrd) => wrd.patternId === patternId).slice(0, 6)).map((word) => {
    const forms = number === "sg" ? word.sg : word.pl;
    const ends = number === "sg" ? word.sgE : word.plE;
    const useGen =
      caseId === "acc" &&
      animacy === "animate" &&
      accUsesGenitive(gender, number);
    const i = useGen ? IDX.gen : caseId === "acc" ? IDX.accInan : IDX[caseId];
    const full = forms[i];
    const ending = useGen ? ends[IDX.gen] : ends[i];
    const from = splitForm(word.lemma, number === "sg" ? word.sgE[0] : "");
    // lemma ending: use nominative sg ending
    const lemmaForm = splitForm(word.lemma, word.sgE[0]);
    return {
      from: lemmaForm,
      form: splitForm(full, ending),
      en: gloss(word.en, caseId, number, animacy),
    };
  });

  const notes = [
    cell.note,
    CASE_USE[caseId],
    spellingNote(patternId, caseId, number),
  ].filter(Boolean) as string[];

  return {
    heading: `${capitalize(GENDER_LABEL[gender])} · ${pattern.title} · ${CASE_LABEL[caseId]} ${NUMBER_LABEL[number]}`,
    endingLabel: cell.label,
    endingSpoken: spokenEnding(cell.label, cell.ending),
    endingDisplay: cell.label,
    rule: cell.rule,
    notes,
    examples,
    typicalUse: CASE_USE[caseId],
  };
}

function spokenEnding(label: string, ending: string): string {
  if (!ending || label.startsWith("no extra") || label.startsWith("same as")) {
    return label;
  }
  return `the ending ${label}`;
}

function gloss(en: string, caseId: CaseId, number: NumberId, animacy: AnimacyId): string {
  const n = number === "pl" ? `${en}s`.replace(/ss$/, "ses").replace("mums", "mums") : en;
  const pluralish = number === "pl" ? pluralEn(en) : en;
  switch (caseId) {
    case "nom":
      return pluralish;
    case "gen":
      return `of the ${pluralish}`;
    case "dat":
      return `to the ${pluralish}`;
    case "acc":
      return animacy === "animate" ? `I see the ${pluralish}` : `I see the ${pluralish}`;
    case "ins":
      return `with the ${pluralish}`;
    case "prep":
      return `about the ${pluralish}`;
    default:
      return n;
  }
}

function pluralEn(en: string): string {
  if (en === "mum") return "mums";
  if (en === "cat (female)") return "cats";
  if (en === "teacher (female)") return "teachers";
  if (en === "footballer") return "footballers";
  if (en === "mouse") return "mice";
  if (en === "history / story") return "stories";
  if (en === "land / earth") return "lands";
  if (en === "case / occasion") return "occasions";
  if (en === "matter / affair") return "matters";
  if (en === "grief") return "sorrows";
  if (en === "tea") return "kinds of tea";
  if (en.endsWith("y") && !/[aeiou]y$/i.test(en)) return `${en.slice(0, -1)}ies`;
  if (en.endsWith("s") || en.endsWith("sh") || en.endsWith("ch")) return `${en}es`;
  if (en.includes(" / ")) return en.split(" / ")[0] + "s";
  return `${en}s`;
}

function spellingNote(patternId: NounPatternId, caseId: CaseId, number: NumberId): string | undefined {
  if (
    (patternId === "m-cons" || patternId === "f-a") &&
    ((caseId === "nom" && number === "pl") || (caseId === "gen" && number === "sg" && patternId === "f-a"))
  ) {
    return "Spelling rule: after г, к, х, ж, ч, ш, щ write и, not ы. That is why книга → книги and парк → парки.";
  }
  return undefined;
}

function capitalize(value: string): string {
  return value.slice(0, 1).toUpperCase() + value.slice(1);
}

export function patternTitle(id: NounPatternId): string {
  return NOUN_PATTERNS.find((p) => p.id === id)?.title ?? id;
}

export function findNoun(lemma: string) {
  const n = lemma.trim().toLowerCase();
  return WORDS.find((w) => w.lemma === n);
}

export function detectNounPattern(lemma: string, gender?: GenderId): NounPatternId {
  const w = lemma.trim().toLowerCase();
  if (w.endsWith("ия")) return "f-iya";
  if (w.endsWith("ие")) return "n-ie";
  if (w.endsWith("а")) return "f-a";
  if (w.endsWith("я")) return "f-ya";
  if (w.endsWith("о")) return "n-o";
  if (w.endsWith("е")) return "n-e";
  if (w.endsWith("й")) return "m-y";
  if (w.endsWith("ь")) {
    if (gender === "m") return "m-soft";
    if (gender === "f") return "f-soft";
    return "f-soft";
  }
  return "m-cons";
}

export function inflectedNounForm(
  lemma: string,
  caseId: CaseId,
  number: NumberId,
  animacy: AnimacyId,
  gender?: GenderId,
): { full: string; ending: string } | undefined {
  const found = findNoun(lemma);
  if (found) {
    const g: GenderId =
      found.patternId.startsWith("m") ? "m" : found.patternId.startsWith("f") ? "f" : "n";
    const forms = number === "sg" ? found.sg : found.pl;
    const ends = number === "sg" ? found.sgE : found.plE;
    const useGen = caseId === "acc" && animacy === "animate" && accUsesGenitive(g, number);
    const i = useGen ? IDX.gen : caseId === "acc" ? IDX.accInan : IDX[caseId];
    return { full: forms[i], ending: useGen ? ends[IDX.gen] : ends[i] };
  }
  return undefined;
}
