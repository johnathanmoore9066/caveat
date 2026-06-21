import { NextRequest, NextResponse } from "next/server";
import { analyzeDocument } from "@/lib/anthropic";
import { saveFlags } from "@/lib/db";

export const runtime = "nodejs";
// Vercel's Hobby (free) tier caps serverless functions at 60s. Pro raises this
// to 300s — bump this if you upgrade and want headroom for very long documents.
export const maxDuration = 60;

interface Body {
  documentType?: string;
  text?: string;
  pdfBase64?: string;
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const documentType = body.documentType || "other";
  const text = body.text?.trim();
  const pdfBase64 = body.pdfBase64;

  if (!text && !pdfBase64) {
    return NextResponse.json(
      { error: "Please paste some text or upload a document first." },
      { status: 400 },
    );
  }

  if (text && text.length < 40) {
    return NextResponse.json(
      { error: "That looks a little short — paste the full document so the read is useful." },
      { status: 400 },
    );
  }

  // ── PAYMENT GATE ──────────────────────────────────────────────────────────
  // Payments are off by default so the app runs out of the box. When you wire
  // up Stripe (see TRANSFER.md), verify the payment here and return 402 if the
  // caller hasn't paid. Left intentionally open for now.
  // ──────────────────────────────────────────────────────────────────────────

  try {
    const result = await analyzeDocument({ documentType, text, pdfBase64 });
    // Contribute the findings to the searchable database (fire-and-forget).
    saveFlags(result).catch(() => {});
    return NextResponse.json({ result });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
