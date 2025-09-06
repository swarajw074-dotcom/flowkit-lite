
import { v4 as uuid } from "uuid";
import { getFlow, addRun, updateRun } from "@/lib/store.js";
function log(ctx, msg) { ctx.logs.push(msg); console.log(msg); }
function nextNodes(edges, id) { return edges.filter((e) => e.source === id).map((e) => e.target); }
async function execNode(node, ctx) {
  const label = (node.data || {}).label;
  switch (label) {
    case "Webhook Trigger": log(ctx, `Trigger: Webhook`); return ctx.lastResult;
    case "HTTP Request": {
      const d = node.data || {};
      const method = (d.method || "GET").toUpperCase();
      const url = String(d.url || "");
      const body = d.body ? JSON.stringify(d.body) : undefined;
      const headers = { "Content-Type": "application/json", ...(d.headers || {}) };
      log(ctx, `HTTP ${method} ${url}`);
      const res = await fetch(url, { method, headers, body });
      const text = await res.text();
      try { return JSON.parse(text); } catch { return text; }
    }
    case "Set Variables": {
      const d = node.data || {};
      (d.kv || []).forEach((pair) => (ctx.vars[pair.key] = pair.value));
      log(ctx, `Set vars: ${JSON.stringify(d.kv || [])}`);
      return ctx.vars;
    }
    case "Delay (ms)": {
      const ms = Number((node.data || {}).ms || 0);
      log(ctx, `Delay ${ms}ms`);
      await new Promise((r) => setTimeout(r, ms));
      return ctx.lastResult;
    }
    case "Code (async JS)": {
      const code = String((node.data || {}).code || "return null");
      log(ctx, "Run code");
      const fn = new Function("ctx", "\"use strict\"; return (async () => { " + code + " })()");
      return fn({ ...ctx });
    }
    default: log(ctx, `Node: ${label ?? node.id}`); return ctx.lastResult;
  }
}
function findStartNodes(nodes, edges) {
  const withIncoming = new Set(edges.map((e) => e.target));
  return nodes.filter((n) => !withIncoming.has(n.id));
}
export async function runFlowById(flowId, webhookPayload) {
  const flow = await getFlow(flowId);
  if (!flow) throw new Error("Flow not found");
  const run = { id: uuid(), flowId, status: "queued", startedAt: Date.now(), logs: [] };
  await addRun(run);
  const ctx = { vars: {}, lastResult: webhookPayload, logs: run.logs };
  try {
    run.status = "running"; await updateRun(run);
    const visited = new Set(); const toVisit = []; findStartNodes(flow.nodes, flow.edges).forEach((n) => toVisit.push(n.id));
    while (toVisit.length) {
      const id = toVisit.shift(); if (visited.has(id)) continue; visited.add(id);
      const node = flow.nodes.find((n) => n.id === id); if (!node) continue;
      const result = await execNode(node, ctx); ctx.lastResult = result;
      nextNodes(flow.edges, id).forEach((nid) => toVisit.push(nid));
    }
    run.status = "completed"; run.finishedAt = Date.now(); await updateRun(run); return run.id;
  } catch (err) {
    run.status = "failed"; run.error = String(err?.message || err); run.finishedAt = Date.now(); await updateRun(run); return run.id;
  }
}
