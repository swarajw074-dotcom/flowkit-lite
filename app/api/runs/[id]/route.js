
import { NextResponse } from "next/server";
import { getRun } from "@/lib/store.js";
export async function GET(req, { params }) {
  const run = await getRun(params.id);
  if (!run) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(run);
}
