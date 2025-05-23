"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search, X } from "lucide-react"

interface SessionSearchFormProps {
  initialQuery?: string
  initialType?: string
  initialStatus?: string
}

export function SessionSearchForm({ initialQuery = "", initialType = "", initialStatus = "" }: SessionSearchFormProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [sessionType, setSessionType] = useState<string>(initialType)
  const [status, setStatus] = useState<string>(initialStatus)
  const [showAdvanced, setShowAdvanced] = useState(initialType !== "" || initialStatus !== "")

  useEffect(() => {
    setQuery(initialQuery)
    setSessionType(initialType)
    setStatus(initialStatus)
  }, [initialQuery, initialType, initialStatus])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (query) params.set("query", query)
    if (sessionType) params.set("type", sessionType)
    if (status) params.set("status", status)

    router.push(`/dashboard/sessions?${params.toString()}`)
  }

  const handleReset = () => {
    setQuery("")
    setSessionType("")
    setStatus("")
    router.push("/dashboard/sessions")
  }

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by client name, notes, or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="flex-1 sm:flex-none">
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex-1 sm:flex-none"
          >
            {showAdvanced ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="session-type">Session Type</Label>
            <Select value={sessionType} onValueChange={setSessionType}>
              <SelectTrigger id="session-type">
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any type</SelectItem>
                <SelectItem value="Initial">Initial</SelectItem>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
                <SelectItem value="Assessment">Assessment</SelectItem>
                <SelectItem value="Therapy">Therapy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Any status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any status</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2 md:col-span-1 flex items-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="flex items-center w-full sm:w-auto"
            >
              <X className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}
