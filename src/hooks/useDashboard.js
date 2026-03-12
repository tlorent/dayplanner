import { useState, useEffect } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { TASKS, getTodayIndex } from "../constants/tasks";
import { useStreak } from "./useStreak";

function persist(key, value) {
  localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
}

function buildDefaultOrder() {
  const order = { daily: TASKS.daily.map((t) => t.id) };
  for (let i = 0; i <= 4; i++) order[i] = (TASKS[i] ?? []).map((t) => t.id);
  return order;
}

function loadOrder() {
  try {
    const stored = localStorage.getItem("dashboard-task-order");
    return stored ? JSON.parse(stored) : buildDefaultOrder();
  } catch {
    return buildDefaultOrder();
  }
}

function applyOrder(tasks, ids) {
  const map = Object.fromEntries(tasks.map((t) => [t.id, t]));
  const ordered = ids.map((id) => map[id]).filter(Boolean);
  const rest = tasks.filter((t) => !ids.includes(t.id));
  return [...ordered, ...rest];
}

export function useDashboard() {
  const todayIndex = getTodayIndex();
  const [activeDay, setActiveDay] = useState(todayIndex);
  const [checked, setChecked] = useState({});
  const [activeTag, setActiveTag] = useState(null);
  const [taskOrder, setTaskOrder] = useState(loadOrder);

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

  function reorderSection(section, activeId, overId) {
    setTaskOrder((prev) => {
      const ids = prev[section] ?? [];
      const oldIndex = ids.indexOf(activeId);
      const newIndex = ids.indexOf(overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;
      const next = { ...prev, [section]: arrayMove(ids, oldIndex, newIndex) };
      persist("dashboard-task-order", next);
      return next;
    });
  }

  const streak = useStreak(checked);

  const dailyTasks = applyOrder(TASKS.daily, taskOrder.daily ?? []);
  const dayTasks = applyOrder(TASKS[activeDay] ?? [], taskOrder[activeDay] ?? []);
  const allTasks = [...dailyTasks, ...dayTasks];
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
    reorderSection,
    dailyTasks,
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
