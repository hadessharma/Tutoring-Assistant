interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: (e: React.FormEvent) => void;
  courseId: string;
}

export default function ChatInput({ input, setInput, handleSend, courseId }: ChatInputProps) {
  return (
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
  );
}
