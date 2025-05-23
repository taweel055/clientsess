"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

export function AppWalkthrough() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  // Check if this is the first visit
  useEffect(() => {
    const hasSeenWalkthrough = localStorage.getItem("hasSeenWalkthrough")
    if (!hasSeenWalkthrough) {
      setOpen(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem("hasSeenWalkthrough", "true")
    setOpen(false)
  }

  const steps = [
    {
      title: "Welcome to Client Session Tracker",
      description: "This walkthrough will guide you through the main features of the application. Let&apos;s get started!",
      image: "/welcome-screen.png",
    },
    {
      title: "Dashboard",
      description:
        "The dashboard gives you an overview of your practice with key metrics, upcoming sessions, and recent activity.",
      image: "/metrics-dashboard.png",
    },
    {
      title: "Sessions",
      description: "Manage all your client sessions. Create new sessions, view details, and track payment status.",
      image: "/session-management-interface.png",
    },
    {
      title: "Calendar",
      description: "View your schedule in a calendar format. See both sessions and tasks with their due dates.",
      image: "/placeholder.svg?height=200&width=400&query=calendar%20view%20with%20appointments",
    },
    {
      title: "Task Management",
      description:
        "Keep track of your tasks with the task list and Kanban board. Organize tasks by status and priority.",
      image: "/placeholder.svg?height=200&width=400&query=kanban%20board%20with%20tasks",
    },
    {
      title: "Client Management",
      description: "Maintain a comprehensive client directory. View client details, sessions, and related tasks.",
      image: "/placeholder.svg?height=200&width=400&query=client%20management%20interface",
    },
    {
      title: "Dark Mode",
      description: "Toggle between light and dark mode using the theme toggle in the navigation bar.",
      image: "/placeholder.svg?height=200&width=400&query=dark%20mode%20toggle%20demonstration",
    },
    {
      title: "Mobile Experience",
      description:
        "The application is fully responsive. On mobile, swipe from the left edge to open the navigation menu.",
      image: "/placeholder.svg?height=200&width=400&query=mobile%20app%20with%20swipe%20gesture",
    },
    {
      title: "You're All Set!",
      description:
        "You're now ready to use the Client Session Tracker. If you need to see this walkthrough again, you can find it in the Settings page.",
      image: "/placeholder.svg?height=200&width=400&query=success%20completion%20screen",
    },
  ]

  const currentStep = steps[step]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{currentStep.title}</DialogTitle>
          <DialogDescription>{currentStep.description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center p-4">
          <Image
            src={currentStep.image || "/placeholder.svg"}
            alt={currentStep.title}
            className="rounded-md border shadow-sm"
            width={400}
            height={200}
          />
        </div>
        <DialogFooter className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              {step + 1} of {steps.length}
            </span>
            {step < steps.length - 1 ? (
              <Button variant="outline" size="sm" onClick={() => setStep(Math.min(steps.length - 1, step + 1))}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button variant="default" size="sm" onClick={handleClose}>
                Finish
              </Button>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="rounded-full p-0 w-8 h-8">
            <X className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
