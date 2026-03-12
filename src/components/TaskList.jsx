import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { FULL_DAYS } from "../constants/tasks";
import { SectionLabel } from "./SectionLabel";
import { TaskRow } from "./TaskRow";

function SortableList({ tasks, checked, onToggle, onReorder, section }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd({ active, over }) {
    if (over && active.id !== over.id) {
      onReorder(section, active.id, over.id);
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="bg-beige-dark border border-border px-4">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              checked={checked[task.id]}
              onToggle={() => onToggle(task.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export function TaskList({ activeDay, todayIndex, dailyTasks, dayTasks, checked, onToggle, onReset, onAddTask, onReorder, activeTag }) {
  const [dailyOpen, setDailyOpen] = useState(false);
  const isToday = activeDay === todayIndex;

  const filter = (tasks) => activeTag ? tasks.filter((t) => (t.tags ?? [t.tag]).includes(activeTag)) : tasks;
  const visibleDayTasks = filter(dayTasks);
  const visibleDailyTasks = filter(dailyTasks);
  const nothingVisible = visibleDayTasks.length === 0 && visibleDailyTasks.length === 0;

  const dailyDone = visibleDailyTasks.filter((t) => checked[t.id]).length;

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
        <div className="flex gap-2 mt-1">
          <button
            onClick={onAddTask}
            className="font-mono text-[11px] tracking-[0.05em] px-4 py-2 border border-border text-muted cursor-pointer hover:border-ink hover:text-ink transition-colors"
          >
            + taak
          </button>
          <button
            onClick={onReset}
            className="font-mono text-[11px] tracking-[0.05em] px-4 py-2 border text-white bg-terracotta cursor-pointer transition-colors border-terracotta"
          >
            reset dag
          </button>
        </div>
      </div>

      {/* Day-specific tasks */}
      {visibleDayTasks.length > 0 && (
        <div className="mb-8">
          <SectionLabel>{FULL_DAYS[activeDay]}-specifiek</SectionLabel>
          <SortableList
            tasks={visibleDayTasks}
            checked={checked}
            onToggle={onToggle}
            onReorder={onReorder}
            section={activeDay}
          />
        </div>
      )}

      {/* Daily tasks — accordion */}
      {visibleDailyTasks.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setDailyOpen((o) => !o)}
            className="flex items-center justify-between w-full mb-3 cursor-pointer group"
          >
            <p className="font-mono text-[10px] text-muted tracking-[0.12em] uppercase group-hover:text-ink transition-colors">
              dagelijks
              <span className="ml-2 text-muted">
                {dailyDone}/{visibleDailyTasks.length}
              </span>
            </p>
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              className={`transition-transform ${dailyOpen ? "rotate-180" : ""}`}
            >
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted" />
            </svg>
          </button>

          {dailyOpen && (
            <SortableList
              tasks={visibleDailyTasks}
              checked={checked}
              onToggle={onToggle}
              onReorder={onReorder}
              section="daily"
            />
          )}
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
