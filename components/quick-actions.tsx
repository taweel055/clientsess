"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Calendar, UserPlus, FileText, ClipboardList, Kanban } from "lucide-react"
import { useRouter } from "next/navigation"

export function QuickActions() {
  const router = useRouter()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <Button
            variant="outline"
            className="h-auto flex flex-col items-center justify-center p-4 gap-2"
            onClick={() => router.push("/dashboard/sessions/new")}
          >
            <PlusCircle className="h-6 w-6 text-blue-500" />
            <span className="text-sm text-center">New Session</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex flex-col items-center justify-center p-4 gap-2"
            onClick={() => router.push("/dashboard/calendar")}
          >
            <Calendar className="h-6 w-6 text-green-500" />
            <span className="text-sm text-center">Calendar</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex flex-col items-center justify-center p-4 gap-2"
            onClick={() => router.push("/dashboard/tasks/new")}
          >
            <ClipboardList className="h-6 w-6 text-orange-500" />
            <span className="text-sm text-center">New Task</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex flex-col items-center justify-center p-4 gap-2"
            onClick={() => router.push("/dashboard/kanban")}
          >
            <Kanban className="h-6 w-6 text-purple-500" />
            <span className="text-sm text-center">Kanban</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex flex-col items-center justify-center p-4 gap-2"
            onClick={() => router.push("/dashboard/clients")}
          >
            <UserPlus className="h-6 w-6 text-indigo-500" />
            <span className="text-sm text-center">Add Client</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex flex-col items-center justify-center p-4 gap-2"
            onClick={() => router.push("/dashboard/reports")}
          >
            <FileText className="h-6 w-6 text-red-500" />
            <span className="text-sm text-center">Reports</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
