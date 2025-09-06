import { NextResponse } from "next/server";
import { createFlow } from "@/lib/store.js";

export async function POST(req) {
  const form = await req.formData();
  const name = (form.get("name") || "").toString().trim() || "Untitled Flow";
  const flow = await createFlow(name);

  // Use a relative redirect so the browser keeps the same domain (works on Render)
  return NextResponse.redirect(`/flow/${flow.id}`, 303);
}
