"use client";

import React, { useCallback, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  Controls,
  Background,
  MiniMap
} from "reactflow";

function Editor({ flowId, initialFlow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow?.nodes ?? []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow?.edges ?? []);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const onConnect = useCallback(
    (conn) => setEdges((eds) => addEdge({ ...conn, animated: false }, eds)),
    [setEdges]
  );

  const addNode = (type) => {
    const idx = nodes.length;
    const id = Math.random().toString(36).slice(2);
    const position = { x: 120 + idx * 160, y: 120 + idx * 40 };
    const map = {
      Webhook: { label: "Webhook Trigger" },
      HTTP: { label: "HTTP Request", method: "GET", url: "https://api.github.com" },
      Set: { label: "Set Variables", kv: [{ key: "foo", value: "bar" }] },
      Delay: { label: "Delay (ms)", ms: 1000 },
      Code: { label: "Code (async JS)", code: "return { now: Date.now() }" }
    };
    const data = map[type] ?? { label: type };
    setNodes((nds) => nds.concat({ id, type: "default", position, data }));
  };

  async function save() {
    setSaving(true);
    setStatus("Saving…");
    const res = await fetch(`/api/flows/${flowId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodes, edges })
    });
    setSaving(false);
    setStatus(res.ok ? "Saved" : "Error saving");
    setTimeout(() => setStatus(""), 1200);
  }

  async function run() {
    await save();
    setStatus("Running…");
    const r = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flowId })
    });
    const j = await r.json();
    setStatus(`Run started: ${j.runId}`);
    const t = setInterval(async () => {
      const s = await fetch(`/api/runs/${j.runId}`);
      const js = await s.json();
      setStatus(js.status + (js.error ? `: ${js.error}` : ""));
      if (js.status === "completed" || js.status === "failed") clearInterval(t);
    }, 800);
  }

  return (
    <div style={{ height: "72vh", border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        minZoom={0.2}
      >
        <Background />
        <MiniMap />
        <Controls />
        <Panel position="top-left">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => addNode("Webhook")}>+ Webhook</button>
            <button onClick={() => addNode("HTTP")}>+ HTTP</button>
            <button onClick={() => addNode("Set")}>+ Set</button>
            <button onClick={() => addNode("Delay")}>+ Delay</button>
            <button onClick={() => addNode("Code")}>+ Code</button>
            <button onClick={save} disabled={saving} style={{ marginLeft: 8 }}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={run} style={{ marginLeft: 8, background: "#111", color: "#fff" }}>
              Run
            </button>
            <span style={{ marginLeft: 12, color: "#666" }}>Nodes: {nodes.length} {status && `· ${status}`}</span>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default function FlowEditor(props) {
  return (
    <ReactFlowProvider>
      <Editor {...props} />
    </ReactFlowProvider>
  );
}
