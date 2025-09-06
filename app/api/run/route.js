
import { NextResponse } from "next/server";
import { runFlowById } from "@/lib/engine.js";
export async function POST(req) {
  const { flowId, payload } = await req.json();
  if (!flowId) return NextResponse.json({ error: "flowId required" }, { status: 400 });
  const runId = await runFlowById(flowId, payload);
  return NextResponse.json({ runId });
}
