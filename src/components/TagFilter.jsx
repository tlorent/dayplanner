import { TAG_COLORS } from "../constants/tags";

const TAGS = Object.keys(TAG_COLORS);

export function TagFilter({ activeTag, onSelect }) {
  return (
    <div className="flex gap-1.5 flex-wrap mb-8">
      <button
        onClick={() => onSelect(null)}
        className={[
          "font-mono text-[10px] tracking-[0.05em] px-3 py-[5px] border transition-colors cursor-pointer",
          activeTag === null
            ? "bg-ink text-beige border-ink"
            : "border-border text-muted hover:border-ink hover:text-ink",
        ].join(" ")}
      >
        alle
      </button>

      {TAGS.map((tag) => {
        const { bg, text } = TAG_COLORS[tag];
        const isActive = activeTag === tag;
        return (
          <button
            key={tag}
            onClick={() => onSelect(isActive ? null : tag)}
            className="font-mono text-[10px] tracking-[0.05em] px-3 py-[5px] border transition-all cursor-pointer"
            style={
              isActive
                ? { background: bg, color: text, borderColor: bg }
                : { borderColor: "var(--color-border)", color: "var(--color-muted)" }
            }
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
