"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface CalendarEvent {
  id: string
  title: string
  date: string
  type: "session" | "task"
  status: string
  clientName?: string
}

interface CalendarViewProps {
  events: CalendarEvent[]
  initialMonth: number
  initialYear: number
}

export function CalendarView({ events, initialMonth, initialYear }: CalendarViewProps) {
  const router = useRouter()
  const [month, setMonth] = useState(initialMonth)
  const [year, setYear] = useState(initialYear)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
      router.push(`/dashboard/calendar?month=11&year=${year - 1}`)
    } else {
      setMonth(month - 1)
      router.push(`/dashboard/calendar?month=${month - 1}&year=${year}`)
    }
  }

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
      router.push(`/dashboard/calendar?month=0&year=${year + 1}`)
    } else {
      setMonth(month + 1)
      router.push(`/dashboard/calendar?month=${month + 1}&year=${year}`)
    }
  }

  const getEventsForDay = (day: number) => {
    const date = new Date(year, month, day).toISOString().split("T")[0]
    return events.filter((event) => new Date(event.date).toISOString().split("T")[0] === date)
  }

  const today = new Date()
  const isToday = (day: number) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {monthNames[month]} {year}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the first day of the month */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square p-1 bg-gray-50 border border-gray-200 rounded-md"></div>
        ))}

        {/* Calendar days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dayEvents = getEventsForDay(day)
          const hasEvents = dayEvents.length > 0

          return (
            <div
              key={`day-${day}`}
              className={`
                aspect-square p-1 border rounded-md flex flex-col
                ${isToday(day) ? "border-blue-500 border-2" : "border-gray-200"}
                ${hasEvents ? "bg-white" : "bg-gray-50"}
              `}
            >
              <div className="text-right text-sm font-medium mb-1">{day}</div>
              <div className="flex-1 overflow-hidden">
                {dayEvents.slice(0, 3).map((event) => (
                  <Link
                    key={event.id}
                    href={
                      event.type === "session" ? `/dashboard/sessions/${event.id}` : `/dashboard/tasks/${event.id}/edit`
                    }
                    className={`
                      block text-xs truncate mb-1 px-1 py-0.5 rounded
                      ${event.type === "session" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}
                    `}
                  >
                    {event.title}
                  </Link>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-center text-gray-500">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-center space-x-4 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-sm">Sessions</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
          <span className="text-sm">Tasks</span>
        </div>
      </div>
    </div>
  )
}
