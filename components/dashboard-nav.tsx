"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserPlus,
  FileText,
  ClipboardList,
  Kanban,
  Settings,
  LogOut,
  Brain,
} from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut({ redirect: false })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const links = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "View your dashboard overview",
    },
    {
      name: "Sessions",
      href: "/dashboard/sessions",
      icon: Users,
      description: "Manage client sessions",
    },
    {
      name: "Calendar",
      href: "/dashboard/calendar",
      icon: Calendar,
      description: "View and schedule sessions",
    },
    {
      name: "Tasks",
      href: "/dashboard/tasks",
      icon: ClipboardList,
      description: "Manage your tasks",
    },
    {
      name: "Kanban",
      href: "/dashboard/kanban",
      icon: Kanban,
      description: "Organize tasks visually",
    },
    {
      name: "Clients",
      href: "/dashboard/clients",
      icon: UserPlus,
      description: "Manage client information",
    },
    {
      name: "Reports",
      href: "/dashboard/reports",
      icon: FileText,
      description: "View session reports",
    },
    {
      name: "Support Tools",
      href: "/dashboard/support-tools",
      icon: Brain,
      description: "Access ADHD support tools",
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      description: "Configure your preferences",
    },
  ]

  return (
    <nav className="hidden md:flex flex-col h-screen w-64 bg-background border-r" aria-label="Main navigation">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Client Session Tracker</h1>
      </div>
      <div className="flex-1 px-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)

          return (
            <Link 
              key={link.href} 
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              aria-label={link.description}
            >
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-accent text-accent-foreground font-medium"
                )}
              >
                <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
                {link.name}
              </Button>
            </Link>
          )
        })}
      </div>
      <div className="p-4 border-t flex items-center justify-between">
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
          onClick={handleLogout}
          disabled={isLoggingOut}
          aria-label="Log out of your account"
        >
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
        <ThemeToggle />
      </div>
    </nav>
  )
}
