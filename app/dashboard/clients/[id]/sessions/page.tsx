import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getClientById, getSessionsByClientId } from "@/lib/data"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { SessionTable } from "@/components/session-table"
import { cookies } from "next/headers"

export default function ClientSessionsPage({
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

  const sessions = getSessionsByClientId(params.id)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/clients/${params.id}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">{client.name}&apos;s Sessions</h1>
        </div>
        <Link href={`/dashboard/sessions/new?clientId=${params.id}`}>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Session
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length > 0 ? (
            <SessionTable sessions={sessions} />
          ) : (
            <div className="text-center py-6 text-gray-500">
              No sessions found for this client. Create your first session to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
