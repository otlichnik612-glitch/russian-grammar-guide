import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ANIMACY_CHOICES,
  CASE_CHOICES,
  CASE_LABEL,
  GENDER_CHOICES,
  GENDER_LABEL,
  NUMBER_CHOICES,
  NUMBER_LABEL,
} from "@/lib/grammar/labels";
import {
  getPronounResult,
  PRONOUN_CHOICES,
  PRONOUN_TYPE_CHOICES,
  pronounDeclinesLikeAdj,
  pronounHasNominative,
  pronounIsFixed,
  pronounTitle,
  typeLabel,
} from "@/lib/grammar/pronouns";
import type {
  AnimacyId,
  CaseId,
  GenderId,
  NumberId,
  PronounTypeId,
} from "@/lib/grammar/types";
import { ChoiceGrid } from "./choice-card";
import { ResultView } from "./result-view";
import { WizardShell, type SummaryItem } from "./wizard-shell";

type State = {
  type?: PronounTypeId;
  pronounId?: string;
  caseId?: CaseId;
  number?: NumberId;
  gender?: GenderId;
  animacy?: AnimacyId;
};

function currentStep(s: State): string {
  if (!s.type) return "type";
  if (!s.pronounId) return "which";
  if (pronounIsFixed(s.pronounId)) return "result";
  if (!s.caseId) return "case";
  if (pronounDeclinesLikeAdj(s.pronounId)) {
    if (!s.number) return "number";
    if (s.number === "sg" && !s.gender) return "gender";
    if (s.caseId === "acc" && (s.number === "pl" || s.gender === "m") && !s.animacy) {
      return "animacy";
    }
  }
  return "result";
}

export function PronounFlow() {
  const navigate = useNavigate();
  const [s, setS] = useState<State>({});
  const stepId = currentStep(s);
  const adjLike = s.pronounId ? pronounDeclinesLikeAdj(s.pronounId) : false;
  const needsAnimacy =
    adjLike && s.caseId === "acc" && (s.number === "pl" || s.gender === "m");
  const total = (() => {
    if (s.pronounId && pronounIsFixed(s.pronounId)) return 3;
    if (adjLike) return needsAnimacy ? (s.number === "pl" ? 6 : 7) : s.number === "pl" ? 5 : 6;
    return 4;
  })();

  const stepNumber =
    stepId === "type"
      ? 1
      : stepId === "which"
        ? 2
        : stepId === "case"
          ? 3
          : stepId === "number"
            ? 4
            : stepId === "gender"
              ? 5
              : stepId === "animacy"
                ? s.number === "pl"
                  ? 5
                  : 6
                : total;

  const summary = useMemo(() => {
    const items: SummaryItem[] = [];
    if (s.type) items.push({ label: "Type", value: typeLabel(s.type) });
    if (s.pronounId) items.push({ label: "Pronoun", value: pronounTitle(s.pronounId) });
    if (s.caseId) items.push({ label: "Case", value: CASE_LABEL[s.caseId] });
    if (s.number) items.push({ label: "Number", value: NUMBER_LABEL[s.number] });
    if (s.gender) items.push({ label: "Gender", value: GENDER_LABEL[s.gender] });
    if (s.animacy) items.push({ label: "Animacy", value: s.animacy });
    return items;
  }, [s]);

  function back() {
    if (stepId === "result") {
      if (s.pronounId && pronounIsFixed(s.pronounId)) setS({ ...s, pronounId: undefined });
      else if (needsAnimacy) setS({ ...s, animacy: undefined });
      else if (s.number === "sg" && adjLike) setS({ ...s, gender: undefined });
      else if (adjLike) setS({ ...s, number: undefined });
      else setS({ ...s, caseId: undefined });
    } else if (stepId === "animacy") {
      if (s.number === "sg") setS({ ...s, gender: undefined });
      else setS({ ...s, number: undefined });
    } else if (stepId === "gender") setS({ ...s, number: undefined });
    else if (stepId === "number") setS({ ...s, caseId: undefined });
    else if (stepId === "case") setS({ ...s, pronounId: undefined });
    else if (stepId === "which") setS({ ...s, type: undefined });
    else navigate("/");
  }

  const heading =
    stepId === "type"
      ? "What kind of pronoun?"
      : stepId === "which"
        ? "Which pronoun?"
        : stepId === "case"
          ? "Choose the case"
          : stepId === "number"
            ? "Choose the number"
            : stepId === "gender"
              ? "Choose the gender"
              : stepId === "animacy"
                ? "Is it animate?"
                : summary.map((i) => i.value).join(" · ");

  const instruction =
    stepId === "type"
      ? "Personal, possessive, demonstrative, reflexive or interrogative."
      : stepId === "which"
        ? undefined
        : stepId === "case"
          ? "Pick the case you want to practise."
          : undefined;

  const caseChoices = CASE_CHOICES.filter((c) =>
    s.pronounId && !pronounHasNominative(s.pronounId) ? c.id !== "nom" : true,
  );

  const transform =
    s.caseId || (s.pronounId && pronounIsFixed(s.pronounId))
      ? {
          pos: "pronouns" as const,
          caseId: s.caseId ?? "nom",
          number: s.number,
          gender: s.gender,
          animacy: s.animacy,
          pronounType: s.type,
          pronounId: s.pronounId,
        }
      : undefined;

  return (
    <WizardShell
      pos="pronouns"
      step={stepNumber}
      total={total}
      title={heading}
      instruction={instruction}
      summary={summary}
      onBack={back}
      onRestart={() => setS({})}
      isResult={stepId === "result"}
      transform={transform}
    >
      {stepId === "type" ? (
        <ChoiceGrid
          choices={PRONOUN_TYPE_CHOICES}
          onChoose={(id) => setS({ type: id as PronounTypeId })}
        />
      ) : null}
      {stepId === "which" && s.type ? (
        <ChoiceGrid
          choices={PRONOUN_CHOICES[s.type]}
          onChoose={(id) => setS({ ...s, pronounId: id })}
        />
      ) : null}
      {stepId === "case" ? (
        <ChoiceGrid
          choices={caseChoices}
          onChoose={(id) => setS({ ...s, caseId: id as CaseId })}
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
          choices={GENDER_CHOICES}
          onChoose={(id) => setS({ ...s, gender: id as GenderId })}
        />
      ) : null}
      {stepId === "animacy" ? (
        <ChoiceGrid
          choices={ANIMACY_CHOICES}
          onChoose={(id) => setS({ ...s, animacy: id as AnimacyId })}
        />
      ) : null}
      {stepId === "result" && s.pronounId && (s.caseId || pronounIsFixed(s.pronounId)) ? (
        <ResultView
          result={getPronounResult({
            type: s.type ?? "personal",
            pronounId: s.pronounId,
            caseId: s.caseId ?? "nom",
            number: s.number,
            gender: s.gender,
            animacy: s.animacy,
          })}
        />
      ) : null}
    </WizardShell>
  );
}
