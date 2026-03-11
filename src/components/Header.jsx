import { Streak } from "./Streak";

export function Header({ doneCount, total, progress, streak }) {
  const complete = progress === 100;

  return (
    <header className="sticky top-0 z-20 bg-beige border-b border-border px-4 sm:px-8 lg:px-10 py-4.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 sm:gap-6 min-w-0">
        <span className="font-syne text-[15px] font-extrabold tracking-[-0.02em] shrink-0">
          Tim Lorent
        </span>
        <div className="hidden sm:block w-px h-4 bg-border shrink-0" />
        <span className="hidden sm:block font-mono text-[11px] text-muted tracking-[0.08em] truncate">
          WEEKPLANNING
        </span>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <Streak streak={streak} />
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-muted">
            {doneCount}/{total}
          </span>
          <div className="w-16 sm:w-20 h-0.75 bg-beige-darker">
            <div
              className="h-full bg-terracotta transition-[width] duration-400 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span
            className={[
              "font-mono text-[11px]",
              complete ? "text-terracotta font-medium" : "text-muted",
            ].join(" ")}
          >
            {progress}%
          </span>
        </div>
      </div>
    </header>
  );
}
