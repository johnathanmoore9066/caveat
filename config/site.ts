/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SITE CONFIG — the one file a new owner edits when this project is sold.
 *  Nothing here is secret (no API keys, no payment secrets — those live in
 *  environment variables; see .env.example and TRANSFER.md).
 *
 *  Change the brand, pricing, and contact details below and the whole site
 *  updates. Search the codebase for "siteConfig" to see where it's used.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const siteConfig = {
  /** Public-facing brand name. Shown in the header, footer, and page titles. */
  name: "Caveat",

  /** One-line tagline under the logo / in the hero. */
  tagline: "Know what you're signing — in plain English.",

  /** Longer hero subhead. */
  description:
    "Paste a contract or upload a PDF. Get a clear, friendly breakdown of who it benefits, what you're agreeing to, and the red flags worth a second look — before you sign.",

  /** Domain (no protocol). Used for canonical links and copy. Update after you buy one. */
  domain: "projectcaveat.org",

  /** Where support / disclosure emails go. */
  contactEmail: "johnathanmoore@element-fusion.org",

  /** Legal entity or person operating the site (shown in the disclosure page). */
  operator: "The site operator",

  /**
   * Pricing, in whole US dollars. Set readPrice to 0 to run everything free.
   * Currently 0 for the "free while in testing" launch phase — when you're
   * ready to charge, set readPrice to 5 (and wire up Stripe; see TRANSFER.md §4).
   */
  pricing: {
    /** Price to analyze one document. 0 = free. */
    readPrice: 0,
    /** Price to run a counterparty red-flag search. Suggested: half the read price. */
    searchPrice: 0,
    currency: "USD",
  },

  /**
   * Document types offered in the dropdown. The `value` is passed to the AI so
   * it can tune what it watches for; the `label` is what the user sees.
   */
  documentTypes: [
    { value: "lease", label: "Lease / rental agreement" },
    { value: "employment", label: "Employment offer" },
    { value: "contractor", label: "Freelance / contractor agreement" },
    { value: "nda", label: "NDA / confidentiality" },
    { value: "phone", label: "Phone / carrier plan" },
    { value: "auto", label: "Auto loan / financing" },
    { value: "tos", label: "Terms of service" },
    { value: "membership", label: "Gym / membership / subscription" },
    { value: "other", label: "Something else" },
  ],
} as const;

export type DocumentTypeValue = (typeof siteConfig.documentTypes)[number]["value"];
