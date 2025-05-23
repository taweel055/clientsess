import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatCurrency } from "@/lib/utils"
import type { Session } from "@/lib/types"
import { FileText, ImageIcon, Paperclip } from "lucide-react"

interface SessionDetailsProps {
  session: Session
}

export function SessionDetails({ session }: SessionDetailsProps) {
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />
    } else if (["pdf", "doc", "docx", "txt"].includes(extension || "")) {
      return <FileText className="h-5 w-5 text-red-500" />
    } else {
      return <Paperclip className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Client Information</h3>
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
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Session Information</h3>
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
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Session Notes</h3>
            <p className="text-sm whitespace-pre-line">{session.notes}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(session.diagnosis || session.treatment || session.followUpPlan) && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Clinical Information</h3>
              <dl className="space-y-4">
                {session.diagnosis && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Diagnosis:</dt>
                    <dd className="text-sm whitespace-pre-line">{session.diagnosis}</dd>
                  </div>
                )}

                {session.treatment && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Treatment Plan:</dt>
                    <dd className="text-sm whitespace-pre-line">{session.treatment}</dd>
                  </div>
                )}

                {session.followUpPlan && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Follow-up Plan:</dt>
                    <dd className="text-sm whitespace-pre-line">{session.followUpPlan}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
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
                <dd className="text-sm col-span-2">{formatCurrency(session.paymentAmount)}</dd>
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

      {session.files && session.files.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Attachments</h3>
            <ul className="space-y-2">
              {session.files.map((file, index) => (
                <li key={index} className="flex items-center p-2 bg-gray-50 rounded-md">
                  {getFileIcon(file)}
                  <span className="ml-2 text-sm">{file}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
