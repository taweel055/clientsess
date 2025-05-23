import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Filter } from "lucide-react"
import { getTasks } from "@/lib/data"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { TaskFilters } from "@/components/task-filters"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function TasksPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Check if user is authenticated
  const cookieStore = cookies()
  const isAuthenticated = cookieStore.has("authenticated")

  if (!isAuthenticated) {
    redirect("/login")
  }

  const status = typeof searchParams.status === "string" ? searchParams.status : ""
  const priority = typeof searchParams.priority === "string" ? searchParams.priority : ""
  const dueDate = typeof searchParams.dueDate === "string" ? searchParams.dueDate : ""

  // Get tasks with filters
  const tasks = getTasks({ status, priority, dueDate })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Tasks</h1>
        <Link href="/dashboard/tasks/new">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TaskFilters initialStatus={status} initialPriority={priority} initialDueDate={dueDate} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskList tasks={tasks} />
        </CardContent>
      </Card>
    </div>
  )
}
