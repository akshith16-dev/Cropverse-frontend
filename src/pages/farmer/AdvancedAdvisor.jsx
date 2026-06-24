import { useRef, useState } from "react";
import { Mic, Send, Sparkles } from "lucide-react";
import api from "../../api";

export default function AdvancedAdvisor() {
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("English");
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [lastFailedQuestion, setLastFailedQuestion] = useState("");
  const recognition = useRef(null);

  async function ask(event, overrideQuestion) {
    event?.preventDefault();
    const question = (overrideQuestion ?? message).trim();
    if (!question || busy) return;

    setMessage("");
    setLastFailedQuestion("");
    setMessages((list) => [...list, { role: "user", text: question }]);
    setBusy(true);

    try {
      const { data } = await api.post("/chatbot/chat", {
        message: question,
        language,
        context: "Advanced farming advisor: include disease, fertilizer, weather, and harvest planning when relevant.",
      });
      setMessages((list) => [...list, { role: "assistant", text: data.reply }]);
    } catch {
      setLastFailedQuestion(question);
      setMessages((list) => [
        ...list,
        {
          role: "assistant",
          text: "I could not reach the advisor just now. Please try again in a few moments.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function speak() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((list) => [...list, { role: "assistant", text: "Speech recognition is not supported in this browser." }]);
      return;
    }
    recognition.current = new SpeechRecognition();
    recognition.current.lang = language === "Telugu" ? "te-IN" : language === "Hindi" ? "hi-IN" : "en-IN";
    recognition.current.onresult = (event) => setMessage(event.results[0][0].transcript);
    recognition.current.start();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Advanced Advisor <Sparkles className="inline text-emerald-400" /></h1>
          <p className="mt-2 text-slate-400">Context-aware guidance for crops, disease, nutrients, weather, and harvest.</p>
        </div>
        <select value={language} onChange={(event) => setLanguage(event.target.value)} className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2">
          <option>English</option>
          <option>Telugu</option>
          <option>Hindi</option>
        </select>
      </div>

      <div className="min-h-[380px] space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5">
        {messages.length === 0 && <p className="text-slate-400">Try: My tomato leaves have brown spots. What should I do?</p>}
        {messages.map((item, index) => (
          <div key={index} className={`max-w-[85%] rounded-2xl p-4 ${item.role === "user" ? "ml-auto bg-emerald-600" : "bg-slate-800 text-slate-100"}`}>
            {item.text}
          </div>
        ))}
        {busy && <div className="rounded-2xl bg-slate-800 p-4 text-slate-400">Thinking through the field conditions...</div>}
      </div>

      <form onSubmit={ask} className="mt-4 flex gap-2">
        <button type="button" onClick={speak} aria-label="Speak your question" className="rounded-xl border border-white/10 px-4 hover:bg-white/10">
          <Mic />
        </button>
        <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask about your crop..." className="min-w-0 flex-1 rounded-xl bg-slate-900 px-4 py-3 outline-none ring-emerald-400 focus:ring-2" />
        <button disabled={busy} className="rounded-xl bg-emerald-600 px-5 hover:bg-emerald-500 disabled:opacity-50">
          {busy ? "..." : <Send />}
        </button>
      </form>

      {lastFailedQuestion && (
        <button onClick={(event) => ask(event, lastFailedQuestion)} disabled={busy} className="mt-3 rounded-xl border border-emerald-500/30 px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50">
          Retry last question
        </button>
      )}
    </div>
  );
}
