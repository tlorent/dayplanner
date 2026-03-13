import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Tag, DayIndex, Task } from '../types'
import { useWeekStore, getWeekKey } from '../store/useWeekStore'
import { TAGS, DAYS } from '../data/tasks'
import { TagChip } from './TagChip'

const schema = z.object({
  label: z.string().min(1, 'Voer een taaklabel in.'),
  tags: z.array(z.string()).min(1, 'Selecteer minstens één tag.'),
  type: z.enum(['daily', 'recurring', 'oneoff']),
  dayIndex: z.number().min(0).max(4),
})

type FormValues = z.infer<typeof schema>

interface Props {
  onClose: () => void
  editTask?: Task // if provided, opens in edit mode
}

function taskToFormValues(task: Task, activeDay: DayIndex): FormValues {
  let type: 'daily' | 'recurring' | 'oneoff' = 'recurring'
  if (task.dayIndex === undefined) type = 'daily'
  else if (task.oneOff) type = 'oneoff'
  return {
    label: task.label,
    tags: task.tags,
    type,
    dayIndex: task.dayIndex ?? activeDay,
  }
}

export function AddTaskModal({ onClose, editTask }: Props) {
  const addTask = useWeekStore((s) => s.addTask)
  const updateTask = useWeekStore((s) => s.updateTask)
  const removeTask = useWeekStore((s) => s.removeTask)
  const activeDay = useWeekStore((s) => s.activeDay)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isEditing = !!editTask

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: editTask
      ? taskToFormValues(editTask, activeDay)
      : { label: '', tags: [], type: 'recurring', dayIndex: activeDay },
  })

  const type = watch('type')

  const onSubmit = (data: FormValues) => {
    const patch: Partial<Task> = {
      label: data.label,
      tags: data.tags as Tag[],
      dayIndex: data.type !== 'daily' ? data.dayIndex as DayIndex : undefined,
      oneOff: data.type === 'oneoff',
      createdWeekKey: data.type === 'oneoff' ? getWeekKey() : undefined,
    }

    if (isEditing && editTask) {
      updateTask(editTask.id, patch)
    } else {
      addTask({ id: `custom-${Date.now()}`, source: 'custom', ...patch } as Task)
    }
    onClose()
  }

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    if (!editTask) return
    removeTask(editTask.id)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-elevated border border-border rounded-xl p-6 w-95 max-w-[90vw]">
        <h3 className="m-0 mb-5 text-[15px] font-semibold text-text">
          {isEditing ? 'Taak bewerken' : 'Taak toevoegen'}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* Label */}
          <div>
            <label className="block text-[11px] text-muted uppercase tracking-[0.06em] mb-1.5">
              Taak
            </label>
            <input
              {...register('label')}
              autoFocus
              placeholder="Wat moet er gebeuren?"
              className="w-full bg-card border border-border rounded-md px-3 py-2 text-text text-[13.5px] font-ui outline-none focus:border-white/20 transition-colors"
            />
            {errors.label && <p className="text-[#FF6B6B] text-[11px] mt-1">{errors.label.message}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[11px] text-muted uppercase tracking-[0.06em] mb-2">
              Tags
            </label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-1.5">
                  {TAGS.map((tag) => {
                    const active = field.value.includes(tag)
                    return (
                      <TagChip
                        key={tag}
                        tag={tag as Tag}
                        active={active}
                        onClick={() => {
                          field.onChange(
                            active ? field.value.filter((t) => t !== tag) : [...field.value, tag]
                          )
                        }}
                      />
                    )
                  })}
                </div>
              )}
            />
            {errors.tags && <p className="text-[#FF6B6B] text-[11px] mt-1">{errors.tags.message}</p>}
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-[11px] text-muted uppercase tracking-[0.06em] mb-2">
              Frequentie
            </label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  {([
                    { value: 'daily', label: 'Dagelijks' },
                    { value: 'recurring', label: 'Terugkerend (specifieke dag)' },
                    { value: 'oneoff', label: 'Eenmalig (specifieke dag)' },
                  ] as const).map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={field.value === value}
                        onChange={() => field.onChange(value)}
                        className="accent-white w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className="text-[13px] font-ui text-text">{label}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Day selector */}
          {type !== 'daily' && (
            <div>
              <label className="block text-[11px] text-muted uppercase tracking-[0.06em] mb-2">
                Dag
              </label>
              <Controller
                name="dayIndex"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-1.5">
                    {DAYS.map((d, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => field.onChange(i)}
                        className={[
                          'px-2.5 py-1 rounded-md text-[11px] font-ui cursor-pointer transition-all duration-150 border',
                          field.value === i
                            ? 'border-white/25 bg-white/10 text-text'
                            : 'border-border bg-transparent text-muted hover:bg-hover',
                        ].join(' ')}
                      >
                        {d.short}
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-between mt-1">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                className={`px-4 py-1.5 rounded-md border text-[13px] font-ui cursor-pointer transition-all duration-150 ${
                  confirmDelete
                    ? 'border-red-500/70 bg-red-500/15 text-red-400 hover:bg-red-500/25'
                    : 'border-red-500/40 bg-transparent text-red-400/70 hover:bg-red-500/10 hover:text-red-400'
                }`}
              >
                {confirmDelete ? 'Zeker weten?' : 'Verwijderen'}
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-md border border-border bg-transparent text-muted text-[13px] font-ui cursor-pointer transition-all duration-150 hover:bg-hover"
              >
                Annuleren
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-md border-none bg-white/90 text-bg text-[13px] font-semibold font-ui cursor-pointer"
              >
                {isEditing ? 'Opslaan' : 'Toevoegen'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
