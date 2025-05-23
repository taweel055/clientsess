import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSessions } from "@/lib/data"
import Link from "next/link"
import { Plus } from "lucide-react"
import { SessionSearchForm } from "@/components/session-search-form"
import { DashboardSessionList } from "@/components/dashboard-session-list"

export default function SessionsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const query = typeof searchParams.query === "string" ? searchParams.query : ""
  const type = typeof searchParams.type === "string" ? searchParams.type : ""
  const status = typeof searchParams.status === "string" ? searchParams.status : ""

  // Get data synchronously (no async/await in the component)
  const sessions = getSessions({
    query,
    type,
    status,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Sessions</h1>
        <Link href="/dashboard/sessions/new">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Session
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <SessionSearchForm initialQuery={query} initialType={type} initialStatus={status} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardSessionList sessions={sessions} />
        </CardContent>
      </Card>
    </div>
  )
}
