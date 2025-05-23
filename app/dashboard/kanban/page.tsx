import { getKanbanTasks } from "@/lib/data"
import { KanbanBoard } from "@/components/kanban-board"

export default function KanbanPage() {
  const kanbanTasks = getKanbanTasks()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Kanban Board</h1>
      <KanbanBoard tasks={kanbanTasks} />
    </div>
  )
}
