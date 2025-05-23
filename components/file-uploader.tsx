"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UploadCloud, X, FileText, ImageIcon, Paperclip } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
  files: File[]
  setFiles: (files: File[]) => void
  existingFiles: string[]
  setExistingFiles: (files: string[]) => void
}

export function FileUploader({ files, setFiles, existingFiles, setExistingFiles }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles([...files, ...newFiles])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const removeExistingFile = (index: number) => {
    const newFiles = [...existingFiles]
    newFiles.splice(index, 1)
    setExistingFiles(newFiles)
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />
    } else if (["pdf", "doc", "docx", "txt"].includes(extension || "")) {
      return <FileText className="h-5 w-5 text-red-500" />
    } else {
      return <Paperclip className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-md p-6 text-center cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">Drag and drop files here, or click to select files</p>
        <p className="text-xs text-gray-500 mt-1">Supports images (PNG, JPG, GIF) and documents (PDF, DOC, DOCX)</p>
        <Input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={handleFileChange}
          accept=".png,.jpg,.jpeg,.gif,.pdf,.doc,.docx,.xls,.xlsx"
        />
      </div>

      {(files.length > 0 || existingFiles.length > 0) && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Attached Files:</p>
          <ul className="space-y-2">
            {existingFiles.map((file, index) => (
              <li key={`existing-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  {getFileIcon(file)}
                  <span className="ml-2 text-sm truncate max-w-[200px]">{file}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeExistingFile(index)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}

            {files.map((file, index) => (
              <li key={`new-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  {getFileIcon(file.name)}
                  <span className="ml-2 text-sm truncate max-w-[200px]">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
