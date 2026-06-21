"use client";

import { useState } from "react";
import type { FlagRecord, Severity } from "@/lib/types";

const dot: Record<Severity, string> = {
  high: "bg-flag",
  medium: "bg-gold",
  low: "bg-muted/60",
};

export default function CounterpartySearch() {
  const [q, setQ] = useState("");
  const [records, setRecords] = useState<FlagRecord[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setRecords(data.records as FlagRecord[]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card border-good/15 bg-good-soft/35">
      <p className="eyebrow !text-good before:bg-good/50">Check before you read</p>
      <p className="mt-2 font-serif text-[1.05rem] leading-relaxed text-ink/90">
        See red flags others already found in a company&apos;s contracts.
      </p>

      <form onSubmit={run} className="mt-4 flex gap-2.5">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <circle cx="9" cy="9" r="5.5" />
            <path d="M13.5 13.5L17 17" strokeLinecap="round" />
          </svg>
          <input
            className="field pl-10"
            placeholder="Company name — a landlord, carrier, or employer"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <button className="btn" disabled={loading || !q.trim()}>
          {loading ? "…" : "Search"}
        </button>
      </form>

      {records !== null ? (
        records.length === 0 ? (
          <p className="animate-fade mt-4 font-sans text-sm text-muted">
            Nothing found for “{q}” yet — be the first to add it by running a
            read below.
          </p>
        ) : (
          <ul className="animate-fade mt-4 space-y-3">
            {records.map((r) => (
              <li key={r.id} className="border-t border-line/70 pt-3">
                <p className="font-sans text-xs uppercase tracking-[0.16em] text-muted">
                  {r.counterparty} · {r.documentType}
                </p>
                <ul className="mt-1.5 space-y-1.5">
                  {r.redFlags.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2.5 font-serif text-sm text-ink/90"
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot[f.severity]}`}
                      />
                      {f.title}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )
      ) : null}
    </div>
  );
}
