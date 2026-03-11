import { TASKS, FULL_DAYS } from "../constants/tasks";
import { SectionLabel } from "./SectionLabel";
import { TaskRow } from "./TaskRow";

export function TaskList({ activeDay, todayIndex, checked, onToggle, onReset, activeTag }) {
  const dayTasks = TASKS[activeDay] ?? [];
  const isToday = activeDay === todayIndex;

  const filter = (tasks) => activeTag ? tasks.filter((t) => t.tag === activeTag) : tasks;
  const visibleDayTasks = filter(dayTasks);
  const visibleDailyTasks = filter(TASKS.daily);
  const nothingVisible = visibleDayTasks.length === 0 && visibleDailyTasks.length === 0;

  return (
    <div className="animate-fade-up" key={activeDay}>
      {/* Day heading */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="font-syne text-[28px] sm:text-[42px] font-extrabold tracking-[-0.03em] leading-none">
            {FULL_DAYS[activeDay]}
          </h1>
          {isToday && (
            <p className="font-mono text-[11px] text-terracotta mt-1.5 tracking-[0.08em]">
              — VANDAAG
            </p>
          )}
        </div>
        <button
          onClick={onReset}
          className="font-mono text-[11px] tracking-[0.05em] px-4 py-2 border text-white bg-terracotta cursor-pointer transition-colors border-terracotta mt-1"
        >
          reset dag
        </button>
      </div>

      {/* Day-specific tasks */}
      {visibleDayTasks.length > 0 && (
        <div className="mb-8">
          <SectionLabel>{FULL_DAYS[activeDay]}-specifiek</SectionLabel>
          <div className="bg-beige-dark border border-border px-4">
            {visibleDayTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                checked={checked[task.id]}
                onToggle={() => onToggle(task.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Daily tasks */}
      {visibleDailyTasks.length > 0 && (
        <div className="mb-6">
          <SectionLabel>dagelijks</SectionLabel>
          <div className="bg-beige-dark border border-border px-4">
            {visibleDailyTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                checked={checked[task.id]}
                onToggle={() => onToggle(task.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state when filter yields nothing */}
      {nothingVisible && activeTag && (
        <p className="font-mono text-[11px] text-muted mb-6">
          Geen <span className="text-ink">{activeTag}</span>-taken op{" "}
          {FULL_DAYS[activeDay].toLowerCase()}.
        </p>
      )}

    </div>
  );
}
