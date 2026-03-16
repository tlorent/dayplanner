import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { TAG_COLORS } from '../data/tasks'
import { selectIsChecked, useWeekStore } from '../store/useWeekStore'
import type { Task } from '../types'
import { AddTaskModal } from './AddTaskModal'
import { TagChip } from './TagChip'

interface Props {
  task: Task
  sortable?: boolean
}

export function TaskRow({ task, sortable }: Props) {
  const toggleTask = useWeekStore((s) => s.toggleTask)
  const disableBuiltin = useWeekStore((s) => s.disableBuiltin)
  const isChecked = useWeekStore((s) => selectIsChecked(s.checked, task.id))
  const [popping, setPopping] = useState(false)
  const [flashing, setFlashing] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const prevChecked = useRef(isChecked)
  // Only apply entry animation on first mount
  const mounted = useRef(false)
  const animateIn = !mounted.current
  useEffect(() => {
    mounted.current = true
  }, [])

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: !sortable,
  })

  useEffect(() => {
    if (!prevChecked.current && isChecked) {
      setPopping(true)
      setFlashing(true)
      setTimeout(() => setPopping(false), 280)
    }
    prevChecked.current = isChecked
  }, [isChecked])

  const isCustom = task.source === 'custom'
  const customTags = useWeekStore((s) => s.customTags)

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isCustom) {
      setEditOpen(true)
    } else {
      disableBuiltin(task.id)
    }
  }

  return (
    <>
      {/* Wrapper needed to position the action button outside the clickable row */}
      <div
        ref={setNodeRef}
        className="group relative border-b border-white/4"
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.4 : 1,
        }}
      >
        <button
          type="button"
          className={[
            'task-row flex items-center gap-2.5 px-3.5 py-2.5 w-full text-left cursor-pointer transition-colors duration-150 hover:bg-hover',
            animateIn ? 'task-animate-in' : '',
            flashing ? 'green-flash' : '',
          ].join(' ')}
          onClick={() => toggleTask(task.id)}
          onAnimationEnd={(e) => {
            if (e.animationName === 'greenFlash') setFlashing(false)
          }}
        >
          {/* Drag handle */}
          {sortable && (
            // biome-ignore lint/a11y/noStaticElementInteractions: dnd-kit spreads role/keyboard handlers via {...attributes} {...listeners}
            <span
              {...attributes}
              {...listeners}
              className="text-white/30 text-[11px] cursor-grab active:cursor-grabbing shrink-0 select-none"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              ⠿
            </span>
          )}

          {/* Checkbox */}
          <div
            className={[
              'flex items-center justify-center shrink-0 w-4 h-4 rounded-sm transition-all duration-150',
              popping ? 'check-pop' : '',
            ].join(' ')}
            style={
              isChecked
                ? { background: '#C8922A', border: '1px solid #C8922A' }
                : {
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.20)',
                  }
            }
          >
            {isChecked && (
              <svg
                aria-hidden="true"
                width="9"
                height="7"
                viewBox="0 0 9 7"
                fill="none"
              >
                <path
                  d="M1 3.5L3.5 6L8 1"
                  stroke="#0C0C0C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>

          {/* Label */}
          <span
            className={`flex-1 text-[13.5px] transition-colors duration-200 ${isChecked ? 'text-white/40 line-through' : 'text-white/82'}`}
          >
            {task.label}
          </span>

          {/* Tags (hidden on hover) + action button (shown on hover) — same slot, no layout shift */}
          <div className="relative flex items-center shrink-0">
            <div className="flex gap-1 group-hover:opacity-0 transition-opacity duration-150">
              {task.tags.map((tag) => {
                const customColor = customTags.find(
                  (t) => t.name === tag,
                )?.color
                const color = customColor ?? TAG_COLORS[tag]?.[0]
                return <TagChip key={tag} tag={tag} color={color} size="xs" />
              })}
            </div>
          </div>
        </button>

        {/* Action button — absolutely positioned, outside the row button, no bubbling */}
        <button
          type="button"
          onClick={handleActionClick}
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-white/60 text-[11px] px-1.5 py-0.5 rounded border border-white/20 bg-card hover:bg-hover cursor-pointer"
          title={isCustom ? 'Edit task' : 'Remove task'}
          tabIndex={-1}
        >
          {isCustom ? '✏' : '✕'}
        </button>
      </div>

      {editOpen && isCustom && createPortal(
        <AddTaskModal editTask={task} onClose={() => setEditOpen(false)} />,
        document.body,
      )}
    </>
  )
}
