"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, StopCircle, Loader2, Send, Sparkles, Volume2, VolumeX } from "lucide-react"
import { useRouter } from "next/navigation"
import { createTask } from "@/lib/data"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AINoteCapture() {
  const [note, setNote] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Cleanup on component unmount
  useEffect(() => {
    const cleanupMedia = () => {
      if (mediaRecorder) {
        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop()
        }
        setMediaRecorder(null)
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }
    }
    return () => {
      cleanupMedia()
    }
  }, [mediaRecorder, stream])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key === "r") {
          e.preventDefault()
          if (!isRecording && !isProcessing) {
            startRecording()
          } else if (isRecording) {
            stopRecording()
          }
        } else if (e.key === "p") {
          e.preventDefault()
          if (note.trim() && !isProcessing) {
            processNoteWithAI()
          }
        } else if (e.key === "m") {
          e.preventDefault()
          setIsMuted(!isMuted)
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isRecording, isProcessing, note, isMuted])

  const startRecording = async () => {
    try {
      setError(null)
      setIsRecording(true)
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setStream(audioStream)

      const recorder = new MediaRecorder(audioStream)
      setMediaRecorder(recorder)

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks((prev) => [...prev, e.data])
        }
      }

      recorder.onstop = () => {
        // Process the recording
        processRecording()
      }

      recorder.start()
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      })
    } catch (error) {
      console.error("Error accessing microphone:", error)
      setError("Could not access your microphone. Please check permissions.")
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      })
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop()
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }

    setIsRecording(false)
  }

  const processRecording = () => {
    setIsProcessing(true)
    setError(null)

    // In a real app, you would send the audio to a speech-to-text API
    // For demo purposes, we'll simulate a response after a delay
    setTimeout(() => {
      try {
        const transcribedText = "Follow up with client about homework assignment and schedule next appointment."
        setNote((prev) => (prev ? `${prev} ${transcribedText}` : transcribedText))
        setIsProcessing(false)
        setAudioChunks([])
      } catch (error) {
        console.error("Error processing recording:", error)
        setError("Failed to process the recording. Please try again.")
        setIsProcessing(false)
      }
    }, 1500)
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const processNoteWithAI = async () => {
    if (!note.trim()) return

    setIsProcessing(true)
    setError(null)

    try {
      // In a real app, you would send the note to an AI API for processing
      // For demo purposes, we'll simulate a response after a delay
      setTimeout(() => {
        try {
          // Create a task based on the note
          const taskId = createTask({
            title: "Follow up with client",
            description: note,
            status: "todo",
            priority: "medium",
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            assignedTo: "admin",
          })

          toast({
            title: "Note processed",
            description: "Your note has been converted to a task",
          })

          setNote("")
          setIsProcessing(false)
          router.refresh()
        } catch (error) {
          console.error("Error creating task:", error)
          setError("Failed to create task. Please try again.")
          setIsProcessing(false)
        }
      }, 1500)
    } catch (error) {
      console.error("Error processing note:", error)
      setError("Failed to process your note. Please try again.")
      toast({
        title: "Error",
        description: "Failed to process your note",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [note])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-blue-500" aria-hidden="true" />
            AI Note Capture
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="h-8 w-8"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Textarea
          ref={textareaRef}
          placeholder="Capture your thoughts, ideas, or tasks here... Use voice input or type directly."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[100px] resize-none"
          aria-label="Note input"
        />
        <p className="text-sm text-muted-foreground">
          Press Alt + R to start/stop recording, Alt + P to process, Alt + M to toggle mute
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="icon"
            onClick={toggleRecording}
            disabled={isProcessing}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? <StopCircle className="h-4 w-4" aria-hidden="true" /> : <Mic className="h-4 w-4" aria-hidden="true" />}
          </Button>
          {isProcessing && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
              Processing...
            </div>
          )}
        </div>
        <Button
          onClick={processNoteWithAI}
          disabled={!note.trim() || isProcessing}
          aria-label="Process note with AI"
        >
          <Send className="h-4 w-4 mr-2" aria-hidden="true" />
          Process with AI
        </Button>
      </CardFooter>
    </Card>
  )
}
