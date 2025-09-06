
import { NextResponse } from "next/server";
import { createFlow } from "@/lib/store.js";
export async function POST(req) {
  const form = await req.formData();
  const name = (form.get("name") || "").toString().trim() || "Untitled Flow";
  const flow = await createFlow(name);
  const url = new URL(`/flow/${flow.id}`, req.url);
  return NextResponse.redirect(url, 303);
}
