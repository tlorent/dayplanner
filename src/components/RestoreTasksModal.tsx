import type { DisabledBuiltin } from '../store/useWeekStore'
import { useWeekStore } from '../store/useWeekStore'
import { DAILY_TASKS, DAY_TASKS, DAYS } from '../data/tasks'
import { TagChip } from './TagChip'
import { TAG_COLORS } from '../data/tasks'

const ALL_BUILTINS = [...DAILY_TASKS, ...DAY_TASKS]

function timeLeft(disabledAt: number): string {
  const remaining = 24 * 60 * 60 * 1000 - (Date.now() - disabledAt)
  if (remaining <= 0) return 'disappears soon'
  const h = Math.floor(remaining / 3_600_000)
  const m = Math.floor((remaining % 3_600_000) / 60_000)
  if (h > 0) return `disappears in ${h}u ${m}m`
  return `disappears ${m}m`
}

interface Props {
  onClose: () => void
}

export function RestoreTasksModal({ onClose }: Props) {
  const disabledBuiltins = useWeekStore((s) => s.disabledBuiltins)
  const enableBuiltin = useWeekStore((s) => s.enableBuiltin)
  const enableAllBuiltins = useWeekStore((s) => s.enableAllBuiltins)

  const entries = disabledBuiltins
    .map((d) => ({ ...d, task: ALL_BUILTINS.find((t) => t.id === d.id) }))
    .filter((e) => e.task != null)

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-elevated border border-border rounded-xl p-6 w-[480px] max-w-[92vw] flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="m-0 text-[15px] font-semibold text-text">Deleted tasks</h3>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/70 bg-transparent border-none cursor-pointer text-[18px] leading-none"
          >
            ✕
          </button>
        </div>

        <p className="m-0 text-[12px] text-white/40 font-ui">
          Deleted tasks will be removed automatically after 24 hours.
        </p>

        {entries.length === 0 ? (
          <p className="text-[13px] text-white/40 font-ui">No deleted tasks.</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {entries.map(({ id, disabledAt, task }) => {
              const dayLabel = task!.dayIndex !== undefined ? DAYS[task!.dayIndex].label : 'Daily'
              return (
                <div
                  key={id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-card border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="m-0 text-[13px] text-white/80 font-ui truncate">{task!.label}</p>
                    <p className="m-0 text-[11px] text-white/30 font-ui mt-0.5">
                      {dayLabel} · {timeLeft(disabledAt)}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {task!.tags.map((tag) => {
                      const [color] = TAG_COLORS[tag] ?? ['rgba(255,255,255,0.4)']
                      return <TagChip key={tag} tag={tag} color={color} size="xs" />
                    })}
                  </div>
                  <button
                    onClick={() => enableBuiltin(id)}
                    className="shrink-0 px-2.5 py-1 rounded-md border border-white/15 bg-transparent text-white/50 hover:text-white/80 hover:border-white/30 font-ui text-[11px] cursor-pointer transition-colors"
                  >
                    Recover
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {entries.length > 1 && (
          <button
            onClick={() => { enableAllBuiltins(); onClose() }}
            className="self-end px-4 py-1.5 rounded-md border border-white/15 bg-transparent text-white/50 hover:text-white/80 font-ui text-[12px] cursor-pointer transition-colors"
          >
            Recover all
          </button>
        )}
      </div>
    </div>
  )
}
