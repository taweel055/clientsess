import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getClientById } from "@/lib/data"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ClientForm } from "@/components/client-form"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function EditClientPage({
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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/dashboard/clients/${params.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">Edit Client</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm client={client} />
        </CardContent>
      </Card>
    </div>
  )
}
