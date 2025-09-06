
"use client";
import { useEffect, useState } from "react";
export default function Home() {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/flows", { cache: "no-store" }).then(async (r) => {
      const data = await r.json();
      setFlows(data.flows || []);
      setLoading(false);
    });
  }, []);
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Your Flows</h1>
      {loading ? (
        <div>Loading…</div>
      ) : flows.length === 0 ? (
        <div>No flows yet. <a href="/new">Create one</a>.</div>
      ) : (
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {flows.map((f) => (
            <a key={f.id} href={`/flow/${f.id}`} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, textDecoration: "none", color: "#111", background: "#fff" }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{f.name}</div>
              <div style={{ fontSize: 12, color: "#666" }}>Updated {new Date(f.updatedAt).toLocaleString()}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
