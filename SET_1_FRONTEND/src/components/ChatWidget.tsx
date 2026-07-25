import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2, Bot, User } from "lucide-react";
import Markdown from "react-markdown";

type Role = "user" | "model";

interface Message {
  role: Role;
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    
    // Format history for Gemini API: [{role: "user", parts: [{text: "..."}]}, ...]
    const history = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const newMessages: Message[] = [...messages, { role: "user", text: userMsg }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to chat API.");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available.");

      const decoder = new TextDecoder();
      let botMessage = "";

      setMessages((prev) => [...prev, { role: "model", text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            if (dataStr === "[DONE]") break;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.error) {
                 botMessage = `[ERROR] ${data.error}`;
              } else if (data.text) {
                botMessage += data.text;
              }
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].text = botMessage;
                return updated;
              });
            } catch (err) {
              // ignore parse errors for partial chunks
            }
          }
        }
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: `[SYSTEM ERROR] ${error.message}` },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-sand/10 border border-sand/40 text-sand hover:bg-sand/20 hover:border-sand transition-all duration-300 z-50 shadow-lg ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open AI Assistant"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-full max-w-sm sm:max-w-md bg-[#0a0a0a] border border-white/10 rounded-lg shadow-2xl flex flex-col overflow-hidden z-50 transition-all duration-300 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 pointer-events-none translate-y-4"
        }`}
        style={{ height: '500px', maxHeight: 'calc(100vh - 48px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-sand" />
            <span className="text-xs font-mono tracking-widest text-[#F4F4F0] uppercase">
              Operator_Assist
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 font-sans text-sm hide-scrollbar bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-white/30 text-center font-mono text-xs">
              <Bot className="w-8 h-8 mb-3 opacity-50" />
              <p className="tracking-widest uppercase mb-1">TruthLens Assistant</p>
              <p className="opacity-60 max-w-[200px]">Secure channel open. How can I assist your investigation?</p>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  msg.role === "user"
                    ? "bg-sand/10 border border-sand/20 text-[#F4F4F0]"
                    : "bg-white/5 border border-white/10 text-slate-muted"
                }`}
              >
                <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px] font-mono tracking-wider uppercase">
                  {msg.role === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-sand" />}
                  <span>{msg.role === "user" ? "Operator" : "System"}</span>
                </div>
                <div className="markdown-body text-sm leading-relaxed whitespace-pre-wrap break-words">
                  <Markdown>{msg.text}</Markdown>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex w-full justify-start">
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-sand flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-[10px] font-mono tracking-widest uppercase">Processing</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-[#050505] border-t border-white/5">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query the system..."
              className="w-full bg-white/5 border border-white/10 rounded-md py-2.5 pl-3 pr-10 text-sm text-[#F4F4F0] placeholder:text-white/20 focus:outline-none focus:border-sand/40 focus:ring-1 focus:ring-sand/40 transition-all font-mono"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-1.5 text-sand/60 hover:text-sand disabled:opacity-50 disabled:hover:text-sand/60 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
