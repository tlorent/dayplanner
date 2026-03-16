import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DAILY_TASKS, DAY_TASKS } from '../data/tasks'
import type { CheckedState, CustomTag, DayIndex, Tag, Task } from '../types'

export function getWeekKey(): string {
  const now = new Date()
  const jan1 = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil(
    ((now.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7,
  )
  return `${now.getFullYear()}-W${week}`
}

function getTodayIndex(): DayIndex | null {
  const d = new Date().getDay()
  if (d === 0 || d === 6) return null
  return (d - 1) as DayIndex
}

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000

export interface DisabledBuiltin {
  id: string
  disabledAt: number // timestamp ms
}

// Module-level state set by App on mount, before store selectors are called
let _showBuiltins = false
let _storageKey = 'weekplanning-state'

export function initUserStore(userId: string, showBuiltins: boolean) {
  _showBuiltins = showBuiltins
  const newKey = `weekplanning-state-${userId}`
  if (_storageKey !== newKey) {
    _storageKey = newKey
    // Migrate legacy data (from before per-user keys) into the user's key on first run
    const legacy = localStorage.getItem('weekplanning-state')
    if (legacy && !localStorage.getItem(newKey)) {
      localStorage.setItem(newKey, legacy)
    }
    useWeekStore.persist.setOptions({ name: newKey })
    useWeekStore.persist.rehydrate()
  }
}

// Pure helper functions — safe to call outside of Zustand selectors
export function selectDayTasks(
  customTasks: Task[],
  activeTag: Tag | null,
  day: DayIndex,
  order?: string[],
  disabledBuiltins?: DisabledBuiltin[],
): Task[] {
  const weekKey = getWeekKey()
  const disabledIds = new Set((disabledBuiltins ?? []).map((d) => d.id))
  const builtins = _showBuiltins
    ? DAY_TASKS.filter((t) => !disabledIds.has(t.id))
    : []
  const custom = customTasks.filter((t) => {
    if (t.backlog) return false
    if (t.dayIndex === undefined) return false
    if (t.oneOff && t.createdWeekKey !== weekKey) return false
    return true
  })
  const all = [...builtins, ...custom]
  let filtered = all.filter((t) => t.dayIndex === day)
  if (activeTag) filtered = filtered.filter((t) => t.tags.includes(activeTag))
  if (!order) return filtered
  const orderMap = new Map(order.map((id, i) => [id, i]))
  return [...filtered].sort(
    (a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999),
  )
}

export function selectBacklogTasks(
  customTasks: Task[],
  activeTag: Tag | null,
): Task[] {
  const tasks = customTasks.filter((t) => t.backlog === true)
  if (activeTag) return tasks.filter((t) => t.tags.includes(activeTag))
  return tasks
}

export function selectDailyTasks(
  customTasks: Task[],
  activeTag: Tag | null,
  disabledBuiltins?: DisabledBuiltin[],
): Task[] {
  const disabledIds = new Set((disabledBuiltins ?? []).map((d) => d.id))
  const builtins = _showBuiltins
    ? DAILY_TASKS.filter((t) => !disabledIds.has(t.id))
    : []
  const custom = customTasks.filter((t) => !t.backlog && t.dayIndex === undefined)
  const all = [...builtins, ...custom]
  if (activeTag) return all.filter((t) => t.tags.includes(activeTag))
  return all
}

// Daily tasks are checked per-day, so we use a composite key: taskId:dayIndex
export function dailyCheckedKey(taskId: string, day: DayIndex): string {
  return `${taskId}:${day}`
}

export function selectIsChecked(
  checked: CheckedState,
  taskId: string,
  day?: DayIndex, // required for daily tasks, omit for day-specific
): boolean {
  const key = day !== undefined ? dailyCheckedKey(taskId, day) : taskId
  return checked[getWeekKey()]?.[key] ?? false
}

export function selectProgress(
  checked: CheckedState,
  customTasks: Task[],
  activeTag: Tag | null,
  day: DayIndex,
  disabledBuiltins?: DisabledBuiltin[],
): { done: number; total: number } {
  const weekChecked = checked[getWeekKey()] ?? {}
  const dayTasks = selectDayTasks(customTasks, activeTag, day, undefined, disabledBuiltins)
  const dailyTasks = selectDailyTasks(customTasks, activeTag, disabledBuiltins)
  const doneDayTasks = dayTasks.filter((t) => weekChecked[t.id]).length
  const doneDailyTasks = dailyTasks.filter((t) => weekChecked[dailyCheckedKey(t.id, day)]).length
  return { done: doneDayTasks + doneDailyTasks, total: dayTasks.length + dailyTasks.length }
}

// Progress for a day ignoring tag filter — used in sidebar day buttons
export function selectDayProgress(
  checked: CheckedState,
  customTasks: Task[],
  day: DayIndex,
  disabledBuiltins?: DisabledBuiltin[],
): { done: number; total: number } {
  const weekChecked = checked[getWeekKey()] ?? {}
  const dayTasks = selectDayTasks(customTasks, null, day, undefined, disabledBuiltins)
  const dailyTasks = selectDailyTasks(customTasks, null, disabledBuiltins)
  const doneDayTasks = dayTasks.filter((t) => weekChecked[t.id]).length
  const doneDailyTasks = dailyTasks.filter((t) => weekChecked[dailyCheckedKey(t.id, day)]).length
  return { done: doneDayTasks + doneDailyTasks, total: dayTasks.length + dailyTasks.length }
}

// Progress for a specific daily task id list — used in daily group headers
export function selectGroupProgress(
  checked: CheckedState,
  taskIds: string[],
  day: DayIndex,
): { done: number; total: number } {
  const weekChecked = checked[getWeekKey()] ?? {}
  const done = taskIds.filter((id) => weekChecked[dailyCheckedKey(id, day)]).length
  return { done, total: taskIds.length }
}

export interface DeletedCustomTask {
  task: Task
  deletedAt: number // timestamp ms
}

interface WeekStore {
  activeDay: DayIndex
  activeView: 'week' | 'all'
  activeTag: Tag | null
  checked: CheckedState
  customTasks: Task[]
  customTags: CustomTag[]
  collapsedGroups: Record<string, boolean>
  dayTaskOrder: Record<number, string[]>
  disabledBuiltins: DisabledBuiltin[]
  deletedCustomTasks: DeletedCustomTask[]
  dailySectionOpen: boolean

  setActiveDay: (day: DayIndex) => void
  setActiveView: (view: 'week' | 'all') => void
  setActiveTag: (tag: Tag | null) => void
  toggleTask: (taskId: string, day?: DayIndex) => void
  resetDay: () => void
  addTask: (task: Task) => void
  updateTask: (id: string, patch: Partial<Task>) => void
  removeTask: (id: string) => void
  restoreCustomTask: (id: string) => void
  restoreAllCustomTasks: () => void
  disableBuiltin: (id: string) => void
  enableBuiltin: (id: string) => void
  enableAllBuiltins: () => void
  purgeExpiredDisabled: () => void
  toggleGroup: (groupKey: string) => void
  reorderDayTasks: (day: DayIndex, orderedIds: string[]) => void
  setDailySectionOpen: (open: boolean) => void
  addCustomTag: (tag: CustomTag) => void
  removeCustomTag: (name: string) => void
}

export const useWeekStore = create<WeekStore>()(
  persist(
    (set, get) => ({
      activeDay: (getTodayIndex() ?? 0) as DayIndex,
      activeView: 'week' as const,
      activeTag: null,
      checked: {},
      customTasks: [],
      customTags: [],
      collapsedGroups: {},
      dayTaskOrder: {},
      disabledBuiltins: [],
      deletedCustomTasks: [],
      dailySectionOpen: false,

      setActiveDay: (day) => set({ activeDay: day }),
      setActiveView: (view) => set({ activeView: view }),
      setActiveTag: (tag) => set({ activeTag: tag }),

      toggleTask: (taskId, day) => {
        const weekKey = getWeekKey()
        const { checked } = get()
        const weekChecked = checked[weekKey] ?? {}
        const key = day !== undefined ? dailyCheckedKey(taskId, day) : taskId
        set({
          checked: {
            ...checked,
            [weekKey]: { ...weekChecked, [key]: !weekChecked[key] },
          },
        })
      },

      resetDay: () => {
        const { activeDay, checked, customTasks, disabledBuiltins } = get()
        const weekKey = getWeekKey()
        const weekChecked = { ...(checked[weekKey] ?? {}) }
        for (const t of selectDayTasks(customTasks, null, activeDay, undefined, disabledBuiltins)) {
          weekChecked[t.id] = false
        }
        for (const t of selectDailyTasks(customTasks, null, disabledBuiltins)) {
          weekChecked[dailyCheckedKey(t.id, activeDay)] = false
        }
        set({ checked: { ...checked, [weekKey]: weekChecked } })
      },

      addTask: (task) =>
        set((s) => ({ customTasks: [...s.customTasks, task] })),

      updateTask: (id, patch) =>
        set((s) => ({
          customTasks: s.customTasks.map((t) =>
            t.id === id ? { ...t, ...patch } : t,
          ),
        })),

      removeTask: (id) =>
        set((s) => {
          const task = s.customTasks.find((t) => t.id === id)
          const customTasks = s.customTasks.filter((t) => t.id !== id)
          const dayTaskOrder: Record<number, string[]> = {}
          for (const [day, ids] of Object.entries(s.dayTaskOrder)) {
            dayTaskOrder[Number(day)] = (ids as string[]).filter(
              (tid) => tid !== id,
            )
          }
          const checked: CheckedState = {}
          for (const [weekKey, weekChecked] of Object.entries(s.checked)) {
            const { [id]: _removed, ...rest } = weekChecked
            checked[weekKey] = rest
          }
          const deletedCustomTasks = task
            ? [...s.deletedCustomTasks, { task, deletedAt: Date.now() }]
            : s.deletedCustomTasks
          return { customTasks, dayTaskOrder, checked, deletedCustomTasks }
        }),

      restoreCustomTask: (id) =>
        set((s) => {
          const entry = s.deletedCustomTasks.find((d) => d.task.id === id)
          if (!entry) return {}
          return {
            customTasks: [...s.customTasks, entry.task],
            deletedCustomTasks: s.deletedCustomTasks.filter((d) => d.task.id !== id),
          }
        }),

      restoreAllCustomTasks: () =>
        set((s) => ({
          customTasks: [
            ...s.customTasks,
            ...s.deletedCustomTasks.map((d) => d.task),
          ],
          deletedCustomTasks: [],
        })),

      disableBuiltin: (id) =>
        set((s) => ({
          disabledBuiltins: s.disabledBuiltins.some((d) => d.id === id)
            ? s.disabledBuiltins
            : [...s.disabledBuiltins, { id, disabledAt: Date.now() }],
        })),

      enableBuiltin: (id) =>
        set((s) => ({
          disabledBuiltins: s.disabledBuiltins.filter((d) => d.id !== id),
        })),

      enableAllBuiltins: () => set({ disabledBuiltins: [] }),

      purgeExpiredDisabled: () =>
        set((s) => ({
          disabledBuiltins: s.disabledBuiltins.filter(
            (d) => Date.now() - d.disabledAt < TWENTY_FOUR_HOURS,
          ),
          deletedCustomTasks: s.deletedCustomTasks.filter(
            (d) => Date.now() - d.deletedAt < TWENTY_FOUR_HOURS,
          ),
        })),

      reorderDayTasks: (day, orderedIds) =>
        set((s) => ({
          dayTaskOrder: { ...s.dayTaskOrder, [day]: orderedIds },
        })),

      toggleGroup: (groupKey) =>
        set((s) => ({
          collapsedGroups: {
            ...s.collapsedGroups,
            [groupKey]: s.collapsedGroups[groupKey] === false,
          },
        })),

      setDailySectionOpen: (open) => set({ dailySectionOpen: open }),

      addCustomTag: (tag) =>
        set((s) => ({
          customTags: s.customTags.some((t) => t.name === tag.name)
            ? s.customTags
            : [...s.customTags, tag],
        })),

      removeCustomTag: (name) =>
        set((s) => ({
          customTags: s.customTags.filter((t) => t.name !== name),
        })),
    }),
    {
      name: 'weekplanning-state',
      partialize: (s) => ({
        checked: s.checked,
        customTasks: s.customTasks,
        customTags: s.customTags,
        collapsedGroups: s.collapsedGroups,
        dayTaskOrder: s.dayTaskOrder,
        activeDay: s.activeDay,
        disabledBuiltins: s.disabledBuiltins,
        deletedCustomTasks: s.deletedCustomTasks,
        dailySectionOpen: s.dailySectionOpen,
      }),
    },
  ),
)
