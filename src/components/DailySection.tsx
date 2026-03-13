import type { Tag, Task } from '../types'
import { useWeekStore, selectDailyTasks, selectGroupProgress } from '../store/useWeekStore'
import { TAG_COLORS } from '../data/tasks'
import { TaskRow } from './TaskRow'

function groupByTag(tasks: Task[]): Record<string, Task[]> {
  const groups: Record<string, Task[]> = {}
  for (const task of tasks) {
    const key = task.tags[0]
    if (!groups[key]) groups[key] = []
    groups[key].push(task)
  }
  return groups
}

export function DailySection() {
  const activeTag = useWeekStore((s) => s.activeTag)
  const customTasks = useWeekStore((s) => s.customTasks)
  const checked = useWeekStore((s) => s.checked)
  const disabledBuiltinIds = useWeekStore((s) => s.disabledBuiltinIds)
  const tasks = selectDailyTasks(customTasks, activeTag, disabledBuiltinIds)
  const toggleGroup = useWeekStore((s) => s.toggleGroup)
  const collapsedGroups = useWeekStore((s) => s.collapsedGroups)

  const groups = groupByTag(tasks)
  const tagKeys = (Object.keys(groups) as Tag[]).sort()

  if (tasks.length === 0) {
    return <p className="text-muted text-[13px] py-3">Geen dagelijkse taken voor deze tag.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {tagKeys.map((tag, gi) => {
        const groupTasks = groups[tag]
        const groupKey = `daily-${tag}`
        const collapsed = collapsedGroups[groupKey] !== false
        const [color] = TAG_COLORS[tag] ?? ['rgba(255,255,255,0.4)']
        const gp = selectGroupProgress(checked, groupTasks.map((t) => t.id))

        return (
          <div
            key={tag}
            className="fade-up"
            style={{ animationDelay: `${gi * 0.06}s` }}
          >
            {/* Tag label — triggers collapse */}
            <button
              onClick={() => toggleGroup(groupKey)}
              className="flex items-center gap-2 mb-1.5 border-none bg-transparent cursor-pointer p-0"
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
              <span className="text-[10px] font-semibold tracking-widest uppercase text-white/50">
                {tag}
              </span>
              <span className="text-[10px] text-white/40">
                {collapsed ? '▸' : '▾'}
              </span>
              <span className="text-[10px] tabular-nums text-white/40">
                {gp.done}/{gp.total}
              </span>
            </button>

            {!collapsed && (
              <div className="bg-card rounded-lg overflow-hidden border border-border">
                {groupTasks.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
