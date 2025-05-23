"use client"

import { SessionTable } from "@/components/session-table"
import type { Session } from "@/lib/types"

interface SessionTableWrapperProps {
  sessions: Session[]
}

export function SessionTableWrapper({ sessions }: SessionTableWrapperProps) {
  return <SessionTable sessions={sessions} />
}
