import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GENDER_LABEL, NUMBER_LABEL } from "@/lib/grammar/labels";
import { getVerbResult } from "@/lib/grammar/verbs";
import type {
  AspectId,
  Choice,
  ConjugationId,
  GenderId,
  NumberId,
  PersonId,
  TenseId,
} from "@/lib/grammar/types";
import { ChoiceGrid } from "./choice-card";
import { ResultView } from "./result-view";
import { WizardShell, type SummaryItem } from "./wizard-shell";

const TENSE_CHOICES: Choice[] = [
  {
    id: "present",
    title: "Present",
    description: "happening now, or regularly",
    ariaLabel: "Present tense.",
  },
  {
    id: "past",
    title: "Past",
    description: "what happened",
    ariaLabel: "Past tense.",
  },
  {
    id: "future",
    title: "Future",
    description: "what will happen",
    ariaLabel: "Future tense.",
  },
];

const ASPECT_CHOICES: Choice[] = [
  {
    id: "imperfective",
    title: "Imperfective",
    description: "process or habit — читать, говорить",
    ruExamples: ["читать", "говорить"],
    ariaLabel: "Imperfective aspect.",
  },
  {
    id: "perfective",
    title: "Perfective",
    description: "a completed action — прочитать, поговорить",
    ruExamples: ["прочитать", "поговорить"],
    ariaLabel: "Perfective aspect.",
  },
];

const PERSON_CHOICES: Choice[] = [
  {
    id: "1_sg",
    title: "I",
    description: "я",
    ariaLabel: "First person singular, I.",
  },
  {
    id: "2_sg",
    title: "You (informal)",
    description: "ты",
    ariaLabel: "Second person singular, informal you.",
  },
  {
    id: "3_sg",
    title: "He / she / it",
    description: "он, она, оно",
    ariaLabel: "Third person singular.",
  },
  {
    id: "1_pl",
    title: "We",
    description: "мы",
    ariaLabel: "First person plural, we.",
  },
  {
    id: "2_pl",
    title: "You (plural / polite)",
    description: "вы",
    ariaLabel: "Second person plural or polite you.",
  },
  {
    id: "3_pl",
    title: "They",
    description: "они",
    ariaLabel: "Third person plural, they.",
  },
];

const PAST_WHO_CHOICES: Choice[] = [
  {
    id: "m_sg",
    title: "Masculine singular",
    description: "он, or я / ты when speaking about a man",
    ariaLabel: "Masculine singular past.",
  },
  {
    id: "f_sg",
    title: "Feminine singular",
    description: "она, or я / ты when speaking about a woman",
    ariaLabel: "Feminine singular past.",
  },
  {
    id: "n_sg",
    title: "Neuter singular",
    description: "оно",
    ariaLabel: "Neuter singular past.",
  },
  {
    id: "pl",
    title: "Plural",
    description: "мы, вы, они",
    ariaLabel: "Plural past.",
  },
];

const CONJ_CHOICES: Choice[] = [
  {
    id: "first",
    title: "First conjugation",
    description: "ты form has е — читаешь",
    ruExamples: ["читать", "работать"],
    ariaLabel: "First conjugation.",
  },
  {
    id: "second",
    title: "Second conjugation",
    description: "ты form has и — говоришь",
    ruExamples: ["говорить", "звонить"],
    ariaLabel: "Second conjugation.",
  },
];

type VerbState = {
  tense?: TenseId;
  aspect?: AspectId;
  person?: PersonId;
  number?: NumberId;
  gender?: GenderId;
  conjugation?: ConjugationId;
};

function needsPerson(s: VerbState) {
  return s.tense === "present" || s.tense === "future";
}
function needsConjugation(s: VerbState) {
  if (s.tense === "past") return false;
  if (s.tense === "future" && s.aspect === "imperfective") return false;
  return true;
}

function currentStep(s: VerbState): string {
  if (!s.tense) return "tense";
  if (!s.aspect) return "aspect";
  if (s.tense === "past") {
    if (!s.number) return "who";
    return "result";
  }
  if (!s.person || !s.number) return "person";
  if (needsConjugation(s) && !s.conjugation) return "conj";
  return "result";
}

function personLabel(person: PersonId, number: NumberId): string {
  const key = `${person}_${number}`;
  return PERSON_CHOICES.find((c) => c.id === key)?.title ?? key;
}

export function VerbFlow() {
  const navigate = useNavigate();
  const [s, setS] = useState<VerbState>({});
  const stepId = currentStep(s);
  const conjNeeded = needsConjugation(s);
  const total = s.tense === "past" ? 4 : conjNeeded ? 5 : 4;

  const stepNumber =
    stepId === "tense"
      ? 1
      : stepId === "aspect"
        ? 2
        : stepId === "who" || stepId === "person"
          ? 3
          : stepId === "conj"
            ? 4
            : total;

  const summary = useMemo(() => {
    const items: SummaryItem[] = [];
    if (s.tense) items.push({ label: "Tense", value: s.tense });
    if (s.aspect) items.push({ label: "Aspect", value: s.aspect });
    if (s.tense === "past" && s.number) {
      items.push({
        label: "Who",
        value:
          s.number === "pl"
            ? "plural"
            : `${GENDER_LABEL[s.gender ?? "m"]} ${NUMBER_LABEL.sg}`,
      });
    }
    if (s.person && s.number && s.tense !== "past") {
      items.push({ label: "Person", value: personLabel(s.person, s.number) });
    }
    if (s.conjugation) {
      items.push({
        label: "Conjugation",
        value: s.conjugation === "first" ? "first" : "second",
      });
    }
    return items;
  }, [s]);

  function back() {
    if (stepId === "result") {
      if (s.tense === "past") setS({ ...s, number: undefined, gender: undefined });
      else if (conjNeeded) setS({ ...s, conjugation: undefined });
      else setS({ ...s, person: undefined, number: undefined });
    } else if (stepId === "conj") setS({ ...s, person: undefined, number: undefined });
    else if (stepId === "person" || stepId === "who") setS({ ...s, aspect: undefined });
    else if (stepId === "aspect") setS({ ...s, tense: undefined });
    else navigate("/");
  }

  const heading =
    stepId === "tense"
      ? "Choose the tense"
      : stepId === "aspect"
        ? "Choose the aspect"
        : stepId === "who"
          ? "Who did the action?"
          : stepId === "person"
            ? "Choose the person and number"
            : stepId === "conj"
              ? "Choose the conjugation type"
              : summary.map((i) => i.value).join(" · ");

  const instruction =
    stepId === "tense"
      ? "Pick present, past or future."
      : stepId === "aspect"
        ? "Imperfective is a process. Perfective is a completed action."
        : stepId === "who"
          ? "Past endings show gender in the singular."
          : stepId === "person"
            ? "Who is doing the action?"
            : stepId === "conj"
              ? "A quick test is the ты form: е is first conjugation, и is second."
              : undefined;

  return (
    <WizardShell
      pos="verbs"
      step={stepNumber}
      total={total}
      title={heading}
      instruction={instruction}
      summary={summary}
      onBack={back}
      onRestart={() => setS({})}
      isResult={stepId === "result"}
      transform={
        s.tense
          ? {
              pos: "verbs",
              tense: s.tense,
              aspect: s.aspect,
              person: s.person,
              number: s.number,
              gender: s.gender,
              conjugation: s.conjugation,
            }
          : undefined
      }
    >
      {stepId === "tense" ? (
        <ChoiceGrid
          columns={1}
          choices={TENSE_CHOICES}
          onChoose={(id) => setS({ tense: id as TenseId })}
        />
      ) : null}
      {stepId === "aspect" ? (
        <ChoiceGrid
          columns={1}
          choices={ASPECT_CHOICES}
          onChoose={(id) => setS({ ...s, aspect: id as AspectId })}
        />
      ) : null}
      {stepId === "who" ? (
        <ChoiceGrid
          choices={PAST_WHO_CHOICES}
          onChoose={(id) => {
            if (id === "pl") setS({ ...s, number: "pl", gender: undefined });
            else {
              const gender = id.slice(0, 1) as GenderId;
              setS({ ...s, number: "sg", gender });
            }
          }}
        />
      ) : null}
      {stepId === "person" ? (
        <ChoiceGrid
          choices={PERSON_CHOICES}
          onChoose={(id) => {
            const [person, number] = id.split("_") as [PersonId, NumberId];
            setS({ ...s, person, number });
          }}
        />
      ) : null}
      {stepId === "conj" ? (
        <ChoiceGrid
          columns={1}
          choices={CONJ_CHOICES}
          onChoose={(id) => setS({ ...s, conjugation: id as ConjugationId })}
        />
      ) : null}
      {stepId === "result" && s.tense && s.aspect && s.number ? (
        <ResultView
          result={getVerbResult({
            tense: s.tense,
            aspect: s.aspect,
            person: s.person,
            number: s.number,
            gender: s.gender,
            conjugation: s.conjugation,
          })}
          onAgain={() => setS({})}
          againLabel="Practise another verb form"
        />
      ) : null}
    </WizardShell>
  );
}
