import type { ReactNode } from "react";
import type { RuForm } from "@/lib/grammar/types";

const CYRILLIC = /[А-Яа-яЁёІіѢѣ]/;

export function hasCyrillic(value: string): boolean {
  return CYRILLIC.test(value);
}

/** English copy that may contain a Russian word — split so lang="ru" wraps the Russian. */
export function EnWithRu({ text }: { text: string }) {
  if (!hasCyrillic(text)) return <>{text}</>;
  const parts = text.split(/([А-Яа-яЁё]+(?:\s+[А-Яа-яЁё]+)*)/g);
  return (
    <>
      {parts.map((part, i) =>
        hasCyrillic(part) ? (
          <span key={i} lang="ru">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function Ru({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span lang="ru" className={className}>
      {children}
    </span>
  );
}

/** One Russian word with the changing ending marked. */
export function RuWord({ form, className }: { form: RuForm; className?: string }) {
  if (!form.ending) {
    return (
      <span lang="ru" className={className}>
        {form.full}
      </span>
    );
  }
  return (
    <span lang="ru" className={className}>
      {form.stem}
      <mark className="ending-mark">{form.ending}</mark>
    </span>
  );
}

/**
 * A Russian phrase that contains `form.full`. The matching word is split so the
 * new ending can be highlighted. Falls back to word + remainder.
 */
export function RuPhrase({
  phrase,
  form,
}: {
  phrase: string;
  form: RuForm;
}) {
  const index = phrase.indexOf(form.full);
  if (index === -1) {
    return (
      <>
        <RuWord form={form} />{" "}
        <span lang="ru">{phrase}</span>
      </>
    );
  }
  const before = phrase.slice(0, index);
  const after = phrase.slice(index + form.full.length);
  return (
    <span lang="ru">
      {before}
      {form.ending ? (
        <>
          {form.stem}
          <mark className="ending-mark">{form.ending}</mark>
        </>
      ) : (
        form.full
      )}
      {after}
    </span>
  );
}
