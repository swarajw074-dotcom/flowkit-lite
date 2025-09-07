import { NextResponse } from "next/server";
import { addJob } from "@/lib/clipStore.js";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const url = (body.url || "").toString().trim();
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

  const job = await addJob(url, {
    topK: Number(body.topK ?? 2),
    winSec: Number(body.winSec ?? 45),
    model: (body.model || "small").toString(),
  });

  return NextResponse.json({ ok: true, job });
}
