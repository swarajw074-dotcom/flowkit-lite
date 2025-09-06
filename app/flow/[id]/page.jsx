
import { notFound } from "next/navigation";
import { getFlow } from "@/lib/store.js";
import FlowEditor from "@/components/FlowEditor.jsx";
export default async function FlowPage({ params }) {
  const flow = await getFlow(params.id);
  if (!flow) return notFound();
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{flow.name}</h1>
      <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
        <a href={`/api/webhook/${flow.id}?key=${flow.webhookSecret}`} target="_blank" style={{ textDecoration: "none", color: "#06c" }}>
          Webhook URL
        </a>
        <code style={{ background: "#f5f5f5", padding: "4px 8px", borderRadius: 8 }}>{`/api/webhook/${flow.id}?key=${flow.webhookSecret}`}</code>
      </div>
      <FlowEditor flowId={flow.id} initialFlow={flow} />
    </div>
  );
}
