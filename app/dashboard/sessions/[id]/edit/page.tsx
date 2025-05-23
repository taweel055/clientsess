import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSessionById } from "@/lib/sessions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SessionForm } from "@/components/session-form"
import { Suspense } from "react"

export default async function EditSessionPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSessionById(params.id)

  if (!session) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/dashboard/sessions/${params.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Session</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading session form...</div>}>
            <SessionForm session={session} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
