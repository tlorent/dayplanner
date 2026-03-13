import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Tag, DayIndex, Task, CheckedState } from '../types'
import { DAILY_TASKS, DAY_TASKS } from '../data/tasks'

export function getWeekKey(): string {
  const now = new Date()
  const jan1 = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil(((now.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${week}`
}

function getTodayIndex(): DayIndex | null {
  const d = new Date().getDay()
  if (d === 0 || d === 6) return null
  return (d - 1) as DayIndex
}

// Pure helper functions — safe to call outside of Zustand selectors
export function selectDayTasks(
  customTasks: Task[],
  activeTag: Tag | null,
  day: DayIndex,
  order?: string[],
  disabledBuiltinIds?: string[],
): Task[] {
  const weekKey = getWeekKey()
  const disabled = new Set(disabledBuiltinIds ?? [])
  const builtins = DAY_TASKS.filter((t) => !disabled.has(t.id))
  const custom = customTasks.filter((t) => {
    if (t.dayIndex === undefined) return false
    if (t.oneOff && t.createdWeekKey !== weekKey) return false
    return true
  })
  const all = [...builtins, ...custom]
  let filtered = all.filter((t) => t.dayIndex === day)
  if (activeTag) filtered = filtered.filter((t) => t.tags.includes(activeTag))
  if (!order) return filtered
  const orderMap = new Map(order.map((id, i) => [id, i]))
  return [...filtered].sort((a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999))
}

export function selectDailyTasks(customTasks: Task[], activeTag: Tag | null, disabledBuiltinIds?: string[]): Task[] {
  const disabled = new Set(disabledBuiltinIds ?? [])
  const builtins = DAILY_TASKS.filter((t) => !disabled.has(t.id))
  const custom = customTasks.filter((t) => t.dayIndex === undefined)
  const all = [...builtins, ...custom]
  if (activeTag) return all.filter((t) => t.tags.includes(activeTag))
  return all
}

export function selectIsChecked(checked: CheckedState, taskId: string): boolean {
  return checked[getWeekKey()]?.[taskId] ?? false
}

export function selectProgress(
  checked: CheckedState,
  customTasks: Task[],
  activeTag: Tag | null,
  day: DayIndex,
  disabledBuiltinIds?: string[],
): { done: number; total: number } {
  const all = [
    ...selectDayTasks(customTasks, activeTag, day, undefined, disabledBuiltinIds),
    ...selectDailyTasks(customTasks, activeTag, disabledBuiltinIds),
  ]
  const weekChecked = checked[getWeekKey()] ?? {}
  const done = all.filter((t) => weekChecked[t.id]).length
  return { done, total: all.length }
}

// Progress for a day ignoring tag filter — used in sidebar day buttons
export function selectDayProgress(
  checked: CheckedState,
  customTasks: Task[],
  day: DayIndex,
  disabledBuiltinIds?: string[],
): { done: number; total: number } {
  const all = [
    ...selectDayTasks(customTasks, null, day, undefined, disabledBuiltinIds),
    ...selectDailyTasks(customTasks, null, disabledBuiltinIds),
  ]
  const weekChecked = checked[getWeekKey()] ?? {}
  const done = all.filter((t) => weekChecked[t.id]).length
  return { done, total: all.length }
}

// Progress for a specific task id list — used in daily group headers
export function selectGroupProgress(
  checked: CheckedState,
  taskIds: string[],
): { done: number; total: number } {
  const weekChecked = checked[getWeekKey()] ?? {}
  const done = taskIds.filter((id) => weekChecked[id]).length
  return { done, total: taskIds.length }
}

interface WeekStore {
  activeDay: DayIndex
  activeTag: Tag | null
  checked: CheckedState
  customTasks: Task[]
  collapsedGroups: Record<string, boolean>
  dayTaskOrder: Record<number, string[]> // dayIndex -> ordered task ids
  disabledBuiltinIds: string[]
  dailySectionOpen: boolean

  setActiveDay: (day: DayIndex) => void
  setActiveTag: (tag: Tag | null) => void
  toggleTask: (taskId: string) => void
  resetDay: () => void
  addTask: (task: Task) => void
  updateTask: (id: string, patch: Partial<Task>) => void
  removeTask: (id: string) => void
  disableBuiltin: (id: string) => void
  enableBuiltin: (id: string) => void
  enableAllBuiltins: () => void
  toggleGroup: (groupKey: string) => void
  reorderDayTasks: (day: DayIndex, orderedIds: string[]) => void
  setDailySectionOpen: (open: boolean) => void
}

export const useWeekStore = create<WeekStore>()(
  persist(
    (set, get) => ({
      activeDay: (getTodayIndex() ?? 0) as DayIndex,
      activeTag: null,
      checked: {},
      customTasks: [],
      collapsedGroups: {},
      dayTaskOrder: {},
      disabledBuiltinIds: [],
      dailySectionOpen: false,

      setActiveDay: (day) => set({ activeDay: day }),
      setActiveTag: (tag) => set({ activeTag: tag }),

      toggleTask: (taskId) => {
        const weekKey = getWeekKey()
        const { checked } = get()
        const weekChecked = checked[weekKey] ?? {}
        set({
          checked: {
            ...checked,
            [weekKey]: { ...weekChecked, [taskId]: !weekChecked[taskId] },
          },
        })
      },

      resetDay: () => {
        const { activeDay, checked, customTasks, disabledBuiltinIds } = get()
        const weekKey = getWeekKey()
        const weekChecked = { ...(checked[weekKey] ?? {}) }
        // Reset ALL tasks for the day, regardless of active tag filter
        const allTasks = [
          ...selectDayTasks(customTasks, null, activeDay, undefined, disabledBuiltinIds),
          ...selectDailyTasks(customTasks, null, disabledBuiltinIds),
        ]
        allTasks.forEach((t) => { weekChecked[t.id] = false })
        set({ checked: { ...checked, [weekKey]: weekChecked } })
      },

      addTask: (task) => set((s) => ({ customTasks: [...s.customTasks, task] })),

      updateTask: (id, patch) =>
        set((s) => ({
          customTasks: s.customTasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),

      removeTask: (id) =>
        set((s) => {
          // Remove from customTasks
          const customTasks = s.customTasks.filter((t) => t.id !== id)
          // Clean up dayTaskOrder
          const dayTaskOrder: Record<number, string[]> = {}
          for (const [day, ids] of Object.entries(s.dayTaskOrder)) {
            dayTaskOrder[Number(day)] = (ids as string[]).filter((tid) => tid !== id)
          }
          // Clean up checked state
          const checked: CheckedState = {}
          for (const [weekKey, weekChecked] of Object.entries(s.checked)) {
            const { [id]: _removed, ...rest } = weekChecked
            checked[weekKey] = rest
          }
          return { customTasks, dayTaskOrder, checked }
        }),

      disableBuiltin: (id) =>
        set((s) => ({
          disabledBuiltinIds: s.disabledBuiltinIds.includes(id)
            ? s.disabledBuiltinIds
            : [...s.disabledBuiltinIds, id],
        })),

      enableBuiltin: (id) =>
        set((s) => ({ disabledBuiltinIds: s.disabledBuiltinIds.filter((i) => i !== id) })),

      enableAllBuiltins: () => set({ disabledBuiltinIds: [] }),

      reorderDayTasks: (day, orderedIds) =>
        set((s) => ({ dayTaskOrder: { ...s.dayTaskOrder, [day]: orderedIds } })),

      toggleGroup: (groupKey) =>
        set((s) => ({
          // undefined/true = collapsed; false = expanded. Toggle flips between them.
          collapsedGroups: { ...s.collapsedGroups, [groupKey]: s.collapsedGroups[groupKey] === false },
        })),

      setDailySectionOpen: (open) => set({ dailySectionOpen: open }),
    }),
    {
      name: 'weekplanning-state',
      partialize: (s) => ({
        checked: s.checked,
        customTasks: s.customTasks,
        collapsedGroups: s.collapsedGroups,
        dayTaskOrder: s.dayTaskOrder,
        activeDay: s.activeDay,
        disabledBuiltinIds: s.disabledBuiltinIds,
        dailySectionOpen: s.dailySectionOpen,
      }),
    }
  )
)
