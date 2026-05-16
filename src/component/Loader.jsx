export default function Loader() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-bg-main overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute w-64 h-64 bg-brand-600 opacity-5 blur-[100px] rounded-full"></div>

      <div className="relative flex flex-col items-center">
        {/* The Animated Logo Box */}
        <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-blue-500/20 animate-pulse">
          W{/* Internal scanning line */}
          <div className="absolute inset-0 w-full h-full border-2 border-white/20 rounded-2xl overflow-hidden">
            <div className="w-full h-1/2 bg-white/10 absolute top-0 animate-[bounce_2s_infinite]"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <span className="text-[--color-text-main] font-bold tracking-[0.2em] text-xs uppercase ml-1">
            Initializing
          </span>

          {/* Progress Bar Track */}
          <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden mt-2">
            {/* Moving Progress Bar */}
            <div className="h-full bg-brand-500 w-1/3 rounded-full animate-[loading_1.5s_infinite_ease-in-out]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
