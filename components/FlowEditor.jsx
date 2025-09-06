
"use client";
import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, { addEdge, Background, Controls, MiniMap, ReactFlowProvider, Connection, useEdgesState, useNodesState } from "reactflow";
import "reactflow/dist/style.css";
function EditorInner({ flowId, initialFlow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow.edges || []);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const onConnect = useCallback((conn) => setEdges((eds) => addEdge({ ...conn, animated: false }, eds)), [setEdges]);
  const save = useCallback(async () => {
    setSaving(true);
    setStatus("Saving…");
    const res = await fetch(`/api/flows/${flowId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodes, edges }),
    });
    setSaving(false);
    setStatus(res.ok ? "Saved" : "Error saving");
    setTimeout(() => setStatus(""), 1200);
  }, [nodes, edges, flowId]);
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") { e.preventDefault(); void save(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);
  const addNode = (type) => {
    const id = Math.random().toString(36).slice(2);
    const position = { x: Math.random() * 400, y: Math.random() * 300 };
    const base = { id, type: "default", position, data: { label: type } };
    let node = base;
    if (type === "Webhook") node = { ...base, data: { label: "Webhook Trigger" } };
    if (type === "HTTP") node = { ...base, data: { label: "HTTP Request", method: "GET", url: "https://api.github.com" } };
    if (type === "Set") node = { ...base, data: { label: "Set Variables", kv: [{ key: "foo", value: "bar" }] } };
    if (type === "Delay") node = { ...base, data: { label: "Delay (ms)", ms: 1000 } };
    if (type === "Code") node = { ...base, data: { label: "Code (async JS)", code: "return { now: Date.now() }" } };
    setNodes((nds) => nds.concat(node));
  };
  const run = async () => {
    await save();
    setStatus("Running…");
    const r = await fetch(`/api/run`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ flowId }) });
    const j = await r.json();
    setStatus(`Run started: ${j.runId}`);
    const t = setInterval(async () => {
      const s = await fetch(`/api/runs/${j.runId}`);
      const js = await s.json();
      setStatus(js.status + (js.error ? `: ${js.error}` : ""));
      if (js.status === "completed" || js.status === "failed") clearInterval(t);
    }, 1000);
  };
  return (
    <div style={{ height: "72vh", border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView minZoom={0.2}>
        <Background /><MiniMap /><Controls />
        <div style={{ position: "absolute", left: 8, top: 8, display: "flex", gap: 8, flexWrap: "wrap", background:"rgba(255,255,255,.9)", padding:8, borderRadius:8 }}>
          <button onClick={() => addNode("Webhook")}>+ Webhook</button>
          <button onClick={() => addNode("HTTP")}>+ HTTP</button>
          <button onClick={() => addNode("Set")}>+ Set</button>
          <button onClick={() => addNode("Delay")}>+ Delay</button>
          <button onClick={() => addNode("Code")}>+ Code</button>
          <button onClick={save} disabled={saving} style={{ marginLeft: 8 }}>{saving ? "Saving…" : "Save"}</button>
          <button onClick={run} style={{ marginLeft: 8, background: "#111", color: "#fff" }}>Run</button>
          <span style={{ marginLeft: 12, color: "#666" }}>{status}</span>
        </div>
      </ReactFlow>
    </div>
  );
}
export default function FlowEditor(props) {
  return (<ReactFlowProvider><EditorInner {...props} /></ReactFlowProvider>);
}
