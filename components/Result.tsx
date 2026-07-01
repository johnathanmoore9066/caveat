import type { AnalysisResult, Severity } from "@/lib/types";

const badgeStyles: Record<Severity, string> = {
  high: "bg-flag-soft text-flag",
  medium: "bg-gold-soft text-gold",
  low: "bg-line/70 text-muted",
};

const barStyles: Record<Severity, string> = {
  high: "bg-flag",
  medium: "bg-gold",
  low: "bg-muted/50",
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
    <section className="mt-9">
      <h3 className="display flex items-center gap-3 text-xl font-semibold">
        <span className="h-1.5 w-1.5 rotate-45 bg-gold/70" />
        {title}
      </h3>
      <div className="mt-3.5">{children}</div>
    </section>
  );
}

export default function Result({ result }: { result: AnalysisResult }) {
  return (
    <article className="animate-rise mt-10">
      <div className="rule-mark" />

      {result.counterparty ? (
        <p className="mt-7 font-sans text-xs uppercase tracking-[0.18em] text-muted">
          Contract with{" "}
          <span className="font-semibold text-ink">{result.counterparty}</span>
        </p>
      ) : null}

      <Section title="Who this benefits">
        <p className="font-serif text-[1.1rem] leading-relaxed text-ink/90">
          {result.whoBenefits}
        </p>
      </Section>

      <Section title="The short version">
        <ul className="space-y-2.5">
          {result.summary.map((point, i) => (
            <li key={i} className="flex gap-3 font-serif leading-relaxed">
              <span className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/35" />
              <span className="text-ink/90">{point}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="What you'd be signing">
        <ul className="space-y-2.5">
          {result.signatures.map((item, i) => (
            <li key={i} className="flex gap-3 font-serif leading-relaxed">
              <span className="mt-0.5 font-display text-sm text-gold">§</span>
              <span className="text-ink/90">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={`Red flags${result.redFlags.length ? ` · ${result.redFlags.length}` : ""}`}>
        {result.redFlags.length === 0 ? (
          <p className="font-serif leading-relaxed text-good">
            Nothing jumped out as a red flag — but read it through yourself too.
          </p>
        ) : (
          <ul className="space-y-3.5">
            {result.redFlags.map((flag, i) => (
              <li
                key={i}
                className="card lift relative overflow-hidden pl-6"
              >
                <span
                  className={`absolute inset-y-0 left-0 w-1 ${barStyles[flag.severity]}`}
                />
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-sans text-[0.95rem] font-semibold">
                    {flag.title}
                  </h4>
                  <span className={`pill ${badgeStyles[flag.severity]}`}>
                    {severityLabel[flag.severity]}
                  </span>
                </div>
                <p className="mt-2 font-serif leading-relaxed text-ink/85">
                  {flag.explanation}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="In my opinion">
        <blockquote className="relative overflow-hidden rounded-2xl border border-line bg-raise/70 py-5 pl-12 pr-6 shadow-card">
          <span
            aria-hidden
            className="absolute left-3 top-1 font-display text-5xl leading-none text-gold/40"
          >
            &ldquo;
          </span>
          <p className="font-serif text-[1.1rem] italic leading-relaxed text-ink/90">
            {result.opinion}
          </p>
        </blockquote>
      </Section>

      <p className="mt-9 font-sans text-xs leading-relaxed text-muted">
        This is a plain-English summary to help you understand the document — it
        is not legal advice and not a substitute for a lawyer.
      </p>
    </article>
  );
}
