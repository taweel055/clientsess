import { NextResponse } from "next/server"
import { createTask, getTasks } from "@/lib/data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") || ""
  const priority = searchParams.get("priority") || ""
  const clientId = searchParams.get("clientId") || ""
  const assignedTo = searchParams.get("assignedTo") || ""
  const dueDate = searchParams.get("dueDate") || ""

  const tasks = getTasks({ status, priority, clientId, assignedTo, dueDate })

  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  try {
    const taskData = await request.json()
    const taskId = createTask(taskData)

    return NextResponse.json({ id: taskId }, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
