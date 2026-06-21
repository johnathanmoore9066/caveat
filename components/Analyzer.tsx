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
      // Treat everything else as plain text.
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
        <label className="font-sans text-xs font-medium uppercase tracking-wide text-muted">
          What kind of document is it?
        </label>
        <select
          className="field mt-2"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
        >
          {siteConfig.documentTypes.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>

        <div className="mt-5">
          <label className="font-sans text-xs font-medium uppercase tracking-wide text-muted">
            Paste the text
          </label>
          <textarea
            className="field mt-2 min-h-[200px] resize-y font-serif leading-relaxed"
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
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="btn-ghost cursor-pointer">
            <input
              type="file"
              accept=".pdf,.txt,.md,text/plain,application/pdf"
              className="hidden"
              onChange={onFile}
            />
            Upload a PDF or text file
          </label>
          {fileName ? (
            <span className="font-sans text-xs text-muted">
              {fileName}
              {pdfBase64 ? " — ready to read" : ""}
            </span>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button className="btn" onClick={analyze} disabled={!canSubmit}>
            {loading ? "Reading it over…" : "Break it down for me"}
          </button>
          <span className="font-sans text-xs text-muted">
            {price > 0 ? `$${price} per read` : "Free while in preview"}
          </span>
        </div>

        {error ? (
          <p className="mt-4 rounded-md bg-flag-soft px-3 py-2 font-sans text-sm text-flag">
            {error}
          </p>
        ) : null}
      </div>

      {loading ? (
        <p className="mt-8 text-center font-serif italic text-muted">
          Reading the fine print so you don't have to…
        </p>
      ) : null}

      {result ? <Result result={result} /> : null}
    </div>
  );
}
