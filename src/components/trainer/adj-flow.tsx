import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CASE_CHOICES,
  CASE_LABEL,
  GENDER_CHOICES,
  GENDER_LABEL,
  NUMBER_CHOICES,
  NUMBER_LABEL,
} from "@/lib/grammar/labels";
import { getAdjectiveResult, STEM_CHOICES } from "@/lib/grammar/adjectives";
import type { CaseId, GenderId, NumberId, StemType } from "@/lib/grammar/types";
import { ChoiceGrid } from "./choice-card";
import { ResultView } from "./result-view";
import { WizardShell, type SummaryItem } from "./wizard-shell";

type AdjState = {
  caseId?: CaseId;
  number?: NumberId;
  gender?: GenderId;
  stem?: StemType;
};

function currentStep(s: AdjState): string {
  if (!s.caseId) return "case";
  if (!s.number) return "number";
  if (s.number === "sg" && !s.gender) return "gender";
  if (!s.stem) return "stem";
  return "result";
}

export function AdjFlow() {
  const navigate = useNavigate();
  const [s, setS] = useState<AdjState>({});
  const stepId = currentStep(s);
  const needsGender = s.number !== "pl";
  const total = needsGender ? 5 : 4;
  const stepNumber =
    stepId === "case"
      ? 1
      : stepId === "number"
        ? 2
        : stepId === "gender"
          ? 3
          : stepId === "stem"
            ? needsGender
              ? 4
              : 3
            : total;

  const summary = useMemo(() => {
    const items: SummaryItem[] = [];
    if (s.caseId) items.push({ label: "Case", value: CASE_LABEL[s.caseId] });
    if (s.number) items.push({ label: "Number", value: NUMBER_LABEL[s.number] });
    if (s.gender) items.push({ label: "Gender", value: GENDER_LABEL[s.gender] });
    if (s.stem) items.push({ label: "Stem", value: s.stem === "hard" ? "hard" : "soft" });
    return items;
  }, [s]);

  function back() {
    if (stepId === "result") setS({ ...s, stem: undefined });
    else if (stepId === "stem") {
      if (s.number === "sg") setS({ ...s, gender: undefined });
      else setS({ ...s, number: undefined });
    } else if (stepId === "gender") setS({ ...s, number: undefined });
    else if (stepId === "number") setS({ ...s, caseId: undefined });
    else navigate("/");
  }

  const heading =
    stepId === "case"
      ? "Choose the case"
      : stepId === "number"
        ? "Choose the number"
        : stepId === "gender"
          ? "Choose the gender"
          : stepId === "stem"
            ? "Hard or soft stem?"
            : summary.map((i) => i.value).join(" · ");

  const instruction =
    stepId === "case"
      ? "The adjective takes the same case as the noun it describes."
      : stepId === "number"
        ? "Is this one thing, or more than one?"
        : stepId === "gender"
          ? undefined
          : stepId === "stem"
            ? "Look at the dictionary form. Only the patterns for that stem are shown."
            : undefined;

  return (
    <WizardShell
      pos="adjectives"
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
              pos: "adjectives",
              caseId: s.caseId,
              number: s.number,
              gender: s.gender,
              animacy: "inanimate",
              stem: s.stem,
            }
          : undefined
      }
    >
      {stepId === "case" ? (
        <ChoiceGrid choices={CASE_CHOICES} onChoose={(id) => setS({ caseId: id as CaseId })} />
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
      {stepId === "stem" ? (
        <ChoiceGrid
          columns={1}
          choices={STEM_CHOICES}
          surface="plain"
          onChoose={(id) => setS({ ...s, stem: id as StemType })}
        />
      ) : null}
      {stepId === "result" && s.caseId && s.number && s.stem ? (
        <ResultView
          result={getAdjectiveResult({
            caseId: s.caseId,
            number: s.number,
            gender: s.gender ?? "m",
            stem: s.stem,
          })}
          onAgain={() => setS({})}
          againLabel="Practise another adjective form"
        />
      ) : null}
    </WizardShell>
  );
}
