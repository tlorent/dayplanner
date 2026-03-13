import { useState, useRef, useEffect } from 'react'
import type { Task } from '../types'
import { useWeekStore, selectIsChecked } from '../store/useWeekStore'
import { TagChip } from './TagChip'
import { TAG_COLORS } from '../data/tasks'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AddTaskModal } from './AddTaskModal'

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
  useEffect(() => { mounted.current = true }, [])

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
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
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.4 : 1,
        }}
        className={[
          'task-row group flex items-center gap-2.5 px-3.5 py-2.5 border-b border-white/4 cursor-pointer transition-colors duration-150 hover:bg-hover',
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
          <span
            {...attributes}
            {...listeners}
            className="text-white/30 text-[11px] cursor-grab active:cursor-grabbing shrink-0 select-none"
            onClick={(e) => e.stopPropagation()}
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
          style={isChecked
            ? { background: '#C8922A', border: '1px solid #C8922A' }
            : { background: 'transparent', border: '1px solid rgba(255,255,255,0.20)' }
          }
        >
          {isChecked && (
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
              <path d="M1 3.5L3.5 6L8 1" stroke="#0C0C0C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>

        {/* Label */}
        <span className={`flex-1 text-[13.5px] transition-colors duration-200 ${isChecked ? 'text-white/40 line-through' : 'text-white/82'}`}>
          {task.label}
        </span>

        {/* Tags */}
        <div className="flex gap-1">
          {task.tags.map((tag) => {
            const customColor = customTags.find((t) => t.name === tag)?.color
            const color = customColor ?? TAG_COLORS[tag]?.[0]
            return <TagChip key={tag} tag={tag} color={color} size="xs" />
          })}
        </div>

        {/* Edit / Hide button — zero width when hidden (no horizontal space), full width on hover */}
        <div className="overflow-hidden w-0 group-hover:w-10 group-hover:ml-1 transition-[width,margin] duration-150 shrink-0">
          <button
            onClick={handleActionClick}
            className="whitespace-nowrap text-white/60 text-[11px] px-1.5 py-0.5 rounded border border-white/20 bg-transparent cursor-pointer pointer-events-none group-hover:pointer-events-auto"
            title={isCustom ? 'Taak bewerken' : 'Taak verbergen'}
            tabIndex={-1}
          >
            {isCustom ? '✏' : '✕'}
          </button>
        </div>
      </div>

      {editOpen && isCustom && (
        <AddTaskModal editTask={task} onClose={() => setEditOpen(false)} />
      )}
    </>
  )
}
