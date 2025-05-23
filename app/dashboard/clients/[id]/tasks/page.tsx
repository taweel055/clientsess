import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getClientById, getTasksByClientId } from "@/lib/data"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { TaskList } from "@/components/task-list"
import { cookies } from "next/headers"

export default function ClientTasksPage({
  params,
}: {
  params: { id: string }
}) {
  // Check if user is authenticated
  const cookieStore = cookies()
  const isAuthenticated = cookieStore.has("authenticated")

  if (!isAuthenticated) {
    redirect("/login")
  }

  const client = getClientById(params.id)

  if (!client) {
    notFound()
  }

  const tasks = getTasksByClientId(params.id)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/clients/${params.id}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Tasks for {client.name}</h1>
        </div>
        <Link href={`/dashboard/tasks/new?clientId=${params.id}`}>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <TaskList tasks={tasks} />
          ) : (
            <div className="text-center py-6 text-gray-500">
              No tasks found for this client. Create your first task to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
