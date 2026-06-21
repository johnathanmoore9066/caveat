export type Severity = "low" | "medium" | "high";

export interface RedFlag {
  title: string;
  explanation: string;
  severity: Severity;
}

export interface AnalysisResult {
  /** Echo of the document type the user selected. */
  documentType: string;
  /**
   * The company or party offering this contract (e.g. "Verizon", "WeWork").
   * Empty string if it can't be determined. Used as the key for the
   * red-flag search database.
   */
  counterparty: string;
  /** Plain explanation of who the contract favors and why. */
  whoBenefits: string;
  /** Brief bullet summary of the whole document. */
  summary: string[];
  /** Everything the user is being asked to sign, initial, or agree to. */
  signatures: string[];
  /** The red flags worth a second look. */
  redFlags: RedFlag[];
  /** Big-picture, "in my opinion" closing take. */
  opinion: string;
}

/** A row stored in the searchable red-flag database. */
export interface FlagRecord {
  id: string;
  counterparty: string;
  documentType: string;
  redFlags: RedFlag[];
  createdAt: string;
}
