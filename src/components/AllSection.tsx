import { selectBacklogTasks, useWeekStore } from '../store/useWeekStore'
import { TaskRow } from './TaskRow'

export function AllSection() {
  const activeTag = useWeekStore((s) => s.activeTag)
  const customTasks = useWeekStore((s) => s.customTasks)
  const tasks = selectBacklogTasks(customTasks, activeTag)

  if (tasks.length === 0) {
    return (
      <p className="text-muted text-[13px] py-3">
        {activeTag
          ? `No backlog tasks for '${activeTag}'.`
          : 'No tasks yet. Add some to get started.'}
      </p>
    )
  }

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border">
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} />
      ))}
    </div>
  )
}
