import { NextResponse } from "next/server";
import { runDrySync } from "@/lib/sync/dry-run";

export const runtime = "nodejs";

function isAuthorized(request: Request) {
  const secret = process.env.SYNC_SECRET;
  const header = request.headers.get("authorization");

  if (!secret) {
    return false;
  }

  return header === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runDrySync();
  return NextResponse.json(result);
}
