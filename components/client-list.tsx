"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Eye, Calendar, ClipboardList } from "lucide-react"
import Link from "next/link"
import type { Client } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"

interface ClientListProps {
  clients: Client[]
}

export function ClientList({ clients }: ClientListProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/clients/${clientToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        toast({
          title: "Client deleted",
          description: `${clientToDelete.name} has been deleted successfully.`,
        })
        router.refresh()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete client",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting client:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setClientToDelete(null)
    }
  }

  if (clients.length === 0) {
    return <div className="text-center py-6 text-gray-500">No clients found. Add your first client to get started.</div>
  }

  return (
    <>
      <div className="rounded-md border">
        <div className="grid grid-cols-1 md:grid-cols-5 p-4 font-medium border-b">
          <div>Name</div>
          <div className="hidden md:block">Contact</div>
          <div className="hidden md:block">Occupation</div>
          <div className="hidden md:block">Notes</div>
          <div className="hidden md:block text-right">Actions</div>
        </div>

        <div className="divide-y">
          {clients.map((client) => (
            <div key={client.id} className="grid grid-cols-1 md:grid-cols-5 p-4 hover:bg-gray-50">
              <div className="font-medium">{client.name}</div>
              <div className="text-gray-500 md:mt-0 mt-1">
                {client.email}
                <br />
                {client.phone}
              </div>
              <div className="text-gray-500 md:mt-0 mt-1">{client.occupation || "Not specified"}</div>
              <div className="text-gray-500 md:mt-0 mt-1 truncate">{client.notes || "No notes"}</div>
              <div className="flex md:justify-end space-x-2 md:mt-0 mt-3">
                <Link href={`/dashboard/clients/${client.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4 text-gray-500" />
                  </Button>
                </Link>
                <Link href={`/dashboard/clients/${client.id}/edit`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4 text-gray-500" />
                  </Button>
                </Link>
                <Link href={`/dashboard/clients/${client.id}/sessions`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Calendar className="h-4 w-4 text-blue-500" />
                  </Button>
                </Link>
                <Link href={`/dashboard/clients/${client.id}/tasks`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ClipboardList className="h-4 w-4 text-green-500" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500"
                  onClick={() => handleDeleteClick(client)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {clientToDelete?.name} and all associated sessions and tasks. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
