import { NextResponse } from "next/server";
import { createFlow } from "@/lib/store.js";

export async function POST(req) {
  const form = await req.formData();
  const name = (form.get("name") || "").toString().trim() || "Untitled Flow";
  const flow = await createFlow(name);

  // Build absolute URL from proxy headers (works on Render)
  const h = req.headers;
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  const url = `${proto}://${host}/flow/${flow.id}`;

  return NextResponse.redirect(url, 303);
}
