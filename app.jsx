import { useDashboard } from "./src/hooks/useDashboard";
import { Header } from "./src/components/Header";
import { DaySelector } from "./src/components/DaySelector";
import { TagFilter } from "./src/components/TagFilter";
import { TaskList } from "./src/components/TaskList";
export default function Dashboard() {
  const {
    todayIndex,
    activeDay,
    setActiveDay,
    checked,
    toggleTask,
    resetDay,
    visibleTasks,
    doneCount,
    progress,
    activeTag,
    setActiveTag,
    streak,
  } = useDashboard();

  return (
    <div className="min-h-screen bg-beige text-ink font-sans">
      <Header doneCount={doneCount} total={visibleTasks.length} progress={progress} streak={streak} />

      <main className="max-w-275 mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-10">
        <DaySelector
          activeDay={activeDay}
          todayIndex={todayIndex}
          onSelect={setActiveDay}
        />

        <TagFilter activeTag={activeTag} onSelect={setActiveTag} />

        <TaskList
          activeDay={activeDay}
          todayIndex={todayIndex}
          checked={checked}
          onToggle={toggleTask}
          onReset={resetDay}
          activeTag={activeTag}
        />
      </main>
    </div>
  );
}
