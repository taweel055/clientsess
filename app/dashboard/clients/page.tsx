import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { getClients } from "@/lib/data"
import Link from "next/link"
import { ClientList } from "@/components/client-list"

export default function ClientsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const query = typeof searchParams.query === "string" ? searchParams.query : ""

  // Get clients with search query
  const clients = getClients(query)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Clients</h1>
        <Link href="/dashboard/clients/new">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add New Client
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="relative mb-6" action="/dashboard/clients">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input type="text" name="query" placeholder="Search clients..." className="pl-9" defaultValue={query} />
            <input type="submit" hidden />
          </form>

          <ClientList clients={clients} />
        </CardContent>
      </Card>
    </div>
  )
}
