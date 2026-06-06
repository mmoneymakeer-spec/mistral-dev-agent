import { useState, useEffect, useRef } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api/agent";
const catIcon = { js:"⚡", jsx:"⚛️", py:"🐍", html:"🌐", css:"🎨", json:"📋", sql:"🗄️", md:"📝", yml:"⚙️" };

export default function App() {
  const [messages, setMessages] = useState([
    { role: "agent", text: "Bonjour ! Je suis Mistral Dev Agent. Décris ta tâche et je génère le code complet." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [tab, setTab] = useState("chat");
  const [apiKey, setApiKey] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const fetchFiles = async () => {
    try {
      const r = await fetch(`${API}/files`);
      const d = await r.json();
      setFiles(d.files || []);
    } catch {}
  };

  const fetchLogs = async () => {
    try {
      const r = await fetch(`${API}/logs?limit=30`);
      const d = await r.json();
      setLogs(d.logs || []);
    } catch {}
  };

  const sendTask = async () => {
    if (!input.trim() || loading) return;
    const task = input.trim();
    setInput("");
    setLoading(true);
    setMessages(m => [...m, { role: "user", text: task }]);
    setMessages(m => [...m, { role: "thinking", text: "Agent en train de coder..." }]);

    try {
      const r = await fetch(`${API}/task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, apiKey: apiKey || undefined })
      });
      const d = await r.json();
      setMessages(m => m.filter(x => x.role !== "thinking"));

      if (d.success) {
        const clean = d.response.replace(/---FILE:[\s\S]*?---END---/g, "").trim();
        if (clean) setMessages(m => [...m, { role: "agent", text: clean }]);
        if (d.filesCount > 0) {
          setMessages(m => [...m, { role: "system", text: `✅ ${d.filesCount} fichier(s) généré(s)` }]);
          await fetchFiles();
          setTab("files");
        }
      } else {
        setMessages(m => [...m, { role: "error", text: d.error || "Erreur inconnue" }]);
      }
      await fetchLogs();
    } catch (err) {
      setMessages(m => m.filter(x => x.role !== "thinking"));
      setMessages(m => [...m, { role: "error", text: err.message }]);
    }
    setLoading(false);
  };

  const openFile = async (name) => {
    try {
      const r = await fetch(`${API}/files/${name}`);
      const d = await r.json();
      setSelectedFile(d);
    } catch {}
  };

  const clearAll = async () => {
    await fetch(`${API}/workspace`, { method: "DELETE" });
    setFiles([]);
    setSelectedFile(null);
    setLogs([]);
    setMessages([{ role: "agent", text: "Workspace effacé. Prêt pour un nouveau projet !" }]);
  };

  const tabStyle = (active) => ({
    flex: 1, padding: "6px 4px", fontSize: 12, border: "none",
    borderRadius: 6, cursor: "pointer",
    background: active ? "white" : "transparent",
    fontWeight: active ? 500 : 400,
    color: active ? "#111" : "#666"
  });

  const msgStyle = (role) => {
    const base = { padding: "8px 12px", borderRadius: 8, fontSize: 13, maxWidth: "85%", lineHeight: 1.6 };
    if (role === "user") return { ...base, background: "#E6F1FB", color: "#0C447C", alignSelf: "flex-end" };
    if (role === "system") return { ...base, background: "#EAF3DE", color: "#3B6D11", alignSelf: "center", fontSize: 11 };
    if (role === "error") return { ...base, background: "#FCEBEB", color: "#A32D2D", alignSelf: "flex-start" };
    return { ...base, background: "#f5f5f3", color: "#111", alignSelf: "flex-start", border: "0.5px solid #e0e0dd", whiteSpace: "pre-wrap" };
  };

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 900, margin: "0 auto", padding: 16, background: "#f8f8f6", minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, background: "#E24B4A", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Mistral Dev
