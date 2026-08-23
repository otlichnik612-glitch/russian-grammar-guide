import { useEffect, useId, useState, type FormEvent } from "react";
import { Ru } from "@/components/russian";
import { ENTER_WORD, transformWord } from "@/lib/grammar/transform";
import type { TransformContext } from "@/lib/grammar/types";

export function WordTransformPanel({ context }: { context: TransformContext }) {
  const fieldId = useId();
  const resultId = useId();
  const kind = ENTER_WORD[context.pos];
  const [value, setValue] = useState("");
  const [result, setResult] = useState<ReturnType<typeof transformWord> | null>(null);

  useEffect(() => {
    if (!value.trim()) return;
    if (result) setResult(transformWord(value, context));
    // Re-run only when the grammar choices change, not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    context.caseId,
    context.number,
    context.gender,
    context.animacy,
    context.tense,
    context.aspect,
    context.person,
    context.conjugation,
    context.stem,
    context.pronounId,
  ]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setResult(transformWord(value, context));
  }

  return (
    <section
      aria-label={`Transform your ${kind}`}
      className="mb-6 rounded-[1.75rem] bg-paper-2 px-4 py-4"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label htmlFor={fieldId} className="font-display text-lg font-semibold">
          Enter your {kind}
        </label>
        <input
          id={fieldId}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          lang={context.pos === "numerals" ? "en" : "ru"}
          inputMode={context.pos === "numerals" ? "decimal" : "text"}
          placeholder={context.pos === "numerals" ? "5" : undefined}
          className="min-h-14 w-full rounded-2xl border-2 border-line bg-paper px-4 text-xl text-ink"
          aria-describedby={result ? resultId : undefined}
        />
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 text-base font-semibold text-primary-fg"
        >
          Transform my word
        </button>
      </form>
      {result ? (
        <div id={resultId} className="mt-4" aria-live="polite">
          {result.error ? (
            <p className="text-base text-ink-soft">{result.error}</p>
          ) : (
            <>
              <p className="font-display text-3xl font-semibold">
                <Ru>{result.output}</Ru>
              </p>
              <p className="mt-1 text-base text-ink-soft">
                {result.unchanged
                  ? "stays — the form does not change."
                  : result.note ?? null}
              </p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
