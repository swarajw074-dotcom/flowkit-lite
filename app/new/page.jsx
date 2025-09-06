
export default function NewFlow() {
  return (
    <div>
      <h1>Create Flow</h1>
      <form action="/flow/create" method="post">
        <input name="name" placeholder="My Flow" style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }} />
        <button style={{ marginLeft: 8, padding: "8px 12px", borderRadius: 8, border: "1px solid #111", background: "#111", color: "#fff" }}>Create</button>
      </form>
      <p style={{ marginTop: 12 }}>
        or <a href="/">go back</a>
      </p>
    </div>
  );
}
