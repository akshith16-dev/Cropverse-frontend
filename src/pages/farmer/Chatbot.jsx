import { useState } from "react";
import api from "../../api";

function Chatbot() {
  const role = localStorage.getItem("role") || "farmer";
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim()) return;

    const userMessage = {
      type: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/chatbot/chat", {
        message: currentMessage,
      });

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: res.data.reply,
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: "❌ Failed to get AI response.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const suggestionsByRole = {
    farmer: [
    "Why are my tomato leaves turning yellow?",
    "Best fertilizer for rice crop?",
    "How often should I irrigate groundnut?",
    "How can I improve crop yield?",
    ],
    shop: ["What crops are available in the marketplace?", "How do I create a demand request?", "How can I track my orders?", "Show marketplace guidance."],
    admin: ["How many farmers are registered?", "How many orders are pending?", "Show marketplace statistics.", "Give me a platform analytics overview."],
  };
  const suggestions = suggestionsByRole[role] || suggestionsByRole.farmer;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Cropverse AI 🌾
          </h1>

          <p className="mt-2 text-slate-400">
            Your platform assistant for farming, marketplace activity, orders and Cropverse insights.
          </p>
        </div>

        {/* Suggestions */}
        {messages.length === 0 && (
          <div className="mb-6 grid gap-3 md:grid-cols-2">
            {suggestions.map((item) => (
              <button
                key={item}
                onClick={() => setMessage(item)}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:border-green-500/40 transition"
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {/* Chat Area */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 h-[500px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400">
              Start a conversation with Cropverse AI 🌱
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.type === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.type === "user"
                        ? "bg-green-600 text-white"
                        : "bg-slate-800 text-slate-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-slate-800 px-4 py-3 text-slate-300">
                    🌾 AI is thinking...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="mt-6 flex gap-3">
          <textarea
            rows="2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask Cropverse AI anything..."
            className="flex-1 resize-none rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-green-500"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="rounded-2xl bg-green-600 px-6 py-3 font-medium hover:bg-green-500 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
