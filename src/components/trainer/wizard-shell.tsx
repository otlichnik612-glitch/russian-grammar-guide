import { useEffect, useRef, type ReactNode } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import type { PartOfSpeech, TransformContext } from "@/lib/grammar/types";
import { POS_META } from "@/lib/grammar/labels";
import { WordTransformPanel } from "./word-transform";

export type SummaryItem = { label: string; value: string };

function titleCase(value: string) {
  return value.slice(0, 1).toUpperCase() + value.slice(1);
}

export function WizardShell({
  pos,
  step,
  total,
  title,
  instruction,
  summary,
  onBack,
  onRestart,
  children,
  isResult = false,
  transform,
}: {
  pos: PartOfSpeech;
  step: number;
  total: number;
  title: string;
  instruction?: string;
  summary: SummaryItem[];
  onBack: () => void;
  onRestart: () => void;
  children: ReactNode;
  isResult?: boolean;
  transform?: TransformContext;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const posTitle = POS_META[pos].title;
  const heading = isResult ? "Your ending" : title;
  const blurb = isResult
    ? "Here is the regular pattern for the choices you made, with clear examples."
    : instruction;
  const headingText = isResult
    ? `Result. ${title}`
    : `Step ${step} of ${total}. ${title}`;
  const progress = Math.min(100, Math.round((step / total) * 100));

  useEffect(() => {
    headingRef.current?.focus();
  }, [step, title]);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col px-4 py-5 sm:px-6 sm:py-8">
      <div
        className="mb-5"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={Math.min(step, total)}
        aria-valuetext={headingText}
        aria-label={`Progress: step ${step} of ${total}`}
      >
        <p className="mb-2 text-sm text-muted">
          {isResult ? `Step ${total} of ${total}` : `Step ${step} of ${total}`}
        </p>
        <div className="h-2 w-full rounded-full bg-paper-3" aria-hidden="true">
          <div
            className="h-2 rounded-full bg-primary transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {summary.length > 0 ? (
        <p className="mb-4 text-sm font-medium text-ink-soft">
          <span className="font-semibold text-ink">Your path: </span>
          {summary.map((item) => titleCase(item.value)).join(" · ")}
        </p>
      ) : null}

      {transform ? <WordTransformPanel context={transform} /> : null}

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mb-2 font-display text-3xl font-semibold tracking-tight outline-none"
      >
        {heading}
      </h1>
      {blurb ? (
        <p className="mb-6 max-w-prose text-lg leading-snug text-ink-soft">{blurb}</p>
      ) : (
        <div className="mb-6" />
      )}

      <div className="step-enter">{children}</div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to the previous step"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-primary bg-paper-2 px-5 text-base font-semibold text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </button>
        <button
          type="button"
          onClick={onRestart}
          aria-label={`Start over in ${posTitle}`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-primary bg-paper-2 px-5 text-base font-semibold text-primary"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Start Over
        </button>
      </div>
    </div>
  );
}
