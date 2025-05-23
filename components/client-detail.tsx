import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, Briefcase, Calendar, ClipboardList, Clock } from "lucide-react"
import type { Client } from "@/lib/types"

interface ClientDetailProps {
  client: Client
  stats: {
    totalSessions: number
    upcomingSessions: number
    totalTasks: number
    completedTasks: number
    lastSessionDate: string | null
  }
}

export function ClientDetail({ client, stats }: ClientDetailProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact Information</h3>

          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <div className="font-medium">Email</div>
              <div className="text-gray-500">{client.email || "Not provided"}</div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <div className="font-medium">Phone</div>
              <div className="text-gray-500">{client.phone || "Not provided"}</div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Briefcase className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <div className="font-medium">Occupation</div>
              <div className="text-gray-500">{client.occupation || "Not specified"}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Activity Summary</h3>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center space-x-4">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-500">Total Sessions</div>
                  <div className="text-2xl font-bold">{stats.totalSessions}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center space-x-4">
                <ClipboardList className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-sm text-gray-500">Tasks</div>
                  <div className="text-2xl font-bold">
                    {stats.completedTasks}/{stats.totalTasks}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <div className="font-medium">Last Session</div>
              <div className="text-gray-500">
                {stats.lastSessionDate ? new Date(stats.lastSessionDate).toLocaleDateString() : "No sessions yet"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notes</h3>
        <div className="p-4 rounded-md bg-gray-50 min-h-[100px]">
          {client.notes || "No notes available for this client."}
        </div>
      </div>
    </div>
  )
}
