"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Message {
  id: string;
  role: "student" | "assistant";
  content: string;
}

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId");
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hello! I'm your Tutoring Assistant for ${courseId || "this course"}. I'm here to help you understand concepts and work through problems. What would you like to focus on today?`,
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!courseId) {
      router.push("/");
    }
  }, [courseId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "student",
      content: userText,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: courseId,
          message: userText
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response
        }]);
      } else {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message || "I apologize, but I encountered an error."
        }]);
      }
    } catch (error) {
      console.error("Failed to connect to backend:", error);
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Network error: Unable to reach the tutoring server. Please ensure the backend is running."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!courseId) return null;

  return (
    <div className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden bg-primary-black relative">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary-maroon/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="flex-none bg-zinc-900/50 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between z-10 shadow-md">
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="p-2 -ml-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="font-bold text-lg text-zinc-100 flex items-center gap-2">
              Tutoring Session
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary-maroon/20 text-primary-gold border border-primary-maroon/30">
                {courseId}
              </span>
            </h1>
            <p className="text-xs text-zinc-400">Strict Socratic Guide enabled</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-zinc-400 font-medium">Session Active</span>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth z-10">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.role === "student" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-lg ${
                message.role === "student" 
                  ? "bg-primary-maroon text-white rounded-br-sm border border-[#721532]" 
                  : "bg-zinc-800/80 text-zinc-100 rounded-bl-sm border border-white/5 backdrop-blur-sm"
              }`}
            >
              <div className="flex items-center gap-2 mb-2 opacity-80">
                {message.role === "assistant" ? (
                  <>
                    <svg className="w-4 h-4 text-primary-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span className="text-xs font-semibold">Tutor Assistant</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs font-semibold">You</span>
                  </>
                )}
              </div>
              <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800/80 text-zinc-100 rounded-2xl rounded-bl-sm border border-white/5 backdrop-blur-sm p-4 shadow-lg max-w-[85%] sm:max-w-[75%]">
              <div className="flex items-center gap-2 mb-2 opacity-80">
                <svg className="w-4 h-4 text-primary-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-xs font-semibold">Tutor Assistant</span>
              </div>
              <div className="flex items-center gap-1.5 py-1">
                <div className="w-2 h-2 rounded-full bg-primary-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary-gold animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="flex-none p-4 sm:p-6 bg-zinc-900/80 backdrop-blur-lg border-t border-white/10 z-10">
        <form 
          onSubmit={handleSend}
          className="max-w-4xl mx-auto relative flex items-end gap-2"
        >
          <div className="relative flex-1 bg-zinc-800/50 rounded-2xl border border-white/10 focus-within:border-primary-gold/50 focus-within:ring-1 focus-within:ring-primary-gold/50 transition-all shadow-inner">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask a question about ${courseId}...`}
              className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 rounded-2xl py-4 pl-4 pr-12 min-h-[60px] max-h-32 resize-none focus:outline-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
            <div className="absolute right-3 bottom-3 text-xs text-zinc-500 pointer-events-none hidden sm:block">
              Press Enter to send
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex-none p-4 rounded-2xl bg-primary-gold text-primary-black font-bold hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-primary-gold focus:ring-offset-2 focus:ring-offset-primary-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-gold/20"
          >
            <svg className="w-5 h-5 translate-x-0.5 -translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="text-[10px] text-zinc-500">
            Assistant responses are monitored for academic integrity compliance. Direct solutions will not be provided.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-white">Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
