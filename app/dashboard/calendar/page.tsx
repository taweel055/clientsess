import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCalendarEvents } from "@/lib/data"
import { CalendarView } from "@/components/calendar-view"

export default function CalendarPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const currentDate = new Date()
  const month = typeof searchParams.month === "string" ? Number.parseInt(searchParams.month) : currentDate.getMonth()
  const year = typeof searchParams.year === "string" ? Number.parseInt(searchParams.year) : currentDate.getFullYear()

  const events = getCalendarEvents(month, year)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Calendar</h1>

      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarView events={events} initialMonth={month} initialYear={year} />
        </CardContent>
      </Card>
    </div>
  )
}
