
import { NextResponse } from "next/server";
import { getFlow, saveFlow } from "@/lib/store.js";
export async function GET(req, { params }) {
  const flow = await getFlow(params.id);
  if (!flow) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(flow);
}
export async function PUT(req, { params }) {
  const body = await req.json();
  const flow = await saveFlow(params.id, { nodes: body.nodes || [], edges: body.edges || [] });
  if (!flow) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, flow });
}
