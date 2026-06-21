"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import type { AnalysisResult } from "@/lib/types";
import Result from "@/components/Result";

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted">
      {children}
    </span>
  );
}

export default function Analyzer() {
  const [documentType, setDocumentType] = useState<string>(
    siteConfig.documentTypes[0].value,
  );
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string>("");
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setError(null);
    setPdfBase64(null);
    if (!file) {
      setFileName("");
      return;
    }
    setFileName(file.name);

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      const buf = await file.arrayBuffer();
      setPdfBase64(arrayBufferToBase64(buf));
      setText("");
    } else {
      const t = await file.text();
      setText(t);
    }
  }

  async function analyze() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType,
          text: pdfBase64 ? undefined : text,
          pdfBase64: pdfBase64 ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setResult(data.result as AnalysisResult);
      }
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = (!!pdfBase64 || text.trim().length >= 40) && !loading;
  const price = siteConfig.pricing.readPrice;

  return (
    <div>
      <div className="card">
        <label className="block">
          <Label>What kind of document is it?</Label>
          <div className="relative mt-2">
            <select
              className="field appearance-none pr-10"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              {siteConfig.documentTypes.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </label>

        <label className="mt-5 block">
          <Label>Paste the text</Label>
          <textarea
            className="field mt-2 min-h-[210px] resize-y font-serif text-[0.95rem] leading-relaxed"
            placeholder="Paste the contract, lease, offer letter, or terms here…"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (e.target.value) {
                setPdfBase64(null);
                setFileName("");
              }
            }}
            disabled={!!pdfBase64}
          />
        </label>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="btn-ghost cursor-pointer">
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M10 13V4m0 0L6.5 7.5M10 4l3.5 3.5M4 14v1.5A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5V14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Upload a PDF or text file
            <input
              type="file"
              accept=".pdf,.txt,.md,text/plain,application/pdf"
              className="hidden"
              onChange={onFile}
            />
          </label>
          {fileName ? (
            <span className="inline-flex items-center gap-1.5 font-sans text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-good" />
              {fileName}
              {pdfBase64 ? " — ready to read" : ""}
            </span>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-line/70 pt-5">
          <button className="btn" onClick={analyze} disabled={!canSubmit}>
            {loading ? "Reading it over…" : "Break it down for me"}
            {!loading ? (
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  d="M4 10h11m0 0l-4-4m4 4l-4 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
          </button>
          <span className="font-sans text-xs text-muted">
            {price > 0
              ? `$${price} per read · no account needed`
              : "Free while in preview · no account needed"}
          </span>
        </div>

        {error ? (
          <p className="mt-4 rounded-[10px] border border-flag/20 bg-flag-soft px-3.5 py-2.5 font-sans text-sm text-flag">
            {error}
          </p>
        ) : null}
      </div>

      {loading ? (
        <div className="animate-fade mt-9 text-center">
          <p className="font-serif text-lg italic text-muted">
            Reading the fine print so you don&apos;t have to…
          </p>
          <div className="mx-auto mt-3 h-px w-40 origin-left animate-draw bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>
      ) : null}

      {result ? <Result result={result} /> : null}
    </div>
  );
}
