export function Streak({ streak }) {
  if (streak === 0) return null;

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <span className="text-[13px] leading-none">🔥</span>
      <span className="font-syne text-[15px] font-extrabold text-terracotta leading-none">
        {streak}
      </span>
      <span className="hidden sm:inline font-mono text-[10px] text-muted tracking-[0.05em]">
        {streak === 1 ? "dag" : "dagen"}
      </span>
    </div>
  );
}
