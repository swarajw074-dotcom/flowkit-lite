import { NextResponse } from "next/server";
import { listJobs } from "@/lib/clipStore.js";

// Make sure this route never caches
export const dynamic = "force-dynamic";

export async function GET() {
  const jobs = await listJobs();
  jobs.sort((a, b) => b.updatedAt - a.updatedAt);
  return NextResponse.json(
    { jobs },
    { headers: { "Cache-Control": "no-store, must-revalidate" } }
  );
}
