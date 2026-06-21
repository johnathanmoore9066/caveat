import type { AnalysisResult, Severity } from "@/lib/types";

const severityStyles: Record<Severity, string> = {
  high: "bg-flag-soft text-flag",
  medium: "bg-[#F6ECD8] text-gold",
  low: "bg-line/60 text-muted",
};

const severityLabel: Record<Severity, string> = {
  high: "High",
  medium: "Worth a look",
  low: "Minor",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h3 className="display text-lg font-semibold">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function Result({ result }: { result: AnalysisResult }) {
  return (
    <article className="mt-10 border-t border-line pt-8">
      {result.counterparty ? (
        <p className="font-sans text-xs uppercase tracking-wide text-muted">
          Contract with{" "}
          <span className="font-medium text-ink">{result.counterparty}</span>
        </p>
      ) : null}

      <Section title="Who this benefits">
        <p className="font-serif text-[1.05rem] leading-relaxed">
          {result.whoBenefits}
        </p>
      </Section>

      <Section title="The short version">
        <ul className="space-y-2">
          {result.summary.map((point, i) => (
            <li key={i} className="flex gap-2.5 font-serif leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/40" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="What you'd be signing">
        <ul className="space-y-2">
          {result.signatures.map((item, i) => (
            <li key={i} className="flex gap-2.5 font-serif leading-relaxed">
              <span className="mt-1 font-sans text-xs text-muted">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={`Red flags (${result.redFlags.length})`}>
        {result.redFlags.length === 0 ? (
          <p className="font-serif leading-relaxed text-good">
            Nothing jumped out as a red flag — but read it through yourself too.
          </p>
        ) : (
          <ul className="space-y-4">
            {result.redFlags.map((flag, i) => (
              <li key={i} className="card">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-sans text-sm font-semibold">
                    {flag.title}
                  </h4>
                  <span className={`pill ${severityStyles[flag.severity]}`}>
                    {severityLabel[flag.severity]}
                  </span>
                </div>
                <p className="mt-2 font-serif leading-relaxed text-ink/90">
                  {flag.explanation}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="In my opinion">
        <p className="rounded-lg border-l-2 border-gold bg-white/50 px-4 py-3 font-serif text-[1.05rem] italic leading-relaxed">
          {result.opinion}
        </p>
      </Section>

      <p className="mt-8 font-sans text-xs leading-relaxed text-muted">
        This is a plain-English summary to help you understand the document — it
        is not legal advice and not a substitute for a lawyer.
      </p>
    </article>
  );
}
