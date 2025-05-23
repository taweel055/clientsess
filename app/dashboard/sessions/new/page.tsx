import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NewSessionForm } from "@/components/new-session-form"

export default function NewSessionPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">New Session</h1>

      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent>
          <NewSessionForm />
        </CardContent>
      </Card>
    </div>
  )
}
