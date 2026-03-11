import { DAYS } from "../constants/tasks";
import { SectionLabel } from "./SectionLabel";

export function DaySelector({ activeDay, todayIndex, onSelect }) {
  return (
    <div className="mb-10">
      <SectionLabel>dag selecteren</SectionLabel>
      <div className="flex gap-1.5 flex-wrap">
        {DAYS.map((day, i) => {
          const isActive = activeDay === i;
          const isToday = i === todayIndex;

          return (
            <button
              key={day}
              onClick={() => onSelect(i)}
              className={[
                "font-syne text-[13px] font-bold px-3.5 py-2 border tracking-[0.02em] transition-all duration-150 cursor-pointer",
                isActive && isToday  ? "bg-terracotta text-beige border-terracotta" : "",
                isActive && !isToday ? "bg-ink text-beige border-ink" : "",
                !isActive && isToday ? "border-terracotta text-muted hover:border-ink hover:text-ink" : "",
                !isActive && !isToday ? "border-border text-muted hover:border-ink hover:text-ink" : "",
              ].join(" ")}
            >
              {day}
              {isToday && (
                <span className="font-mono ml-1 text-[9px] opacity-70">●</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
