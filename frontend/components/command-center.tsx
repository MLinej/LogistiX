"use client"

import { useApp } from "@/lib/app-context"
import { useMemo } from "react"
import {
  Truck,
  CheckCircle2,
  Wrench,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react"

const statusColors: Record<string, string> = {
  "On Trip": "bg-[#3b82f6]",
  Available: "bg-[#10b981]",
  "In Shop": "bg-[#f59e0b]",
  Retired: "bg-[#6b7280]",
}

export function CommandCenter() {
  const { vehicles, drivers, trips } = useApp()

  const stats = useMemo(() => {
    const activeFleet = vehicles.filter(v => v.status === "On Trip").length
    const available = vehicles.filter(v => v.status === "Available").length
    const inMaintenance = vehicles.filter(v => v.status === "In Shop").length
    const total = vehicles.filter(v => v.status !== "Retired").length
    const utilizationRate = total > 0 ? Math.round((activeFleet / total) * 100) : 0
    const pendingTrips = trips.filter(t => t.status === "Draft").length
    const now = new Date()
    const expiredLicenses = drivers.filter(d => new Date(d.licenseExpiry) < now).length

    return { activeFleet, available, inMaintenance, utilizationRate, pendingTrips, expiredLicenses }
  }, [vehicles, drivers, trips])

  const kpis = [
    { label: "Active Fleet", value: stats.activeFleet, icon: Truck, color: "text-[#3b82f6]", bg: "bg-[#eff6ff]" },
    { label: "Available Vehicles", value: stats.available, icon: CheckCircle2, color: "text-[#10b981]", bg: "bg-[#ecfdf5]" },
    { label: "In Maintenance", value: stats.inMaintenance, icon: Wrench, color: "text-[#f59e0b]", bg: "bg-[#fffbeb]" },
    { label: "Utilization Rate", value: `${stats.utilizationRate}%`, icon: TrendingUp, color: "text-[#8b5cf6]", bg: "bg-[#f5f3ff]" },
    { label: "Pending Trips", value: stats.pendingTrips, icon: Clock, color: "text-[#6366f1]", bg: "bg-[#eef2ff]" },
    { label: "Expired Licenses", value: stats.expiredLicenses, icon: AlertTriangle, color: "text-[#ef4444]", bg: "bg-[#fef2f2]" },
  ]

  const statusBreakdown = useMemo(() => {
    const total = vehicles.length
    return [
      { label: "On Trip", count: vehicles.filter(v => v.status === "On Trip").length, pct: 0 },
      { label: "Available", count: vehicles.filter(v => v.status === "Available").length, pct: 0 },
      { label: "In Shop", count: vehicles.filter(v => v.status === "In Shop").length, pct: 0 },
      { label: "Retired", count: vehicles.filter(v => v.status === "Retired").length, pct: 0 },
    ].map(s => ({ ...s, pct: total > 0 ? Math.round((s.count / total) * 100) : 0 }))
  }, [vehicles])

  const recentTrips = useMemo(() => {
    return trips
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 8)
  }, [trips])

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-[#111]">Command Center</h1>
        <p className="text-sm text-[#6b7280] mt-1">Fleet operations overview at a glance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.label}
            className={`bg-white rounded-xl border border-[#f0f0f0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all animate-fade-in-up-delay-${Math.min(i + 1, 3)}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#6b7280] uppercase tracking-wider">{kpi.label}</p>
                <p className="text-3xl font-bold text-[#111] mt-1">{kpi.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fleet Status Breakdown */}
      <div className="bg-white rounded-xl border border-[#f0f0f0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="text-sm font-semibold text-[#111] mb-4">Fleet Status Breakdown</h2>
        <div className="flex flex-col gap-3">
          {statusBreakdown.map(s => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="text-xs text-[#6b7280] w-20 shrink-0">{s.label}</span>
              <div className="flex-1 h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${statusColors[s.label]} transition-all`}
                  style={{ width: `${s.pct}%` }}
                />
              </div>
              <span className="text-xs font-medium text-[#111] w-12 text-right">{s.count} ({s.pct}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Trips */}
      <div className="bg-white rounded-xl border border-[#f0f0f0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f0f0f0]">
          <h2 className="text-sm font-semibold text-[#111]">Recent Trips</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f0f0f0]">
                <th className="text-left px-5 py-3 text-xs font-medium text-[#6b7280] uppercase tracking-wider">Trip ID</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-[#6b7280] uppercase tracking-wider">Route</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-[#6b7280] uppercase tracking-wider">Load</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-[#6b7280] uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-[#6b7280] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTrips.map(trip => (
                <tr key={trip.id} className="border-b border-[#f0f0f0] hover:bg-[#f7f8fa] transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-[#6b7280]">{trip.id.toUpperCase()}</td>
                  <td className="px-5 py-3 text-[#111]">{trip.startLocation} → {trip.endLocation}</td>
                  <td className="px-5 py-3 text-[#111]">{(trip.loadWeight / 1000).toFixed(1)}T</td>
                  <td className="px-5 py-3">
                    <TripStatusBadge status={trip.status} />
                  </td>
                  <td className="px-5 py-3 text-[#6b7280]">{trip.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function TripStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Draft: "bg-[#f0f0f0] text-[#6b7280]",
    Dispatched: "bg-[#eff6ff] text-[#3b82f6]",
    Delivered: "bg-[#ecfdf5] text-[#10b981]",
    Cancelled: "bg-[#fef2f2] text-[#ef4444]",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${colors[status] || ""}`}>
      {status}
    </span>
  )
}
