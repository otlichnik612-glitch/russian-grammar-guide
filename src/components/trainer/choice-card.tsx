import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Check,
  Circle,
  Clock,
  Gift,
  Hammer,
  Hash,
  HelpCircle,
  History,
  Layers,
  ListOrdered,
  MapPin,
  Percent,
  Repeat,
  Target,
  User,
  Users,
} from "lucide-react";
import type { Choice } from "@/lib/grammar/types";
import { EnWithRu, Ru } from "@/components/russian";

const ICONS: Record<string, LucideIcon> = {
  nom: BookOpen,
  gen: Percent,
  dat: Gift,
  acc: Target,
  ins: Hammer,
  prep: MapPin,
  sg: Hash,
  pl: Users,
  animate: User,
  inanimate: Circle,
  m: User,
  f: User,
  n: Circle,
  hard: Layers,
  soft: BookOpen,
  present: Clock,
  past: History,
  future: Clock,
  imperfective: Repeat,
  perfective: Check,
  first: Hash,
  second: Hash,
  cardinal: Hash,
  ordinal: ListOrdered,
  "1_sg": User,
  "2_sg": User,
  "3_sg": User,
  "1_pl": Users,
  "2_pl": Users,
  "3_pl": Users,
  m_sg: User,
  f_sg: User,
  n_sg: Circle,
  "1": Hash,
  "2": Hash,
  "3": Hash,
  "4": Hash,
  "5": Hash,
  "40": Hash,
  "1000": Hash,
  personal: User,
  possessive: User,
  demonstrative: Target,
  reflexive: Repeat,
  interrogative: HelpCircle,
};

const TINTS = ["bg-mint", "bg-sage", "bg-sky", "bg-rose", "bg-sand"] as const;

export function ChoiceCard({
  choice,
  onClick,
  index,
  surface,
}: {
  choice: Choice;
  onClick: () => void;
  index: number;
  surface: "tint" | "plain";
}) {
  const Icon = ICONS[choice.id];
  const tint = TINTS[index % TINTS.length];
  const surfaceClass =
    surface === "plain"
      ? "border border-line bg-paper-2"
      : `border border-transparent ${tint}`;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={choice.ariaLabel}
      className={`flex w-full min-h-16 items-center gap-4 rounded-[1.75rem] px-4 py-4 text-left text-ink transition-[box-shadow,transform] duration-150 hover:shadow-card-hover ${surfaceClass}`}
    >
      {Icon ? (
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/70 text-primary">
          <Icon className="size-5" aria-hidden="true" strokeWidth={2} />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block font-display text-xl font-semibold leading-snug">
          <EnWithRu text={choice.title} />
        </span>
        {choice.description ? (
          <span className="mt-0.5 block text-base leading-snug text-ink-soft">
            <EnWithRu text={choice.description} />
          </span>
        ) : null}
        {choice.ruExamples && choice.ruExamples.length > 0 ? (
          <span className="mt-1 block text-base text-ink-soft">
            (
            {choice.ruExamples.map((ex, i) => (
              <span key={ex}>
                {i > 0 ? ", " : null}
                <Ru>{ex}</Ru>
              </span>
            ))}
            )
          </span>
        ) : null}
      </span>
    </button>
  );
}

export function ChoiceGrid({
  choices,
  onChoose,
  surface = "tint",
}: {
  choices: Choice[];
  onChoose: (id: string) => void;
  columns?: 1 | 2 | 3;
  surface?: "tint" | "plain";
}) {
  return (
    <ul className="grid list-none gap-3 p-0">
      {choices.map((choice, index) => (
        <li key={choice.id}>
          <ChoiceCard
            choice={choice}
            index={index}
            surface={surface}
            onClick={() => onChoose(choice.id)}
          />
        </li>
      ))}
    </ul>
  );
}
