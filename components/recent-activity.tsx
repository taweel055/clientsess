"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import type { Session } from "@prisma/client"

interface RecentActivityProps {
  sessions: (Session & {
    client: {
      name: string
    } | null
  })[]
}

function formatDate(date: Date | null): string {
  if (!date) return 'No date'
  try {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Invalid date'
  }
}

export function RecentActivity({ sessions }: RecentActivityProps) {
  // Sort activities by date (most recent first)
  const sortedSessions = [...sessions].sort((a, b) => {
    if (!a.date) return 1
    if (!b.date) return -1
    return b.date.getTime() - a.date.getTime()
  }).slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedSessions.map(session => (
            <div key={session.id} className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
              <div>
                <div className="font-medium">{session.type} session</div>
                <div className="text-sm text-gray-500">{session.client?.name || 'Unknown Client'}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatDate(session.date)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
