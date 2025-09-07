"use client";
import { useEffect, useState } from "react";

export default function ClipPage() {
  const [url, setUrl] = useState("");
  const [topK, setTopK] = useState(2);
  const [winSec, setWinSec] = useState(45);
  const [model, setModel] = useState("small");
  const [msg, setMsg] = useState("");
  const [jobs, setJobs] = useState([]);

  async function load() {
    try {
      const r = await fetch("/api/clip/list?ts=" + Date.now(), { cache: "no-store" });
      const j = await r.json();
      setJobs(j.jobs || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function submit() {
    if (!url.trim()) { setMsg("Paste a YouTube/Twitch link"); return; }
    setMsg("Submitting…");
    const r = await fetch("/api/clip/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, topK, winSec, model })
    });
    const j = await r.json();
    setMsg(r.ok ? "Submitted" : (j.error || "Error"));
    setUrl("");
    load();
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      <h1>Make Clips</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Paste YouTube or Twitch URL"
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
        <button onClick={submit}>Submit</button>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
        <label>Clips:
          <input type="number" min={1} max={5} value={topK} onChange={e=>setTopK(+e.target.value)} style={{ width: 60, marginLeft: 6 }} />
        </label>
        <label>Length (sec):
          <input type="number" min={15} max={120} value={winSec} onChange={e=>setWinSec(+e.target.value)} style={{ width: 80, marginLeft: 6 }} />
        </label>
        <label>Model:
          <select value={model} onChange={e=>setModel(e.target.value)} style={{ marginLeft: 6 }}>
            <option value="small">whisper-small</option>
            <option value="medium">whisper-medium</option>
          </select>
        </label>
        <span style={{ color: "#666" }}>{msg}</span>
        <a href="/" style={{ marginLeft: "auto" }}>← Home</a>
      </div>

      <h3 style={{ marginTop: 20 }}>Recent Jobs</h3>
      <div style={{ display: "grid", gap: 8 }}>
        {jobs.map(j => (
          <div key={j.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 10, background:"#fff" }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{j.url}</div>
            <div style={{ fontSize: 12, color:"#666" }}>
              {j.status} · {new Date(j.updatedAt).toLocaleString()}
            </div>
            {j.outputs?.length ? (
              <ul style={{ marginTop: 8 }}>
                {j.outputs.map((o,i)=>(
                  <li key={i}>
                    {o.url
                      ? <a href={o.url} target="_blank" rel="noreferrer">{o.label || o.url}</a>
                      : <span>{o.label || o.local || "output"}</span>}
                  </li>
                ))}
              </ul>
            ) : null}
            {j.error ? <div style={{ color: "crimson", marginTop: 6 }}>Error: {j.error}</div> : null}
          </div>
        ))}
        {!jobs.length && <div style={{ color:"#666" }}>No jobs yet. Paste a link above and click Submit.</div>}
      </div>
    </div>
  );
}
