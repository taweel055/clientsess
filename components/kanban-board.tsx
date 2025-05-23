"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import type { Task, KanbanColumn } from "@/lib/types"

interface KanbanBoardProps {
  tasks: Record<KanbanColumn, Task[]>
}

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const router = useRouter()
  const [draggingTask, setDraggingTask] = useState<Task | null>(null)

  const handleDragStart = (task: Task) => {
    setDraggingTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, targetStatus: KanbanColumn) => {
    e.preventDefault()

    if (!draggingTask || draggingTask.status === targetStatus) {
      return
    }

    try {
      const response = await fetch(`/api/tasks/${draggingTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: targetStatus,
        }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating task:", error)
    } finally {
      setDraggingTask(null)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const columns: { id: KanbanColumn; title: string; color: string }[] = [
    { id: "todo", title: "To Do", color: "bg-gray-100" },
    { id: "in-progress", title: "In Progress", color: "bg-blue-100" },
    { id: "completed", title: "Completed", color: "bg-green-100" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => (
        <div key={column.id} className="flex flex-col h-full">
          <div className={`p-4 rounded-t-lg ${column.color}`}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{column.title}</h2>
              <Badge>{tasks[column.id].length}</Badge>
            </div>
          </div>
          <div
            className="flex-1 p-4 bg-gray-50 rounded-b-lg overflow-auto min-h-[500px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="space-y-3">
              {tasks[column.id].map((task) => (
                <Card key={task.id} className="p-3 cursor-move" draggable onDragStart={() => handleDragStart(task)}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium">{task.title}</h3>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => router.push(`/dashboard/tasks/${task.id}/edit`)}
                        >
                          <Edit className="h-3.5 w-3.5 text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-red-500"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    {task.clientName && <p className="text-xs text-gray-500">Client: {task.clientName}</p>}
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                        {formatDate(task.dueDate)}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
              {tasks[column.id].length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">No tasks</div>
              )}
              {column.id === "todo" && (
                <Link href="/dashboard/tasks/new">
                  <Button variant="outline" className="w-full mt-3">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
