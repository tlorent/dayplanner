import { useState, useEffect } from "react";
import { TASKS } from "../constants/tasks";

const STORAGE_KEY = "dashboard-streak-days";

// Returns the ISO date string (YYYY-MM-DD) for a given Date
function toDateStr(date) {
  return date.toISOString().slice(0, 10);
}

// Returns the previous workday (Mon–Fri) relative to a given date string
function prevWorkday(dateStr) {
  const d = new Date(dateStr);
  do {
    d.setDate(d.getDate() - 1);
  } while (d.getDay() === 0 || d.getDay() === 6);
  return toDateStr(d);
}

// Count consecutive workdays in the set, going back from today
function computeStreak(completedSet) {
  const today = toDateStr(new Date());
  if (!completedSet.has(today)) return 0;
  let streak = 1;
  let cursor = today;
  while (true) {
    cursor = prevWorkday(cursor);
    if (completedSet.has(cursor)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function useStreak(checked) {
  const [completedDays, setCompletedDays] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  // When all daily tasks become checked, stamp today
  useEffect(() => {
    const allDailyDone = TASKS.daily.every((t) => checked[t.id]);
    const today = toDateStr(new Date());
    const alreadyStamped = completedDays.has(today);

    if (allDailyDone && !alreadyStamped) {
      const next = new Set(completedDays);
      next.add(today);
      setCompletedDays(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    }

    // If tasks get unchecked after being stamped, remove today's stamp
    if (!allDailyDone && alreadyStamped) {
      const next = new Set(completedDays);
      next.delete(today);
      setCompletedDays(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    }
  }, [checked]);

  return computeStreak(completedDays);
}
