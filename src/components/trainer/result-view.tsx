import type { TrainerExample, TrainerResult } from "@/lib/grammar/types";
import { EnWithRu, RuPhrase, RuWord, hasCyrillic } from "@/components/russian";

function staysTheSame(example: TrainerExample): boolean {
  return Boolean(example.from && example.from.full === example.form.full);
}

export function ResultView({
  result,
}: {
  result: TrainerResult;
  onAgain?: () => void;
  againLabel?: string;
}) {
  const raw = result.endingDisplay.trim();
  const shown =
    /^[-—]/.test(raw) || raw.length > 8 || /\s/.test(raw) ? raw.replace(/^-/, "—") : `—${raw}`;
  const endingLang = hasCyrillic(raw) ? "ru" : "en";
  const formStays =
    result.examples.length > 0 && result.examples.every(staysTheSame);

  return (
    <article className="flex flex-col gap-4">
      <section
        aria-labelledby="rule-heading"
        className="rounded-[1.75rem] bg-paper-2 px-5 py-5"
      >
        <h2 id="rule-heading" className="mb-2 font-display text-2xl font-semibold">
          The rule
        </h2>
        <p className="text-lg leading-relaxed text-ink">
          <EnWithRu text={result.rule} />
        </p>
      </section>

      <section
        aria-labelledby="ending-heading"
        className="rounded-[1.75rem] bg-mint px-5 py-6 text-center"
      >
        <h2
          id="ending-heading"
          className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary"
        >
          {formStays ? "The form stays" : "New ending"}
        </h2>
        <p
          lang={endingLang}
          className="font-display text-5xl font-semibold leading-none text-primary"
        >
          {shown}
        </p>
        <p className="sr-only">{result.endingSpoken}</p>
        <p className="mt-3 text-base text-ink-soft">
          {formStays
            ? "The form does not change."
            : result.endingLabel && result.endingLabel !== result.endingDisplay
              ? result.endingLabel
              : null}
        </p>
      </section>

      <section
        aria-labelledby="examples-heading"
        className="rounded-[1.75rem] bg-paper-2 px-5 py-5"
      >
        <h2 id="examples-heading" className="mb-3 font-display text-2xl font-semibold">
          Examples
        </h2>
        <ul className="grid list-none gap-4 p-0">
          {result.examples.map((example, i) => {
            const unchanged = staysTheSame(example);
            const showFrom = Boolean(example.from) && !example.extraRu;
            return (
              <li key={`${example.form.full}-${i}`}>
                <p className="text-xl font-medium leading-snug text-ink">
                  {showFrom ? (
                    <>
                      <RuWord form={example.from!} />
                      {unchanged ? (
                        <span className="mx-2 font-normal text-ink-soft">stays</span>
                      ) : (
                        <>
                          <span aria-hidden="true" className="mx-2 text-muted">
                            →
                          </span>
                          <span className="sr-only"> becomes </span>
                        </>
                      )}
                    </>
                  ) : null}
                  {example.extraRu ? (
                    <RuPhrase phrase={example.extraRu} form={example.form} />
                  ) : (
                    <RuWord form={example.form} />
                  )}
                </p>
                <p className="mt-0.5 text-base text-ink-soft">
                  {unchanged
                    ? showFrom
                      ? "The form does not change."
                      : "stays — the form does not change."
                    : example.en}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {result.notes.length > 0 ? (
        <section aria-labelledby="notes-heading" className="px-1">
          <h2 id="notes-heading" className="sr-only">
            Notes
          </h2>
          <ul className="flex flex-col gap-2">
            {result.notes.map((note) => (
              <li key={note} className="text-base leading-snug text-ink-soft">
                <EnWithRu text={note} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
