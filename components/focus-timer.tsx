"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Clock, Coffee, Settings, Volume2, VolumeX, CheckCircle2, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface Task {
  id: string
  name: string
  completed: boolean
}

export function FocusTimer() {
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [sessionType, setSessionType] = useState<"focus" | "break">("focus")
  const [focusDuration, setFocusDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [showSettings, setShowSettings] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTask, setCurrentTask] = useState("Focus on your work")
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", name: "Focus on your work", completed: false },
    { id: "2", name: "Client session preparation", completed: false },
    { id: "3", name: "Documentation", completed: false },
    { id: "4", name: "Research", completed: false },
  ])
  const [newTask, setNewTask] = useState("")
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3")
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Space") {
        e.preventDefault()
        toggleTimer()
      } else if (e.key === "r" || e.key === "R") {
        resetTimer()
      } else if (e.key === "m" || e.key === "M") {
        setIsMuted(!isMuted)
      } else if (e.key === "s" || e.key === "S") {
        setShowSettings(!showSettings)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isMuted, showSettings])

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer finished
            clearInterval(timerRef.current as NodeJS.Timeout)

            // Play sound if not muted
            if (!isMuted && audioRef.current) {
              audioRef.current.play().catch((err) => console.error("Error playing audio:", err))
            }

            // Show notification
            toast({
              title: sessionType === "focus" ? "Focus session complete!" : "Break time over!",
              description: sessionType === "focus" ? "Time for a break!" : "Back to work!",
            })

            // Switch session type
            if (sessionType === "focus") {
              setCompletedSessions((prev) => prev + 1)
              setSessionType("break")
              return breakDuration * 60
            } else {
              setSessionType("focus")
              return focusDuration * 60
            }
          }
          return prev - 1
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRunning, sessionType, breakDuration, focusDuration, isMuted, toast])

  const toggleTimer = useCallback(() => {
    setIsRunning(!isRunning)
  }, [isRunning])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setSessionType("focus")
    setTimeLeft(focusDuration * 60)
  }, [focusDuration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const calculateProgress = () => {
    const totalSeconds = sessionType === "focus" ? focusDuration * 60 : breakDuration * 60
    return ((totalSeconds - timeLeft) / totalSeconds) * 100
  }

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        name: newTask.trim(),
        completed: false,
      }
      setTasks([...tasks, task])
      setNewTask("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask()
    }
  }

  return (
    <Card
      className={cn(
        "transition-colors duration-300",
        sessionType === "focus" ? "border-blue-200 dark:border-blue-800" : "border-green-200 dark:border-green-800",
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            {sessionType === "focus" ? (
              <Clock className="h-5 w-5 mr-2 text-blue-500" aria-hidden="true" />
            ) : (
              <Coffee className="h-5 w-5 mr-2 text-green-500" aria-hidden="true" />
            )}
            {sessionType === "focus" ? "Focus Timer" : "Break Time"}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="h-8 w-8"
              aria-label={isMuted ? "Unmute notifications" : "Mute notifications"}
            >
              {isMuted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="h-8 w-8"
              aria-label={showSettings ? "Close settings" : "Open settings"}
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showSettings ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="focus-duration" className="text-sm font-medium">
                Focus Duration (minutes)
              </label>
              <Slider
                id="focus-duration"
                value={[focusDuration]}
                min={5}
                max={60}
                step={5}
                onValueChange={(value) => setFocusDuration(value[0])}
                aria-label="Focus duration"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5m</span>
                <span>{focusDuration}m</span>
                <span>60m</span>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="break-duration" className="text-sm font-medium">
                Break Duration (minutes)
              </label>
              <Slider
                id="break-duration"
                value={[breakDuration]}
                min={1}
                max={30}
                step={1}
                onValueChange={(value) => setBreakDuration(value[0])}
                aria-label="Break duration"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1m</span>
                <span>{breakDuration}m</span>
                <span>30m</span>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="current-task" className="text-sm font-medium">
                Current Task
              </label>
              <Select value={currentTask} onValueChange={setCurrentTask}>
                <SelectTrigger id="current-task">
                  <SelectValue placeholder="Select a task" />
                </SelectTrigger>
                <SelectContent>
                  {tasks.map((task) => (
                    <SelectItem key={task.id} value={task.name}>
                      {task.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="new-task" className="text-sm font-medium">
                Add New Task
              </label>
              <div className="flex gap-2">
                <Input
                  id="new-task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter task name"
                  aria-label="New task name"
                />
                <Button onClick={addTask} size="icon" aria-label="Add task">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="text-4xl font-bold tabular-nums" role="timer" aria-label={`${formatTime(timeLeft)} remaining`}>
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{currentTask}</div>
            </div>
            <Progress value={calculateProgress()} className="h-2" aria-label="Session progress" />
            <div className="flex justify-center items-center space-x-2" role="status" aria-label={`${completedSessions} sessions completed`}>
              {Array.from({ length: 4 }).map((_, i) => (
                <CheckCircle2
                  key={i}
                  className={cn(
                    "h-5 w-5",
                    i < completedSessions ? "text-green-500" : "text-gray-300 dark:text-gray-700",
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={resetTimer}
          disabled={!isRunning && timeLeft === focusDuration * 60}
          aria-label="Reset timer"
        >
          <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
          Reset
        </Button>
        <Button onClick={toggleTimer} size="sm" aria-label={isRunning ? "Pause timer" : "Start timer"}>
          {isRunning ? (
            <>
              <Pause className="h-4 w-4 mr-2" aria-hidden="true" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" aria-hidden="true" />
              Start
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
