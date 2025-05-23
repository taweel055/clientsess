"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AINoteCapture } from "@/components/ai-note-capture"
import { FocusTimer } from "@/components/focus-timer"
import { ReadingAssistant } from "@/components/reading-assistant"
import { DailyRecap } from "@/components/daily-recap"
import { SmartReminder } from "@/components/smart-reminder"
import { Brain, Sparkles, Clock, FileText, BookOpen, Calendar, Bell } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const tools = [
  {
    id: "focus",
    name: "Focus Timer",
    icon: Clock,
    description: "Use the Pomodoro technique to maintain focus and productivity. Customize work and break intervals to match your optimal attention span.",
    features: [
      "Adjustable focus and break durations",
      "Audio notifications for session transitions",
      "Track completed focus sessions",
      "Associate tasks with focus sessions",
    ],
    component: FocusTimer,
  },
  {
    id: "notes",
    name: "AI Notes",
    icon: FileText,
    description: "Quickly capture thoughts, ideas, and tasks using voice or text. The AI will process your notes and convert them into actionable tasks.",
    features: [
      "Voice-to-text for hands-free note taking",
      "AI processing to extract tasks and action items",
      "Automatic categorization and prioritization",
      "Integration with the task management system",
    ],
    component: AINoteCapture,
  },
  {
    id: "reading",
    name: "Reading Assistant",
    icon: BookOpen,
    description: "Make reading easier with text-to-speech, summarization, and simplification tools. Ideal for processing client notes, research papers, or any text content.",
    features: [
      "Text-to-speech with adjustable speed",
      "AI-powered text summarization",
      "Simplification of complex content",
      "Customizable reading preferences",
    ],
    component: ReadingAssistant,
  },
  {
    id: "recap",
    name: "Daily Recap",
    icon: Calendar,
    description: "Automatically generate summaries of your day and plan for tomorrow. Review completed tasks, sessions conducted, and upcoming appointments.",
    features: [
      "AI-generated daily accomplishment summaries",
      "Smart planning for upcoming days",
      "Personal notes and reflections",
      "Track patterns and productivity trends",
    ],
    component: DailyRecap,
  },
  {
    id: "reminders",
    name: "Smart Reminders",
    icon: Bell,
    description: "Context-aware reminders that trigger based on time, location, or activities. Never miss important tasks or appointments again.",
    features: [
      "Time-based reminders with flexible scheduling",
      "Location-based triggers (e.g., at the office)",
      "Context-aware notifications (e.g., after a session)",
      "Customizable frequency and priority",
    ],
    component: SmartReminder,
  },
]

export default function SupportToolsPage() {
  const [activeTab, setActiveTab] = useState("focus")
  const { toast } = useToast()

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey) {
        const index = tools.findIndex((tool) => tool.id === activeTab)
        if (e.key === "ArrowRight") {
          e.preventDefault()
          const nextIndex = (index + 1) % tools.length
          setActiveTab(tools[nextIndex].id)
          toast({
            title: `Switched to ${tools[nextIndex].name}`,
            description: "Use Alt + Arrow keys to navigate between tools",
          })
        } else if (e.key === "ArrowLeft") {
          e.preventDefault()
          const prevIndex = (index - 1 + tools.length) % tools.length
          setActiveTab(tools[prevIndex].id)
          toast({
            title: `Switched to ${tools[prevIndex].name}`,
            description: "Use Alt + Arrow keys to navigate between tools",
          })
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [activeTab, toast])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Brain className="h-6 w-6 text-blue-500" aria-hidden="true" />
        <h1 className="text-2xl md:text-3xl font-bold">Support Tools</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-blue-500" aria-hidden="true" />
            Productivity & Accessibility Tools
          </CardTitle>
          <CardDescription>
            Tools designed to support focus, organization, and accessibility for practitioners with ADHD and dyslexia.
            Use Alt + Arrow keys to navigate between tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4" aria-label="Support tools">
              {tools.map((tool) => (
                <TabsTrigger
                  key={tool.id}
                  value={tool.id}
                  className="flex items-center space-x-2"
                  aria-label={`Switch to ${tool.name}`}
                >
                  <tool.icon className="h-4 w-4" aria-hidden="true" />
                  <span>{tool.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {tools.map((tool) => (
              <TabsContent key={tool.id} value={tool.id} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <tool.icon className="h-5 w-5 mr-2 text-blue-500" aria-hidden="true" />
                      {tool.name}
                    </h2>
                    <p className="text-muted-foreground mb-6">{tool.description}</p>
                    <ul className="space-y-2 list-disc list-inside text-sm" aria-label={`${tool.name} features`}>
                      {tool.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <tool.component />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
