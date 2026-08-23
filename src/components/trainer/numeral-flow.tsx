import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ANIMACY_CHOICES,
  ANIMACY_LABEL,
  CASE_CHOICES,
  CASE_LABEL,
  GENDER_CHOICES,
  GENDER_LABEL,
  NUMBER_CHOICES,
  NUMBER_LABEL,
} from "@/lib/grammar/labels";
import {
  CARDINAL_CHOICES,
  getCardinalResult,
  getOrdinalResult,
  needsCardinalAnimacy,
  needsCardinalGender,
  type CardinalId,
} from "@/lib/grammar/numerals";
import type {
  AnimacyId,
  CaseId,
  Choice,
  GenderId,
  NumberId,
  NumeralKind,
} from "@/lib/grammar/types";
import { ChoiceGrid } from "./choice-card";
import { ResultView } from "./result-view";
import { WizardShell, type SummaryItem } from "./wizard-shell";

const KIND_CHOICES: Choice[] = [
  {
    id: "cardinal",
    title: "Cardinal numbers",
    description: "how many — one, two, five",
    ariaLabel: "Cardinal numbers. How many.",
  },
  {
    id: "ordinal",
    title: "Ordinal numbers",
    description: "which one — first, second, fifth",
    ariaLabel: "Ordinal numbers. Which one.",
  },
];

type NumState = {
  kind?: NumeralKind;
  cardinal?: CardinalId;
  caseId?: CaseId;
  number?: NumberId;
  gender?: GenderId;
  animacy?: AnimacyId;
};

function currentStep(s: NumState): string {
  if (!s.kind) return "kind";
  if (s.kind === "cardinal") {
    if (!s.cardinal) return "cardinal";
    if (!s.caseId) return "case";
    if (needsCardinalGender(s.cardinal) && !s.gender) return "gender";
    if (needsCardinalAnimacy(s.cardinal, s.caseId) && !s.animacy) return "animacy";
    return "result";
  }
  if (!s.caseId) return "case";
  if (!s.number) return "number";
  if (s.number === "sg" && !s.gender) return "gender";
  return "result";
}

export function NumeralFlow() {
  const navigate = useNavigate();
  const [s, setS] = useState<NumState>({});
  const stepId = currentStep(s);

  const total = (() => {
    if (s.kind === "ordinal") return s.number === "pl" ? 4 : 5;
    if (s.kind === "cardinal" && s.cardinal && s.caseId) {
      let n = 4; // kind, which number, case, result
      if (needsCardinalGender(s.cardinal)) n += 1;
      if (needsCardinalAnimacy(s.cardinal, s.caseId)) n += 1;
      return n;
    }
    if (s.kind === "cardinal") return 5;
    return 5;
  })();

  const stepNumber =
    stepId === "kind"
      ? 1
      : stepId === "cardinal"
        ? 2
        : stepId === "case"
          ? s.kind === "cardinal"
            ? 3
            : 2
          : stepId === "number"
            ? 3
            : stepId === "gender"
              ? s.kind === "cardinal"
                ? 4
                : s.number === "sg"
                  ? 4
                  : 3
              : stepId === "animacy"
                ? needsCardinalGender(s.cardinal ?? "1")
                  ? 5
                  : 4
                : total;

  const summary = useMemo(() => {
    const items: SummaryItem[] = [];
    if (s.kind) items.push({ label: "Type", value: s.kind === "cardinal" ? "cardinal" : "ordinal" });
    if (s.cardinal) {
      const title = CARDINAL_CHOICES.find((c) => c.id === s.cardinal)?.title ?? s.cardinal;
      items.push({ label: "Number", value: title });
    }
    if (s.caseId) items.push({ label: "Case", value: CASE_LABEL[s.caseId] });
    if (s.number && s.kind === "ordinal") {
      items.push({ label: "Number", value: NUMBER_LABEL[s.number] });
    }
    if (s.gender) items.push({ label: "Gender", value: GENDER_LABEL[s.gender] });
    if (s.animacy) items.push({ label: "Animacy", value: ANIMACY_LABEL[s.animacy] });
    return items;
  }, [s]);

  function back() {
    if (stepId === "result") {
      if (s.kind === "cardinal") {
        if (s.cardinal && s.caseId && needsCardinalAnimacy(s.cardinal, s.caseId)) {
          setS({ ...s, animacy: undefined });
        } else if (s.cardinal && needsCardinalGender(s.cardinal)) {
          setS({ ...s, gender: undefined });
        } else {
          setS({ ...s, caseId: undefined });
        }
      } else if (s.number === "sg") {
        setS({ ...s, gender: undefined });
      } else {
        setS({ ...s, number: undefined });
      }
    } else if (stepId === "animacy") {
      if (s.cardinal && needsCardinalGender(s.cardinal)) setS({ ...s, gender: undefined });
      else setS({ ...s, caseId: undefined });
    } else if (stepId === "gender") {
      if (s.kind === "ordinal") setS({ ...s, number: undefined });
      else setS({ ...s, caseId: undefined });
    } else if (stepId === "number") setS({ ...s, caseId: undefined });
    else if (stepId === "case") {
      if (s.kind === "cardinal") setS({ ...s, cardinal: undefined });
      else setS({ ...s, kind: undefined });
    } else if (stepId === "cardinal") setS({ ...s, kind: undefined });
    else navigate("/");
  }

  const heading =
    stepId === "kind"
      ? "What kind of number?"
      : stepId === "cardinal"
        ? "Which cardinal number?"
        : stepId === "case"
          ? "Choose the case"
          : stepId === "number"
            ? "Choose the number"
            : stepId === "gender"
              ? "Choose the gender"
              : stepId === "animacy"
                ? "Are you counting people and animals, or things?"
                : summary.map((i) => i.value).join(" · ");

  const instruction =
    stepId === "kind"
      ? "Cardinals answer “how many?”. Ordinals answer “which one?”."
      : stepId === "cardinal"
        ? "1–4 have special patterns. From 5 the pattern is more regular."
        : stepId === "case"
          ? "Pick the case you want to practise."
          : stepId === "number"
            ? "Is this one thing, or more than one?"
            : stepId === "gender"
              ? undefined
              : stepId === "animacy"
                ? "People and animals, or things?"
                : undefined;

  return (
    <WizardShell
      pos="numerals"
      step={stepNumber}
      total={total}
      title={heading}
      instruction={instruction}
      summary={summary}
      onBack={back}
      onRestart={() => setS({})}
      isResult={stepId === "result"}
      transform={
        s.caseId
          ? {
              pos: "numerals",
              caseId: s.caseId,
              number: s.number,
              gender: s.gender,
              animacy: s.animacy,
              numeralKind: s.kind,
            }
          : undefined
      }
    >
      {stepId === "kind" ? (
        <ChoiceGrid
          columns={1}
          choices={KIND_CHOICES}
          onChoose={(id) => setS({ kind: id as NumeralKind })}
        />
      ) : null}
      {stepId === "cardinal" ? (
        <ChoiceGrid
          columns={1}
          choices={CARDINAL_CHOICES}
          onChoose={(id) => setS({ ...s, cardinal: id as CardinalId })}
        />
      ) : null}
      {stepId === "case" ? (
        <ChoiceGrid
          choices={CASE_CHOICES}
          onChoose={(id) =>
            setS({
              ...s,
              caseId: id as CaseId,
              animacy: undefined,
            })
          }
        />
      ) : null}
      {stepId === "number" ? (
        <ChoiceGrid
          choices={NUMBER_CHOICES}
          onChoose={(id) =>
            setS({
              ...s,
              number: id as NumberId,
              gender: id === "pl" ? undefined : s.gender,
            })
          }
        />
      ) : null}
      {stepId === "gender" ? (
        <ChoiceGrid
          columns={3}
          choices={GENDER_CHOICES}
          onChoose={(id) => setS({ ...s, gender: id as GenderId })}
        />
      ) : null}
      {stepId === "animacy" ? (
        <ChoiceGrid
          columns={2}
          choices={ANIMACY_CHOICES}
          onChoose={(id) => setS({ ...s, animacy: id as AnimacyId })}
        />
      ) : null}
      {stepId === "result" && s.kind === "cardinal" && s.cardinal && s.caseId ? (
        <ResultView
          result={getCardinalResult({
            cardinal: s.cardinal,
            caseId: s.caseId,
            gender: s.gender ?? "m",
            animacy: s.animacy ?? "inanimate",
          })}
          onAgain={() => setS({})}
          againLabel="Practise another number form"
        />
      ) : null}
      {stepId === "result" && s.kind === "ordinal" && s.caseId && s.number ? (
        <ResultView
          result={getOrdinalResult({
            caseId: s.caseId,
            number: s.number,
            gender: s.gender ?? "m",
          })}
          onAgain={() => setS({})}
          againLabel="Practise another ordinal form"
        />
      ) : null}
    </WizardShell>
  );
}
