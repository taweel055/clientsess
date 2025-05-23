import { NextResponse } from "next/server"
import { getTaskById, updateTask, deleteTask } from "@/lib/data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const task = getTaskById(params.id)

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  return NextResponse.json(task)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskData = await request.json()
    const success = updateTask(params.id, taskData)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const success = deleteTask(params.id)

  if (success) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }
}
