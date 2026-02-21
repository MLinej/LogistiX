"use client"

import { useApp } from "@/lib/app-context"
import { AlertTriangle, AlertCircle, Info, X } from "lucide-react"
import { useState, useMemo } from "react"

interface Alert {
  id: string
  type: "warning" | "danger" | "info"
  message: string
}

export function AlertBar() {
  const { drivers, vehicles, fuelLogs, permissions } = useApp()
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const alerts = useMemo(() => {
    const list: Alert[] = []
    const now = new Date()
    const sixtyDays = 60 * 24 * 60 * 60 * 1000

    // License expiry alerts
    drivers.forEach(d => {
      const expiry = new Date(d.licenseExpiry)
      const diff = expiry.getTime() - now.getTime()
      if (diff < 0) {
        list.push({ id: `lic-expired-${d.id}`, type: "danger", message: `${d.name}'s license has expired (${d.licenseExpiry})` })
      } else if (diff < sixtyDays) {
        list.push({ id: `lic-expiring-${d.id}`, type: "warning", message: `${d.name}'s license expires on ${d.licenseExpiry}` })
      }
    })

    // Vehicles in shop
    const inShop = vehicles.filter(v => v.status === "In Shop")
    if (inShop.length > 0) {
      list.push({ id: "vehicles-in-shop", type: "info", message: `${inShop.length} vehicle${inShop.length > 1 ? "s" : ""} currently in maintenance` })
    }

    // Fuel anomalies
    fuelLogs.forEach(f => {
      const eff = f.distance / f.fuelLiters
      if (eff < 2) {
        const vehicle = vehicles.find(v => v.id === f.vehicleId)
        list.push({ id: `fuel-anomaly-${f.id}`, type: "danger", message: `Fuel anomaly detected: ${vehicle?.vehicleNumber || f.vehicleId} — ${eff.toFixed(1)} km/L` })
      }
    })

    return list.filter(a => !dismissed.has(a.id))
  }, [drivers, vehicles, fuelLogs, dismissed])

  if (alerts.length === 0) return null

  const getIcon = (type: string) => {
    switch (type) {
      case "danger": return <AlertCircle className="w-4 h-4 shrink-0" />
      case "warning": return <AlertTriangle className="w-4 h-4 shrink-0" />
      default: return <Info className="w-4 h-4 shrink-0" />
    }
  }

  const getColors = (type: string) => {
    switch (type) {
      case "danger": return "bg-[#fef2f2] text-[#ef4444] border-[#fecaca]"
      case "warning": return "bg-[#fffbeb] text-[#d97706] border-[#fde68a]"
      default: return "bg-[#eff6ff] text-[#3b82f6] border-[#bfdbfe]"
    }
  }

  return (
    <div className="sticky top-0 z-30 flex flex-col gap-1 p-2">
      {alerts.slice(0, 3).map(alert => (
        <div
          key={alert.id}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border ${getColors(alert.type)} animate-fade-in-up`}
        >
          {getIcon(alert.type)}
          <span className="flex-1 truncate">{alert.message}</span>
          {permissions?.canDismissAlerts && (
            <button
              onClick={() => setDismissed(prev => new Set([...prev, alert.id]))}
              className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
              aria-label="Dismiss alert"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
