import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NewTaskForm } from "@/components/new-task-form"

export default function NewTaskPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">New Task</h1>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <NewTaskForm />
        </CardContent>
      </Card>
    </div>
  )
}
