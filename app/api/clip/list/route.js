import { NextResponse } from "next/server";
import { listJobs } from "@/lib/clipStore.js";

export async function GET() {
  const jobs = await listJobs();
  jobs.sort((a, b) => b.updatedAt - a.updatedAt); // newest first
  return NextResponse.json({ jobs });
}
