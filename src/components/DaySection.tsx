import { useWeekStore, selectDayTasks } from '../store/useWeekStore'
import { TaskRow } from './TaskRow'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'

export function DaySection() {
  const activeDay = useWeekStore((s) => s.activeDay)
  const activeTag = useWeekStore((s) => s.activeTag)
  const customTasks = useWeekStore((s) => s.customTasks)
  const order = useWeekStore((s) => s.dayTaskOrder[s.activeDay])
  const disabledBuiltins = useWeekStore((s) => s.disabledBuiltins)
  const reorderDayTasks = useWeekStore((s) => s.reorderDayTasks)
  const tasks = selectDayTasks(customTasks, activeTag, activeDay, order, disabledBuiltins)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = tasks.findIndex((t) => t.id === active.id)
    const newIndex = tasks.findIndex((t) => t.id === over.id)
    const newOrder = arrayMove(tasks, oldIndex, newIndex).map((t) => t.id)
    reorderDayTasks(activeDay, newOrder)
  }

  if (tasks.length === 0) {
    return (
      <p className="text-muted text-[13px] py-3">
        {activeTag ? `No day-specific tasks for '${activeTag}'.` : 'No day-specific tasks today. Enjoy life!'}
      </p>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="bg-card rounded-lg overflow-hidden border border-border">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} sortable />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
