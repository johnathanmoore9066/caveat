import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { neon } from "@neondatabase/serverless";
import type { AnalysisResult, FlagRecord } from "@/lib/types";

/**
 * Store for the searchable red-flag database.
 *
 * Two backends, picked automatically:
 *   • If DATABASE_URL is set  → hosted Postgres (Neon). Use this in production.
 *   • If it's not set         → a local JSON file under /data, so the app runs
 *                               with zero setup for local development.
 *
 * The whole app only depends on the two exported functions at the bottom —
 * saveFlags() and searchFlags(). Swapping databases means changing this file
 * and nothing else. See TRANSFER.md §5.
 */

const usingPostgres = !!process.env.DATABASE_URL;

// ── Postgres (Neon) backend ────────────────────────────────────────────────

const sql = usingPostgres ? neon(process.env.DATABASE_URL!) : null;

// Run the schema setup once per server instance.
let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!sql) return Promise.resolve();
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS flag_records (
          id            TEXT PRIMARY KEY,
          counterparty  TEXT NOT NULL,
          document_type TEXT NOT NULL,
          red_flags     JSONB NOT NULL,
          created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_flag_counterparty
        ON flag_records (lower(counterparty))
      `;
    })().catch((err) => {
      // Reset so a later call can retry instead of being stuck on a failed promise.
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

interface FlagRow {
  id: string;
  counterparty: string;
  document_type: string;
  red_flags: FlagRecord["redFlags"];
  created_at: string | Date;
}

function rowToRecord(row: FlagRow): FlagRecord {
  return {
    id: row.id,
    counterparty: row.counterparty,
    documentType: row.document_type,
    redFlags: row.red_flags,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(row.created_at).toISOString(),
  };
}

async function pgSave(result: AnalysisResult, counterparty: string) {
  await ensureSchema();
  await sql!`
    INSERT INTO flag_records (id, counterparty, document_type, red_flags)
    VALUES (
      ${crypto.randomUUID()},
      ${counterparty},
      ${result.documentType},
      ${JSON.stringify(result.redFlags)}::jsonb
    )
  `;
}

async function pgSearch(q: string): Promise<FlagRecord[]> {
  await ensureSchema();
  const rows = (await sql!`
    SELECT id, counterparty, document_type, red_flags, created_at
    FROM flag_records
    WHERE counterparty ILIKE ${"%" + q + "%"}
    ORDER BY created_at DESC
    LIMIT 50
  `) as FlagRow[];
  return rows.map(rowToRecord);
}

// ── File backend (local dev fallback) ──────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "flags.json");

async function fileReadAll(): Promise<FlagRecord[]> {
  try {
    return JSON.parse(await fs.readFile(DB_FILE, "utf8")) as FlagRecord[];
  } catch {
    return [];
  }
}

async function fileSave(result: AnalysisResult, counterparty: string) {
  const records = await fileReadAll();
  records.push({
    id: crypto.randomUUID(),
    counterparty,
    documentType: result.documentType,
    redFlags: result.redFlags,
    createdAt: new Date().toISOString(),
  });
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(records, null, 2), "utf8");
}

async function fileSearch(q: string): Promise<FlagRecord[]> {
  const records = await fileReadAll();
  const lower = q.toLowerCase();
  return records
    .filter((r) => r.counterparty.toLowerCase().includes(lower))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

// ── Public API ──────────────────────────────────────────────────────────────

/** Save the red flags from an analysis, keyed by counterparty, for later search. */
export async function saveFlags(result: AnalysisResult): Promise<void> {
  const counterparty = result.counterparty?.trim();
  // Nothing useful to search on, or no flags found — skip.
  if (!counterparty || result.redFlags.length === 0) return;
  if (usingPostgres) {
    await pgSave(result, counterparty);
  } else {
    await fileSave(result, counterparty);
  }
}

/** Case-insensitive substring search over counterparty names. */
export async function searchFlags(query: string): Promise<FlagRecord[]> {
  const q = query.trim();
  if (!q) return [];
  return usingPostgres ? pgSearch(q) : fileSearch(q);
}
