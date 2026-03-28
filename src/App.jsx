import { useState, useRef, useEffect } from "react";

const SUGGESTED = [
  "What's your fintech background?",
  "Tell me about your work at BECU",
  "What roles are you targeting?",
  "Walk me through your biggest win",
  "What's the Product Navigator?",
  "Do you have people leadership experience?",
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text) {
    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setStarted(true);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const reply =
        data.content?.[0]?.text ||
        "I couldn't get a response right now. Please try again.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim() && !loading) sendMessage(input.trim());
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !loading) sendMessage(input.trim());
    }
  }

  return (
    <div className="app">
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="avatar-ring">
            <div className="avatar-initials">RJ</div>
          </div>
          <h1 className="name">Ryan Joubert</h1>
          <p className="tagline">Marketing brain,<br />product DNA,<br />execution muscle.</p>
        </div>

        <div className="sidebar-meta">
          <div className="meta-item">
            <span className="meta-label">Current</span>
            <span className="meta-value">Senior PM · BECU</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Based</span>
            <span className="meta-value">Dallas, TX</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Domain</span>
            <span className="meta-value">Fintech · Consumer Lending</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Target</span>
            <span className="meta-value">Director / VP Product</span>
          </div>
        </div>

        <div className="sidebar-links">
          <a
            href="https://linkedin.com/in/ryan-joubert"
            target="_blank"
            rel="noreferrer"
            className="sidebar-link"
          >
            LinkedIn ↗
          </a>
        </div>

        <p className="sidebar-footer">
          Powered by Claude AI.<br />
          Ask me anything.
        </p>
      </aside>

      {/* ── CHAT PANEL ── */}
      <div className="chat-panel">
        {/* Mobile header */}
        <div className="mobile-header">
          <div className="mobile-name-block">
            <span className="mobile-initials">RJ</span>
            <div>
              <div className="mobile-name">Ryan Joubert</div>
              <div className="mobile-sub">Director / VP Product · Fintech</div>
            </div>
          </div>
          <a
            href="https://linkedin.com/in/ryan-joubert"
            target="_blank"
            rel="noreferrer"
            className="mobile-li"
          >
            ↗
          </a>
        </div>

        {/* Messages area */}
        <div className="messages-area">
          {!started && (
            <div className="intro-screen">
              <div className="intro-eyebrow">Interactive Resume</div>
              <h2 className="intro-heading">
                Ask me about Ryan's experience
              </h2>
              <p className="intro-sub">
                15 years across fintech, consumer lending, and growth marketing
                — US, China, and South Africa. Currently operating at
                Director scope at a top-5 credit union.
              </p>
              <div className="suggestions-grid">
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    className="suggestion-chip"
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`msg-row ${m.role}`}>
              {m.role === "assistant" && (
                <div className="msg-avatar">RJ</div>
              )}
              <div className="bubble">{m.content}</div>
            </div>
          ))}

          {loading && (
            <div className="msg-row assistant">
              <div className="msg-avatar">RJ</div>
              <div className="bubble typing-bubble">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="input-bar">
          <form className="input-form" onSubmit={handleSubmit}>
            <input
              className="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Ryan's experience, skills, or background…"
              disabled={loading}
              autoComplete="off"
            />
            <button
              className="send-btn"
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
