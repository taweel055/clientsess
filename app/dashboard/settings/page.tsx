"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import { testTelegramConnection, updatePassword } from "@/lib/settings"

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [telegramLoading, setTelegramLoading] = useState(false)
  const [telegramSuccess, setTelegramSuccess] = useState(false)
  const [telegramError, setTelegramError] = useState("")

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess(false)

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    try {
      const success = await updatePassword(currentPassword, newPassword)
      if (success) {
        setPasswordSuccess(true)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setPasswordError("Current password is incorrect")
      }
    } catch (err) {
      setPasswordError("An error occurred. Please try again.")
      console.error(err)
    }
  }

  const handleTestTelegram = async () => {
    setTelegramLoading(true)
    setTelegramSuccess(false)
    setTelegramError("")

    try {
      const success = await testTelegramConnection()
      if (success) {
        setTelegramSuccess(true)
      } else {
        setTelegramError("Failed to send test message to Telegram")
      }
    } catch (err) {
      setTelegramError("An error occurred. Please check your Telegram configuration.")
      console.error(err)
    } finally {
      setTelegramLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your admin password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordError && (
              <Alert variant="destructive">
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            {passwordSuccess && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Your password has been updated successfully.</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit">Update Password</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Telegram Integration</CardTitle>
          <CardDescription>Test your Telegram bot connection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {telegramError && (
            <Alert variant="destructive">
              <AlertDescription>{telegramError}</AlertDescription>
            </Alert>
          )}

          {telegramSuccess && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Test message sent to Telegram successfully.</AlertDescription>
            </Alert>
          )}

          <div>
            <p className="text-sm text-gray-500 mb-4">Current configuration:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium">Bot Token</p>
                <p className="text-sm text-gray-500 truncate">7689842861:AAEZAJkA8JOF_S4wXH7UjVT5K3ib9koKpnA</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium">Chat ID</p>
                <p className="text-sm text-gray-500">1566750265</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleTestTelegram} disabled={telegramLoading}>
            {telegramLoading ? "Testing..." : "Test Telegram Connection"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
