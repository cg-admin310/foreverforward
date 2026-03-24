export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-16 h-16 rounded-xl bg-[#1A1A1A] flex items-center justify-center">
            <span className="text-2xl font-bold text-[#C9A84C] animate-pulse">FF</span>
          </div>
          {/* Loading ring */}
          <div className="absolute -inset-2 rounded-2xl border-2 border-[#C9A84C]/30 animate-ping" />
        </div>

        {/* Loading text */}
        <div className="flex items-center gap-1">
          <span className="text-[#555555] font-medium">Loading</span>
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </span>
        </div>
      </div>
    </div>
  );
}
