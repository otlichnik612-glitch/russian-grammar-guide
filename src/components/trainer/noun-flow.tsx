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
  getNounResult,
  nounPatternChoices,
  patternTitle,
  type NounPatternId,
} from "@/lib/grammar/nouns";
import type { AnimacyId, CaseId, GenderId, NumberId } from "@/lib/grammar/types";
import { ChoiceGrid } from "./choice-card";
import { ResultView } from "./result-view";
import { WizardShell, type SummaryItem } from "./wizard-shell";

type NounState = {
  caseId?: CaseId;
  number?: NumberId;
  animacy?: AnimacyId;
  gender?: GenderId;
  patternId?: NounPatternId;
};

function currentStep(s: NounState): string {
  if (!s.caseId) return "case";
  if (!s.number) return "number";
  if (s.caseId === "acc" && !s.animacy) return "animacy";
  if (!s.gender) return "gender";
  if (!s.patternId) return "pattern";
  return "result";
}

export function NounFlow() {
  const navigate = useNavigate();
  const [s, setS] = useState<NounState>({});
  const stepId = currentStep(s);
  const needsAnimacy = s.caseId === "acc";
  const total = needsAnimacy ? 6 : 5;
  const stepNumber =
    stepId === "case"
      ? 1
      : stepId === "number"
        ? 2
        : stepId === "animacy"
          ? 3
          : stepId === "gender"
            ? needsAnimacy
              ? 4
              : 3
            : stepId === "pattern"
              ? needsAnimacy
                ? 5
                : 4
              : total;

  const summary = useMemo(() => {
    const items: SummaryItem[] = [];
    if (s.caseId) items.push({ label: "Case", value: CASE_LABEL[s.caseId] });
    if (s.number) items.push({ label: "Number", value: NUMBER_LABEL[s.number] });
    if (s.animacy) items.push({ label: "Animacy", value: ANIMACY_LABEL[s.animacy] });
    if (s.gender) items.push({ label: "Gender", value: GENDER_LABEL[s.gender] });
    if (s.patternId) items.push({ label: "Pattern", value: patternTitle(s.patternId) });
    return items;
  }, [s]);

  function back() {
    if (stepId === "result") setS({ ...s, patternId: undefined });
    else if (stepId === "pattern") setS({ ...s, gender: undefined });
    else if (stepId === "gender") {
      if (needsAnimacy) setS({ ...s, animacy: undefined });
      else setS({ ...s, number: undefined });
    } else if (stepId === "animacy") setS({ ...s, number: undefined });
    else if (stepId === "number") setS({ ...s, caseId: undefined });
    else navigate("/");
  }

  const patterns = s.gender ? nounPatternChoices(s.gender) : [];

  const heading =
    stepId === "case"
      ? "Choose the case"
      : stepId === "number"
        ? "Choose the number"
        : stepId === "animacy"
          ? "Is the noun animate?"
          : stepId === "gender"
            ? "Choose the gender"
            : stepId === "pattern"
              ? "How does the noun end?"
              : summary.map((i) => i.value).join(" · ");

  const instruction =
    stepId === "case"
      ? "Case tells you the noun’s job in the sentence. Pick the one you want to practise."
      : stepId === "number"
        ? "Is this one thing, or more than one?"
        : stepId === "animacy"
          ? "Accusative endings can change depending on whether the noun names a living being."
          : stepId === "gender"
            ? undefined
            : stepId === "pattern"
              ? "Use the Nominative (dictionary) form. Only the patterns for your chosen gender are shown."
              : undefined;

  return (
    <WizardShell
      pos="nouns"
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
              pos: "nouns",
              caseId: s.caseId,
              number: s.number,
              gender: s.gender,
              animacy: s.animacy,
            }
          : undefined
      }
    >
      {stepId === "case" ? (
        <ChoiceGrid
          choices={CASE_CHOICES}
          onChoose={(id) => setS({ caseId: id as CaseId })}
        />
      ) : null}
      {stepId === "number" ? (
        <ChoiceGrid
          columns={2}
          choices={NUMBER_CHOICES}
          onChoose={(id) => setS({ ...s, number: id as NumberId })}
        />
      ) : null}
      {stepId === "animacy" ? (
        <ChoiceGrid
          columns={2}
          choices={ANIMACY_CHOICES}
          onChoose={(id) => setS({ ...s, animacy: id as AnimacyId })}
        />
      ) : null}
      {stepId === "gender" ? (
        <ChoiceGrid
          columns={3}
          choices={GENDER_CHOICES}
          onChoose={(id) => setS({ ...s, gender: id as GenderId, patternId: undefined })}
        />
      ) : null}
      {stepId === "pattern" ? (
        <ChoiceGrid
          columns={1}
          choices={patterns}
          surface="plain"
          onChoose={(id) => setS({ ...s, patternId: id as NounPatternId })}
        />
      ) : null}
      {stepId === "result" &&
      s.caseId &&
      s.number &&
      s.gender &&
      s.patternId ? (
        <ResultView
          result={getNounResult({
            caseId: s.caseId,
            number: s.number,
            gender: s.gender,
            animacy: s.animacy ?? "inanimate",
            patternId: s.patternId,
          })}
          onAgain={() => setS({})}
          againLabel="Practise another noun form"
        />
      ) : null}
    </WizardShell>
  );
}
