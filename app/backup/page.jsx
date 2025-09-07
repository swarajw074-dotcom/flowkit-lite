"use client";
import { useState } from "react";

export default function BackupPage() {
  const [msg, setMsg] = useState("");

  async function doExport() {
    const r = await fetch("/api/backup");
    const j = await r.json();
    const blob = new Blob([JSON.stringify(j, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "flows-backup.json";
    a.click();
    setMsg("Downloaded flows-backup.json");
  }

  async function doImport(file) {
    const text = await file.text();
    const j = JSON.parse(text);
    const r = await fetch("/api/backup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(j.flows ? j : { flows: j }),
    });
    const jr = await r.json();
    setMsg(r.ok ? `Imported ${jr.count} flows` : `Import error: ${jr.error || r.status}`);
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h1>Backup & Restore</h1>
      <p>Export your flows as JSON and restore them later if Render resets the free storage.</p>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={doExport}>Download flows-backup.json</button>
        <label style={{ border: "1px solid #ddd", padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}>
          Import JSON…
          <input type="file" accept="application/json" onChange={(e) => e.target.files?.[0] && doImport(e.target.files[0])} style={{ display: "none" }} />
        </label>
        <a href="/" style={{ marginLeft: "auto" }}>← Home</a>
      </div>
      <div style={{ marginTop: 12, color: "#666" }}>{msg}</div>
    </div>
  );
}
