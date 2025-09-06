
import { NextResponse } from "next/server";
import { getFlow } from "@/lib/store.js";
import { runFlowById } from "@/lib/engine.js";
export async function POST(req, { params }) {
  const flow = await getFlow(params.id);
  if (!flow) return NextResponse.json({ error: "Flow not found" }, { status: 404 });
  const key = req.nextUrl.searchParams.get("key");
  if (!key || key !== flow.webhookSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let payload = null; try { payload = await req.json(); } catch {}
  const runId = await runFlowById(flow.id, payload);
  return NextResponse.json({ ok: true, runId });
}
export async function GET(req, ctx) { return POST(req, ctx); }
