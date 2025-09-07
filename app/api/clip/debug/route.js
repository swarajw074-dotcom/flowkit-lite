import { NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";

export async function GET() {
  const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
  const CLIPS_FILE = path.join(DATA_DIR, "clips.json");
  const exists = await fs.pathExists(CLIPS_FILE);
  let content = null, error = null;
  if (exists) {
    try { content = await fs.readJson(CLIPS_FILE); } catch (e) { error = String(e); }
  }
  return NextResponse.json({
    DATA_DIR,
    CLIPS_FILE,
    exists,
    content,
    error
  }, { headers: { "Cache-Control": "no-store" } });
}
