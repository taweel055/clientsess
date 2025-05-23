"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface TaskFiltersProps {
  initialStatus?: string
  initialPriority?: string
  initialDueDate?: string
}

export function TaskFilters({ initialStatus = "", initialPriority = "", initialDueDate = "" }: TaskFiltersProps) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [priority, setPriority] = useState(initialPriority)
  const [dueDate, setDueDate] = useState(initialDueDate)

  useEffect(() => {
    setStatus(initialStatus)
    setPriority(initialPriority)
    setDueDate(initialDueDate)
  }, [initialStatus, initialPriority, initialDueDate])

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (status) params.set("status", status)
    if (priority) params.set("priority", priority)
    if (dueDate) params.set("dueDate", dueDate)

    router.push(`/dashboard/tasks?${params.toString()}`)
  }

  const resetFilters = () => {
    setStatus("")
    setPriority("")
    setDueDate("")
    router.push("/dashboard/tasks")
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Any status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger id="priority">
              <SelectValue placeholder="Any priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Select value={dueDate} onValueChange={setDueDate}>
            <SelectTrigger id="dueDate">
              <SelectValue placeholder="Any date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any date</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="upcoming">Next 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={resetFilters} className="flex items-center">
          <X className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button type="button" onClick={applyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
