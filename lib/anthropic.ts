import Anthropic from "@anthropic-ai/sdk";
import { siteConfig } from "@/config/site";
import type { AnalysisResult } from "@/lib/types";

const MODEL = "claude-opus-4-8";

/** Lazily construct the client so the app can boot without a key set. */
function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Copy .env.example to .env.local and add your key.",
    );
  }
  return new Anthropic({ apiKey });
}

function docTypeLabel(value: string): string {
  return (
    siteConfig.documentTypes.find((d) => d.value === value)?.label ?? "document"
  );
}

const SYSTEM_PROMPT = `You are a warm, plain-spoken guide who helps everyday people understand documents they're about to sign. You read contracts and explain them in clear, friendly, everyday English — the way a thoughtful friend would over coffee.

Your voice:
- Cordial, calm, and encouraging. Never alarmist, never condescending.
- Plain language. Avoid legalese; when a legal term is unavoidable, explain it in one short clause.
- Concrete and specific to THIS document. Quote or paraphrase the actual terms, don't speak in generalities.

Hard rules:
- You are NOT a lawyer and this is NOT legal advice. Do not say "you should" in a way that gives legal direction; instead describe what a term means and why someone might want a closer look. Never tell the user to sign or not sign.
- Do not invent terms that aren't in the document. If something important is missing or unclear, say so plainly.
- A "red flag" is anything that could cost the reader money, lock them in, waive their rights, or surprise them later. Rank severity honestly: high = could seriously hurt them, medium = worth understanding before signing, low = minor or common.

Return your analysis in the required structured format. Keep each piece tight and readable.`;

function buildInstruction(documentType: string): string {
  const label = docTypeLabel(documentType);
  return `Please read the following ${label} and break it down for someone who is about to sign it.

Cover, in plain English:
- Who this contract mainly benefits, and why.
- A short bullet summary of the whole thing.
- Everything the person is being asked to sign, initial, or agree to.
- The red flags worth a second look (with honest severity).
- A closing "in my opinion" take on the big picture of what they'd be agreeing to.

If you can tell which company or party is offering this contract, name them as the counterparty (e.g. the landlord's company, the carrier, the employer). If you can't tell, leave it blank.`;
}

const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    counterparty: {
      type: "string",
      description:
        "The company or party offering the contract, e.g. 'Verizon'. Empty string if unknown.",
    },
    whoBenefits: {
      type: "string",
      description: "Plain explanation of who the contract favors and why.",
    },
    summary: {
      type: "array",
      items: { type: "string" },
      description: "Brief bullet-point summary of the whole document.",
    },
    signatures: {
      type: "array",
      items: { type: "string" },
      description:
        "Everything the person is asked to sign, initial, or agree to.",
    },
    redFlags: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          explanation: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] },
        },
        required: ["title", "explanation", "severity"],
        additionalProperties: false,
      },
    },
    opinion: {
      type: "string",
      description: "Big-picture 'in my opinion' closing take.",
    },
  },
  required: [
    "counterparty",
    "whoBenefits",
    "summary",
    "signatures",
    "redFlags",
    "opinion",
  ],
  additionalProperties: false,
} as const;

interface AnalyzeInput {
  documentType: string;
  /** Pasted/typed contract text. */
  text?: string;
  /** A PDF, base64-encoded (no data: prefix). */
  pdfBase64?: string;
}

export async function analyzeDocument(
  input: AnalyzeInput,
): Promise<AnalysisResult> {
  const client = getClient();
  const instruction = buildInstruction(input.documentType);

  const content: Anthropic.ContentBlockParam[] = [];

  if (input.pdfBase64) {
    content.push({
      type: "document",
      source: {
        type: "base64",
        media_type: "application/pdf",
        data: input.pdfBase64,
      },
    });
    content.push({ type: "text", text: instruction });
  } else {
    content.push({
      type: "text",
      text: `${instruction}\n\n--- DOCUMENT START ---\n${input.text ?? ""}\n--- DOCUMENT END ---`,
    });
  }

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    output_config: {
      // "medium" keeps reads fast enough for the free tier's 60s function cap
      // while staying strong on this task. Bump to "high" for the most thorough
      // reads once you're on a plan with a longer timeout.
      effort: "medium",
      format: { type: "json_schema", schema: OUTPUT_SCHEMA },
    },
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content }],
  });

  if (response.stop_reason === "refusal") {
    throw new Error(
      "The analyzer declined to process this document. Please try a different file.",
    );
  }

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No analysis was returned. Please try again.");
  }

  const parsed = JSON.parse(textBlock.text) as Omit<
    AnalysisResult,
    "documentType"
  >;

  return { ...parsed, documentType: input.documentType };
}
