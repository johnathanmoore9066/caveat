import { NextRequest, NextResponse } from "next/server";
import { analyzeDocument } from "@/lib/anthropic";
import { saveFlags } from "@/lib/db";

export const runtime = "nodejs";
// Vercel's Hobby (free) tier caps serverless functions at 60s. Pro raises this
// to 300s — bump this if you upgrade and want headroom for very long documents.
export const maxDuration = 60;

// Keep uploads under Vercel's ~4.5 MB request-body limit. Raw file bytes (not
// base64) go over the wire, so this is the real ceiling.
const MAX_FILE_BYTES = 4.4 * 1024 * 1024;

async function readInput(req: NextRequest): Promise<{
  documentType: string;
  text?: string;
  pdfBase64?: string;
  error?: string;
}> {
  const contentType = req.headers.get("content-type") ?? "";

  // File upload path: raw multipart, no base64 bloat over the wire.
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const documentType = String(form.get("documentType") ?? "other");
    const file = form.get("file");
    if (!file || typeof file === "string") {
      return { documentType, error: "No file was received." };
    }
    if (file.size > MAX_FILE_BYTES) {
      return {
        documentType,
        error:
          "That PDF is larger than 4 MB. Please paste the text instead, or upload a smaller file.",
      };
    }
    const buf = Buffer.from(await file.arrayBuffer());
    return { documentType, pdfBase64: buf.toString("base64") };
  }

  // Pasted / typed text path.
  const body = (await req.json()) as { documentType?: string; text?: string };
  return {
    documentType: body.documentType || "other",
    text: body.text?.trim(),
  };
}

export async function POST(req: NextRequest) {
  let input;
  try {
    input = await readInput(req);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (input.error) {
    return NextResponse.json({ error: input.error }, { status: 413 });
  }

  const { documentType, text, pdfBase64 } = input;

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
