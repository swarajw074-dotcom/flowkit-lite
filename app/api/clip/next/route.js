import { NextResponse } from "next/server";
import { claimNextJob } from "@/lib/clipStore.js";

export async function GET(req) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.CLIP_WORKER_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const job = await claimNextJob(secret);
  if (!job) return NextResponse.json({ noop: true });
  return NextResponse.json({ job });
}
