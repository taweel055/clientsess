import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { MobileNav } from "@/components/mobile-nav"
import { AppWalkthrough } from "@/components/app-walkthrough"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav />
      <div className="flex flex-col flex-1">
        <MobileNav />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
      <AppWalkthrough />
    </div>
  )
}
