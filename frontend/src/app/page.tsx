"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isBooting, setIsBooting] = useState(false);
  const [bootMessage, setBootMessage] = useState("");

  // Course Mock Data based on PRD Requirements
  const courses = [
    { id: "CSE110", name: "Principles of Programming" },
    { id: "MAT266", name: "Calculus for Engineers II" },
    { id: "CSE310", name: "Data Structures & Algorithms" },
  ];

  const studyTips = [
    "Tip: Break down complex problems into smaller, manageable chunks.",
    "Tip: Don't just memorize formulas; understand the underlying logic.",
    "Tip: Try explaining a concept out loud to see if you really understand it.",
    "Tip: Practice identifying edge cases before writing code."
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    setIsBooting(true);
    setBootMessage("Safely booting the isolated course sandbox...");

    let tipIndex = 0;
    const tipInterval = setInterval(() => {
      setBootMessage(studyTips[tipIndex % studyTips.length]);
      tipIndex++;
    }, 4000);

    try {
      // Wake up the backend (handles cold starts on Render/Koyeb)
      await fetch("http://localhost:8000/api/health", { cache: 'no-store' });
      
      // Initialize the session
      await fetch("http://localhost:8000/api/session/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: selectedCourse })
      });
      
      router.push(`/chat?courseId=${selectedCourse}`);
    } catch (error) {
      console.error("Backend connection failed:", error);
      // Push anyway to let the chat page handle the connection error natively
      router.push(`/chat?courseId=${selectedCourse}`);
    } finally {
      clearInterval(tipInterval);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative ambient background shapes with ASU Colors */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-maroon/20 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-gold/15 rounded-full blur-[100px] -z-10 animate-pulse delay-1000" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/10 mb-6 backdrop-blur-sm shadow-xl">
            <svg className="w-8 h-8 text-primary-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary-white via-zinc-200 to-zinc-400">
            Tutoring Assistant
          </h1>
          <p className="text-zinc-400 text-lg font-medium">
            Select your course to begin a secure, guided session.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:shadow-primary-maroon/20 hover:border-white/20">
          {isBooting ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in duration-300">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary-maroon/30 border-t-primary-gold rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-primary-maroon rounded-full animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Starting Session...</h3>
                <p className="text-sm text-zinc-400 min-h-[40px] px-4 transition-opacity duration-500">
                  {bootMessage}
                </p>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-zinc-300 mb-2 ml-1">
                  Course Code
                </label>
                <div className="relative group">
                  <select
                    id="course"
                    name="course"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    required
                    className="block w-full appearance-none bg-zinc-900/80 border border-white/10 text-white rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-primary-gold/50 focus:border-primary-gold transition-colors shadow-inner cursor-pointer"
                  >
                    <option value="" disabled className="bg-zinc-900 text-zinc-500">
                      -- Choose your course --
                    </option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id} className="bg-zinc-900 text-zinc-100 py-2">
                        {course.id} - {course.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-zinc-400 group-hover:text-primary-gold transition-colors">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedCourse}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-primary-maroon hover:bg-[#721532] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-maroon focus:ring-offset-primary-black transition-all duration-200 hover:shadow-primary-maroon/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Session
              </button>
            </form>
          )}
        </div>
        
        <div className="mt-8">
          <p className="text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-emerald-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Strictly compliant with Academic Integrity Policies
          </p>
        </div>
      </div>
    </main>
  );
}
