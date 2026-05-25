"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Message {
  id: string;
  role: "student" | "assistant";
  content: string;
}

import MarkdownMessage from "../../components/MarkdownMessage";
import ChatHeader from "../../components/ChatHeader";
import ChatInput from "../../components/ChatInput";

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
      const historyPayload = messages.map(msg => ({
        role: msg.role === "student" ? "user" : "assistant",
        content: msg.content
      }));

      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: courseId,
          message: userText,
          history: historyPayload
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
      <ChatHeader courseId={courseId} />

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
              <MarkdownMessage content={message.content} />
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
      <ChatInput 
        input={input} 
        setInput={setInput} 
        handleSend={handleSend} 
        courseId={courseId} 
      />
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
