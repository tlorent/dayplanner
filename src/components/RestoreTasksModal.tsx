import { DAILY_TASKS, DAY_TASKS, DAYS, TAG_COLORS } from '../data/tasks'
import { useWeekStore } from '../store/useWeekStore'
import type { Task } from '../types'
import { TagChip } from './TagChip'

const ALL_BUILTINS = [...DAILY_TASKS, ...DAY_TASKS]

function timeLeft(timestamp: number): string {
  const remaining = 24 * 60 * 60 * 1000 - (Date.now() - timestamp)
  if (remaining <= 0) return 'disappears soon'
  const h = Math.floor(remaining / 3_600_000)
  const m = Math.floor((remaining % 3_600_000) / 60_000)
  if (h > 0) return `disappears in ${h}h ${m}m`
  return `disappears in ${m}m`
}

function taskDayLabel(task: Task): string {
  if (task.backlog) return 'Backlog'
  if (task.dayIndex !== undefined) return DAYS[task.dayIndex].label
  return 'Daily'
}

interface Props {
  onClose: () => void
}

export function RestoreTasksModal({ onClose }: Props) {
  const disabledBuiltins = useWeekStore((s) => s.disabledBuiltins)
  const deletedCustomTasks = useWeekStore((s) => s.deletedCustomTasks)
  const enableBuiltin = useWeekStore((s) => s.enableBuiltin)
  const enableAllBuiltins = useWeekStore((s) => s.enableAllBuiltins)
  const restoreCustomTask = useWeekStore((s) => s.restoreCustomTask)
  const restoreAllCustomTasks = useWeekStore((s) => s.restoreAllCustomTasks)
  const customTags = useWeekStore((s) => s.customTags)

  const builtinEntries = disabledBuiltins
    .map((d) => ({ id: d.id, timestamp: d.disabledAt, task: ALL_BUILTINS.find((t) => t.id === d.id) }))
    .filter((e): e is typeof e & { task: Task } => e.task != null)

  const customEntries = deletedCustomTasks.map((d) => ({
    id: d.task.id,
    timestamp: d.deletedAt,
    task: d.task,
  }))

  const allEntries = [...builtinEntries, ...customEntries].sort(
    (a, b) => b.timestamp - a.timestamp,
  )

  const handleRecoverAll = () => {
    enableAllBuiltins()
    restoreAllCustomTasks()
    onClose()
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop click-to-close pattern
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div className="bg-elevated border border-border rounded-xl p-6 w-120 max-w-[92vw] flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="m-0 text-[15px] font-semibold text-text">
            Deleted tasks
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-white/40 hover:text-white/70 bg-transparent border-none cursor-pointer text-[18px] leading-none"
          >
            ✕
          </button>
        </div>

        <p className="m-0 text-[12px] text-white/40 font-ui">
          Deleted tasks will be removed automatically after 24 hours.
        </p>

        {allEntries.length === 0 ? (
          <p className="text-[13px] text-white/40 font-ui">No deleted tasks.</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {allEntries.map(({ id, timestamp, task }) => {
              const isCustom = task.source === 'custom'
              return (
                <div
                  key={id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-card border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="m-0 text-[13px] text-white/80 font-ui truncate">
                      {task.label}
                    </p>
                    <p className="m-0 text-[11px] text-white/30 font-ui mt-0.5">
                      {taskDayLabel(task)} · {timeLeft(timestamp)}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {task.tags.map((tag) => {
                      const customColor = customTags.find((t) => t.name === tag)?.color
                      const color = customColor ?? TAG_COLORS[tag]?.[0]
                      return (
                        <TagChip key={tag} tag={tag} color={color} size="xs" />
                      )
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => isCustom ? restoreCustomTask(id) : enableBuiltin(id)}
                    className="shrink-0 px-2.5 py-1 rounded-md border border-white/15 bg-transparent text-white/50 hover:text-white/80 hover:border-white/30 font-ui text-[11px] cursor-pointer transition-colors"
                  >
                    Recover
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {allEntries.length > 1 && (
          <button
            type="button"
            onClick={handleRecoverAll}
            className="self-end px-4 py-1.5 rounded-md border border-white/15 bg-transparent text-white/50 hover:text-white/80 font-ui text-[12px] cursor-pointer transition-colors"
          >
            Recover all
          </button>
        )}
      </div>
    </div>
  )
}
