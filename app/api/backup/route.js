import { NextResponse } from "next/server";
import { listFlows, setAllFlows } from "@/lib/store.js";

export async function GET() {
  const flows = await listFlows();
  return NextResponse.json({ flows });
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const flows = Array.isArray(body.flows) ? body.flows : [];
  if (!Array.isArray(flows)) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  await setAllFlows(flows);
  return NextResponse.json({ ok: true, count: flows.length });
}
