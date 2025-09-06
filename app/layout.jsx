import './globals.css';
export const metadata = { title: "Flowkit Lite", description: "Minimal n8n-like workflow builder" };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
