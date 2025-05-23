import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getClientById, getClientStats } from "@/lib/data"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Calendar, ClipboardList } from "lucide-react"
import { ClientDetail } from "@/components/client-detail"
import { cookies } from "next/headers"

export default function ClientPage({
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

  const stats = getClientStats(params.id)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/clients">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">{client.name}</h1>
        </div>
        <div className="flex space-x-2">
          <Link href={`/dashboard/clients/${params.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Link href={`/dashboard/clients/${params.id}/sessions`}>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Sessions
            </Button>
          </Link>
          <Link href={`/dashboard/clients/${params.id}/tasks`}>
            <Button variant="outline">
              <ClipboardList className="mr-2 h-4 w-4" />
              Tasks
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientDetail client={client} stats={stats} />
        </CardContent>
      </Card>
    </div>
  )
}
