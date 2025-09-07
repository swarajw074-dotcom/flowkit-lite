import { NextResponse } from "next/server";
import { reportJob } from "@/lib/clipStore.js";

export async function POST(req) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.CLIP_WORKER_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  if (!body?.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const job = await reportJob(body.id, {
    status: body.status || "completed",
    outputs: body.outputs || [],
    error: body.error || null,
  });

  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, job });
}
