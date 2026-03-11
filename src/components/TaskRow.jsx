import { TAG_COLORS } from "../constants/tags";

export function TaskRow({ task, checked, onToggle }) {
  const tag = TAG_COLORS[task.tag] ?? { bg: "#E8E0D4", text: "#1A1A1A" };

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => e.key === " " && onToggle()}
      className={[
        "flex items-start gap-3 py-3 border-b border-border cursor-pointer",
        "transition-colors last:border-b-0",
        "hover:bg-beige-dark hover:-mx-4 hover:px-4",
        checked ? "opacity-50" : "",
      ].join(" ")}
    >
      {/* Checkbox */}
      <div
        className={[
          "w-[18px] h-[18px] border-[1.5px] shrink-0 mt-0.5 flex items-center justify-center transition-colors",
          checked ? "bg-ink border-ink" : "border-border",
        ].join(" ")}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="#F5F0E8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Label */}
      <span
        className={[
          "flex-1 text-[13px] leading-relaxed",
          checked ? "line-through text-muted" : "text-ink",
        ].join(" ")}
      >
        {task.label}
      </span>

      {/* Tag */}
      <span
        className="font-mono text-[10px] px-[7px] py-[2px] tracking-[0.05em] shrink-0"
        style={{ background: tag.bg, color: tag.text }}
      >
        {task.tag}
      </span>
    </div>
  );
}
