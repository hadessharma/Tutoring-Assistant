import Link from "next/link";

export default function ChatHeader({ courseId }: { courseId: string }) {
  return (
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
  );
}
