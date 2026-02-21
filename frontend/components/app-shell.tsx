"use client"

import { useApp } from "@/lib/app-context"
import { LoginPage } from "@/components/login-page"
import { AppSidebar } from "@/components/app-sidebar"
import { AlertBar } from "@/components/alert-bar"
import { CommandCenter } from "@/components/command-center"
import { VehicleRegistry } from "@/components/vehicle-registry"
import { TripDispatcher } from "@/components/trip-dispatcher"
import { DriverProfiles } from "@/components/driver-profiles"
import { MaintenanceFuel } from "@/components/maintenance-fuel"
import { AnalyticsReports } from "@/components/analytics-reports"

function PageRouter() {
  const { activePage } = useApp()

  switch (activePage) {
    case "Command Center":
      return <CommandCenter />
    case "Vehicle Registry":
      return <VehicleRegistry />
    case "Trip Dispatcher":
      return <TripDispatcher />
    case "Driver Profiles":
      return <DriverProfiles />
    case "Maintenance & Fuel":
      return <MaintenanceFuel />
    case "Analytics & Reports":
      return <AnalyticsReports />
    default:
      return <CommandCenter />
  }
}

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <AppSidebar />
      <main className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <AlertBar />
        <div className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <PageRouter />
        </div>
      </main>
    </div>
  )
}

export default function AppShell() {
  const { user } = useApp()

  if (!user) {
    return <LoginPage />
  }

  return <Dashboard />
}
