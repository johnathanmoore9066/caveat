import { NextRequest, NextResponse } from "next/server";
import { searchFlags } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") ?? "";
  if (!query.trim()) {
    return NextResponse.json({ records: [] });
  }
  const records = await searchFlags(query);
  return NextResponse.json({ records });
}
