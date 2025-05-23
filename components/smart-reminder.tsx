"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { BellRing, Clock, MapPin, Plus, Trash2, Edit2, CheckCircle2, Filter } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Reminder {
  id: string
  title: string
  time: string
  frequency: "once" | "daily" | "weekly" | "monthly"
  locationBased: boolean
  location?: string
  contextual: boolean
  context?: string
  completed: boolean
  category?: string
  createdAt: number
}

const STORAGE_KEY = "smart-reminders"

export function SmartReminder() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [newReminder, setNewReminder] = useState<Omit<Reminder, "id" | "createdAt">>({
    title: "",
    time: "",
    frequency: "once",
    locationBased: false,
    contextual: false,
    completed: false,
  })
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const { toast } = useToast()

  // Load reminders from localStorage
  useEffect(() => {
    const savedReminders = localStorage.getItem(STORAGE_KEY)
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders))
    }
  }, [])

  // Save reminders to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
  }, [reminders])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key === "n") {
          e.preventDefault()
          setIsAdding(!isAdding)
        } else if (e.key === "Escape" && (isAdding || editingId)) {
          e.preventDefault()
          setIsAdding(false)
          setEditingId(null)
          setNewReminder({
            title: "",
            time: "",
            frequency: "once",
            locationBased: false,
            contextual: false,
            completed: false,
          })
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isAdding, editingId])

  const handleAddReminder = useCallback(() => {
    setError(null)

    if (!newReminder.title.trim()) {
      setError("Please enter a reminder title")
      return
    }

    if (!newReminder.time) {
      setError("Please select a time")
      return
    }

    if (newReminder.locationBased && !newReminder.location?.trim()) {
      setError("Please enter a location")
      return
    }

    if (newReminder.contextual && !newReminder.context?.trim()) {
      setError("Please enter a context")
      return
    }

    const reminder: Reminder = {
      ...newReminder,
      id: Date.now().toString(),
      createdAt: Date.now(),
    }

    setReminders((prev) => [...prev, reminder])
    setNewReminder({
      title: "",
      time: "",
      frequency: "once",
      locationBased: false,
      contextual: false,
      completed: false,
    })
    setIsAdding(false)
    toast({
      title: "Reminder Added",
      description: "Your reminder has been added successfully.",
    })
  }, [newReminder, toast])

  const handleEditReminder = useCallback((reminder: Reminder) => {
    setEditingId(reminder.id)
    setNewReminder({
      title: reminder.title,
      time: reminder.time,
      frequency: reminder.frequency,
      locationBased: reminder.locationBased,
      location: reminder.location,
      contextual: reminder.contextual,
      context: reminder.context,
      completed: reminder.completed,
      category: reminder.category,
    })
  }, [])

  const handleUpdateReminder = useCallback(() => {
    if (!editingId) return

    setError(null)

    if (!newReminder.title.trim()) {
      setError("Please enter a reminder title")
      return
    }

    if (!newReminder.time) {
      setError("Please select a time")
      return
    }

    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === editingId
          ? {
              ...reminder,
              ...newReminder,
            }
          : reminder
      )
    )

    setEditingId(null)
    setNewReminder({
      title: "",
      time: "",
      frequency: "once",
      locationBased: false,
      contextual: false,
      completed: false,
    })

    toast({
      title: "Reminder Updated",
      description: "Your reminder has been updated successfully.",
    })
  }, [editingId, newReminder, toast])

  const handleDeleteReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((reminder) => reminder.id !== id))
    toast({
      title: "Reminder Deleted",
      description: "The reminder has been removed.",
    })
  }, [toast])

  const handleToggleComplete = useCallback((id: string) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    )
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewReminder((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleSwitchChange = useCallback((name: string, checked: boolean) => {
    setNewReminder((prev) => ({ ...prev, [name]: checked }))
  }, [])

  const handleSelectChange = useCallback((name: string, value: string) => {
    setNewReminder((prev) => ({ ...prev, [name]: value }))
  }, [])

  const filteredReminders = reminders.filter((reminder) => {
    if (filter === "all") return true
    if (filter === "active") return !reminder.completed
    if (filter === "completed") return reminder.completed
    return true
  })

  const sortedReminders = [...filteredReminders].sort((a, b) => {
    // Sort by completion status first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    // Then by time
    return a.time.localeCompare(b.time)
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BellRing className="h-5 w-5 mr-2 text-blue-500" aria-hidden="true" />
            Smart Reminders
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAdding(!isAdding)}
            aria-label={isAdding ? "Cancel adding reminder" : "Add new reminder"}
          >
            {isAdding ? "Cancel" : <Plus className="h-4 w-4" aria-hidden="true" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {(isAdding || editingId) && (
          <div className="space-y-4 p-4 border rounded-md" role="form" aria-label={editingId ? "Edit reminder" : "Add new reminder"}>
            <div className="space-y-2">
              <Label htmlFor="title">Reminder Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="What do you need to remember?"
                value={newReminder.title}
                onChange={handleInputChange}
                aria-required="true"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input 
                  id="time" 
                  name="time" 
                  type="time" 
                  value={newReminder.time} 
                  onChange={handleInputChange}
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={newReminder.frequency} onValueChange={(value) => handleSelectChange("frequency", value)}>
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="location-based">Location Based</Label>
                  <p className="text-sm text-muted-foreground">Remind when at a specific location</p>
                </div>
                <Switch
                  id="location-based"
                  checked={newReminder.locationBased}
                  onCheckedChange={(checked) => handleSwitchChange("locationBased", checked)}
                  aria-label="Enable location-based reminder"
                />
              </div>

              {newReminder.locationBased && (
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., Office, Home, Client's place"
                    value={newReminder.location || ""}
                    onChange={handleInputChange}
                    aria-required={newReminder.locationBased}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="contextual">Contextual Reminder</Label>
                  <p className="text-sm text-muted-foreground">Remind based on context or activity</p>
                </div>
                <Switch
                  id="contextual"
                  checked={newReminder.contextual}
                  onCheckedChange={(checked) => handleSwitchChange("contextual", checked)}
                  aria-label="Enable contextual reminder"
                />
              </div>

              {newReminder.contextual && (
                <div className="space-y-2">
                  <Label htmlFor="context">Context</Label>
                  <Input
                    id="context"
                    name="context"
                    placeholder="e.g., After client session, Before lunch"
                    value={newReminder.context || ""}
                    onChange={handleInputChange}
                    aria-required={newReminder.contextual}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Input
                id="category"
                name="category"
                placeholder="e.g., Work, Personal, Health"
                value={newReminder.category || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        {sortedReminders.length > 0 ? (
          <div className="space-y-2" role="list" aria-label="Reminders list">
            {sortedReminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`flex items-center justify-between p-3 rounded-md border hover:bg-accent/50 ${
                  reminder.completed ? "opacity-60" : ""
                }`}
                role="listitem"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleComplete(reminder.id)}
                      className="h-6 w-6"
                      aria-label={reminder.completed ? "Mark as incomplete" : "Mark as complete"}
                    >
                      <CheckCircle2
                        className={`h-4 w-4 ${
                          reminder.completed ? "text-green-500" : "text-muted-foreground"
                        }`}
                        aria-hidden="true"
                      />
                    </Button>
                    <h4 className={`font-medium truncate ${reminder.completed ? "line-through" : ""}`}>
                      {reminder.title}
                    </h4>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                    <span className="mr-2">{reminder.time}</span>
                    <span className="capitalize">{reminder.frequency}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {reminder.category && (
                      <Badge variant="secondary">{reminder.category}</Badge>
                    )}
                    {reminder.locationBased && reminder.location && (
                      <div className="flex items-center text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-0.5">
                        <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
                        {reminder.location}
                      </div>
                    )}
                    {reminder.contextual && reminder.context && (
                      <div className="flex items-center text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-0.5">
                        {reminder.context}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditReminder(reminder)}
                    className="h-8 w-8"
                    aria-label={`Edit reminder: ${reminder.title}`}
                  >
                    <Edit2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteReminder(reminder.id)}
                    className="h-8 w-8 text-red-500"
                    aria-label={`Delete reminder: ${reminder.title}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground" role="status">
            No reminders set. Add your first reminder to get started.
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          Keyboard shortcuts: Alt + N (New reminder), Esc (Cancel)
        </p>
      </CardContent>
      <CardFooter>
        {(isAdding || editingId) && (
          <Button 
            onClick={editingId ? handleUpdateReminder : handleAddReminder} 
            disabled={!newReminder.title || !newReminder.time}
            aria-label={editingId ? "Update reminder" : "Add reminder"}
          >
            {editingId ? "Update Reminder" : "Add Reminder"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
