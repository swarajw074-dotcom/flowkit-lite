export const metadata = {
  title: "Flowkit Lite",
  description: "Minimal n8n-like workflow builder",
};

// Global CSS imports
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Force-load React Flow CSS from CDN */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/reactflow@11.10.4/dist/style.css"
        />
        {/* Fallback styling in case CDN is blocked */}
        <style>{`
          .react-flow__node { position:absolute; background:#fff; border:1px solid #ddd; border-radius:8px; padding:8px 10px; color:#111; font-size:12px; box-shadow:0 1px 2px rgba(0,0,0,.06); }
          .react-flow__handle { width:8px; height:8px; background:#111; border-radius:50%; }
          .react-flow__edge-path { stroke:#999; stroke-width:1.5; fill:none; }
        `}</style>
      </head>
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
        <div style={{ padding: 16, borderBottom: "1px solid #eee", display: "flex", gap: 12 }}>
          <a href="/" style={{ fontWeight: 700, color: "#111", textDecoration: "none" }}>Flowkit Lite</a>
          <a href="/new" style={{ color: "#111", textDecoration: "none" }}>+ New Flow</a>
          <a href="https://github.com/" target="_blank" style={{ marginLeft: "auto", color: "#666", textDecoration: "none" }}>Docs</a>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
      </body>
    </html>
  );
}
