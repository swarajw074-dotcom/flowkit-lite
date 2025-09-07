import fs from "fs-extra";
import path from "path";
import { v4 as uuid } from "uuid";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const CLIPS_FILE = path.join(DATA_DIR, "clips.json");

async function ensure() {
  await fs.ensureDir(DATA_DIR);
  if (!(await fs.pathExists(CLIPS_FILE))) {
    await fs.writeJson(CLIPS_FILE, { jobs: [] }, { spaces: 2 });
  }
}
export async function listJobs() {
  await ensure();
  return (await fs.readJson(CLIPS_FILE)).jobs || [];
}
export async function addJob(url, options = {}) {
  await ensure();
  const db = await fs.readJson(CLIPS_FILE);
  const job = {
    id: uuid(),
    url: String(url),
    options: {
      topK: options.topK ?? 2,
      winSec: options.winSec ?? 45,
      model: options.model ?? "small"
    },
    status: "queued",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    outputs: [],
    error: null,
    workerId: null
  };
  db.jobs.push(job);
  await fs.writeJson(CLIPS_FILE, db, { spaces: 2 });
  return job;
}
export async function claimNextJob(workerSecret) {
  await ensure();
  const db = await fs.readJson(CLIPS_FILE);
  const job = db.jobs.find(j => j.status === "queued");
  if (!job) return null;
  job.status = "claimed";
  job.workerId = workerSecret ? "w:" + workerSecret.slice(0, 6) : "worker";
  job.updatedAt = Date.now();
  await fs.writeJson(CLIPS_FILE, db, { spaces: 2 });
  return job;
}
export async function reportJob(id, patch) {
  await ensure();
  const db = await fs.readJson(CLIPS_FILE);
  const idx = db.jobs.findIndex(j => j.id === id);
  if (idx === -1) return null;
  db.jobs[idx] = {
    ...db.jobs[idx],
    ...patch,
    id,
    updatedAt: Date.now()
  };
  await fs.writeJson(CLIPS_FILE, db, { spaces: 2 });
  return db.jobs[idx];
}
