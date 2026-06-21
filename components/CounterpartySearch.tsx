"use client";

import { useState } from "react";
import type { FlagRecord, Severity } from "@/lib/types";

const dot: Record<Severity, string> = {
  high: "bg-flag",
  medium: "bg-gold",
  low: "bg-muted",
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
    <div className="card bg-good-soft/40">
      <p className="font-sans text-xs font-medium uppercase tracking-wide text-good">
        Check before you read
      </p>
      <p className="mt-1 font-serif leading-relaxed">
        See red flags others already found in a company&apos;s contracts.
      </p>
      <form onSubmit={run} className="mt-3 flex gap-2">
        <input
          className="field"
          placeholder="Company name — e.g. a landlord, carrier, or employer"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn" disabled={loading || !q.trim()}>
          {loading ? "…" : "Search"}
        </button>
      </form>

      {records !== null ? (
        records.length === 0 ? (
          <p className="mt-3 font-sans text-sm text-muted">
            Nothing found for “{q}” yet — be the first to add it by running a
            read below.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {records.map((r) => (
              <li key={r.id} className="border-t border-line/70 pt-3">
                <p className="font-sans text-xs uppercase tracking-wide text-muted">
                  {r.counterparty} · {r.documentType}
                </p>
                <ul className="mt-1 space-y-1">
                  {r.redFlags.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 font-serif text-sm"
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${dot[f.severity]}`}
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
