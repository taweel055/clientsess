import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSessionById } from "@/lib/data"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Edit } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function SessionPage({
  params,
}: {
  params: { id: string }
}) {
  const session = getSessionById(params.id)

  if (!session) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/sessions">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Session Details</h1>
        </div>
        <Link href={`/dashboard/sessions/${params.id}/edit`}>
          <Button className="w-full sm:w-auto">
            <Edit className="mr-2 h-4 w-4" />
            Edit Session
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-gray-500">Name:</dt>
                <dd className="text-sm col-span-2">{session.clientName}</dd>
              </div>

              {session.clientEmail && (
                <div className="grid grid-cols-3 gap-1">
                  <dt className="text-sm font-medium text-gray-500">Email:</dt>
                  <dd className="text-sm col-span-2">{session.clientEmail}</dd>
                </div>
              )}

              {session.clientPhone && (
                <div className="grid grid-cols-3 gap-1">
                  <dt className="text-sm font-medium text-gray-500">Phone:</dt>
                  <dd className="text-sm col-span-2">{session.clientPhone}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-gray-500">Date:</dt>
                <dd className="text-sm col-span-2">{formatDate(session.sessionDate)}</dd>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-gray-500">Type:</dt>
                <dd className="text-sm col-span-2">{session.sessionType}</dd>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-gray-500">Status:</dt>
                <dd className="text-sm col-span-2">
                  <Badge
                    variant={
                      session.status === "Completed"
                        ? "default"
                        : session.status === "Scheduled"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {session.status}
                  </Badge>
                </dd>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-gray-500">Duration:</dt>
                <dd className="text-sm col-span-2">{session.duration} minutes</dd>
              </div>

              {session.location && (
                <div className="grid grid-cols-3 gap-1">
                  <dt className="text-sm font-medium text-gray-500">Location:</dt>
                  <dd className="text-sm col-span-2">{session.location}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>

      {session.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Session Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{session.notes}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(session.diagnosis || session.treatment || session.followUpPlan) && (
          <Card>
            <CardHeader>
              <CardTitle>Clinical Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                {session.diagnosis && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Diagnosis:</dt>
                    <dd className="whitespace-pre-line">{session.diagnosis}</dd>
                  </div>
                )}

                {session.treatment && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Treatment Plan:</dt>
                    <dd className="whitespace-pre-line">{session.treatment}</dd>
                  </div>
                )}

                {session.followUpPlan && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Follow-up Plan:</dt>
                    <dd className="whitespace-pre-line">{session.followUpPlan}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-gray-500">Status:</dt>
                <dd className="text-sm col-span-2">
                  <Badge
                    variant={
                      session.paymentStatus === "Paid"
                        ? "default"
                        : session.paymentStatus === "Pending"
                          ? "outline"
                          : session.paymentStatus === "Partial"
                            ? "secondary"
                            : "destructive"
                    }
                  >
                    {session.paymentStatus}
                  </Badge>
                </dd>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-gray-500">Amount:</dt>
                <dd className="text-sm col-span-2">${session.paymentAmount.toFixed(2)}</dd>
              </div>

              {session.paymentMethod && (
                <div className="grid grid-cols-3 gap-1">
                  <dt className="text-sm font-medium text-gray-500">Method:</dt>
                  <dd className="text-sm col-span-2">{session.paymentMethod}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
