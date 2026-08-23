import { Navigate, useParams } from "react-router-dom";
import { isPartOfSpeech } from "@/lib/grammar/labels";
import { AdjFlow } from "@/components/trainer/adj-flow";
import { NounFlow } from "@/components/trainer/noun-flow";
import { NumeralFlow } from "@/components/trainer/numeral-flow";
import { PronounFlow } from "@/components/trainer/pronoun-flow";
import { VerbFlow } from "@/components/trainer/verb-flow";

export default function Train() {
  const { pos } = useParams<{ pos: string }>();
  if (!pos || !isPartOfSpeech(pos)) {
    return <Navigate to="/" replace />;
  }

  return (
    <main id="main" lang="en">
      {pos === "nouns" ? <NounFlow /> : null}
      {pos === "adjectives" ? <AdjFlow /> : null}
      {pos === "verbs" ? <VerbFlow /> : null}
      {pos === "numerals" ? <NumeralFlow /> : null}
      {pos === "pronouns" ? <PronounFlow /> : null}
    </main>
  );
}
