import { NextResponse } from "next/server"
import { getClients, createClient } from "@/lib/data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query") || ""

  const clients = getClients(query)

  return NextResponse.json(clients)
}

export async function POST(request: Request) {
  try {
    const clientData = await request.json()
    const clientId = createClient(clientData)

    return NextResponse.json({ id: clientId }, { status: 201 })
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
  }
}
