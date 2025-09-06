
import { NextResponse } from "next/server";
import { listFlows } from "@/lib/store.js";
export async function GET() { const flows = await listFlows(); return NextResponse.json({ flows }); }
