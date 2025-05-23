import { NextResponse } from "next/server"
import { getClientById, updateClient, deleteClient, getClientStats } from "@/lib/data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const client = getClientById(params.id)

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  }

  // Get client stats
  const stats = getClientStats(params.id)

  return NextResponse.json({ client, stats })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const clientData = await request.json()
    const success = updateClient(params.id, clientData)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error updating client:", error)
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const success = deleteClient(params.id)

  if (success) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  }
}
