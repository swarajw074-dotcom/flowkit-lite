
import fs from "fs-extra";
import path from "path";
import { v4 as uuid } from "uuid";
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const FLOWS_FILE = path.join(DATA_DIR, "flows.json");
const RUNS_FILE = path.join(DATA_DIR, "runs.json");
async function ensureFiles() {
  await fs.ensureDir(DATA_DIR);
  if (!(await fs.pathExists(FLOWS_FILE))) await fs.writeJson(FLOWS_FILE, { flows: [] }, { spaces: 2 });
  if (!(await fs.pathExists(RUNS_FILE))) await fs.writeJson(RUNS_FILE, { runs: [] }, { spaces: 2 });
}
export async function listFlows() { await ensureFiles(); return (await fs.readJson(FLOWS_FILE)).flows || []; }
export async function getFlow(id) { const flows = await listFlows(); return flows.find((f) => f.id === id) || null; }
export async function createFlow(name) {
  await ensureFiles();
  const flow = { id: uuid(), name, nodes: [], edges: [], webhookSecret: uuid().replace(/-/g, ""), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  const db = await fs.readJson(FLOWS_FILE); db.flows.push(flow); await fs.writeJson(FLOWS_FILE, db, { spaces: 2 }); return flow;
}
export async function saveFlow(id, patch) {
  await ensureFiles();
  const db = await fs.readJson(FLOWS_FILE);
  const idx = db.flows.findIndex((f) => f.id === id);
  if (idx === -1) return null;
  db.flows[idx] = { ...db.flows[idx], ...patch, id, updatedAt: new Date().toISOString() };
  await fs.writeJson(FLOWS_FILE, db, { spaces: 2 });
  return db.flows[idx];
}
export async function upsertFlow(id, patch) {
  await ensureFiles();
  const db = await fs.readJson(FLOWS_FILE);
  const idx = db.flows.findIndex((f) => f.id === id);

  if (idx === -1) {
    const flow = {
      id,
      name: patch?.name ?? "Recovered Flow",
      nodes: patch?.nodes ?? [],
      edges: patch?.edges ?? [],
      webhookSecret: uuid().replace(/-/g, ""),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.flows.push(flow);
    await fs.writeJson(FLOWS_FILE, db, { spaces: 2 });
    return flow;
  } else {
    db.flows[idx] = { ...db.flows[idx], ...patch, id, updatedAt: new Date().toISOString() };
    await fs.writeJson(FLOWS_FILE, db, { spaces: 2 });
    return db.flows[idx];
  }
}
export async function deleteFlow(id) {
  await ensureFiles();
  const db = await fs.readJson(FLOWS_FILE);
  db.flows = db.flows.filter((f) => f.id !== id);
  await fs.writeJson(FLOWS_FILE, db, { spaces: 2 });
}
export async function addRun(run) { await ensureFiles(); const db = await fs.readJson(RUNS_FILE); db.runs.push(run); await fs.writeJson(RUNS_FILE, db, { spaces: 2 }); }
export async function updateRun(run) {
  await ensureFiles();
  const db = await fs.readJson(RUNS_FILE);
  const idx = db.runs.findIndex((r) => r.id === run.id);
  if (idx !== -1) db.runs[idx] = run;
  await fs.writeJson(RUNS_FILE, db, { spaces: 2 });
}
export async function getRun(id) { await ensureFiles(); const db = await fs.readJson(RUNS_FILE); return (db.runs || []).find((r) => r.id === id) || null; }
