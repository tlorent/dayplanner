import { useState, useEffect } from "react";
import { TASKS, getTodayIndex } from "../constants/tasks";
import { useStreak } from "./useStreak";

function persist(key, value) {
  localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
}

export function useDashboard() {
  const todayIndex = getTodayIndex();
  const [activeDay, setActiveDay] = useState(todayIndex);
  const [checked, setChecked] = useState({});
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    const storedChecked = localStorage.getItem("dashboard-checked");
    if (storedChecked) setChecked(JSON.parse(storedChecked));
  }, []);

  function toggleTask(id) {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    persist("dashboard-checked", next);
  }

  function resetDay() {
    const tasksForDay = [...(TASKS.daily ?? []), ...(TASKS[activeDay] ?? [])];
    const next = { ...checked };
    tasksForDay.forEach((t) => { next[t.id] = false; });
    setChecked(next);
    persist("dashboard-checked", next);
  }

  const streak = useStreak(checked);

  const dayTasks = TASKS[activeDay] ?? [];
  const allTasks = [...TASKS.daily, ...dayTasks];
  const visibleTasks = activeTag ? allTasks.filter((t) => t.tag === activeTag) : allTasks;
  const doneCount = visibleTasks.filter((t) => checked[t.id]).length;
  const progress = visibleTasks.length > 0
    ? Math.round((doneCount / visibleTasks.length) * 100)
    : 0;

  return {
    todayIndex,
    activeDay,
    setActiveDay,
    checked,
    toggleTask,
    resetDay,
    dayTasks,
    allTasks,
    visibleTasks,
    doneCount,
    progress,
    activeTag,
    setActiveTag,
    streak,
  };
}
