"use client"

import { useApp } from "@/lib/app-context"
import { useMemo, useCallback } from "react"
import { DollarSign, Wrench, Truck, CheckCircle2, Download } from "lucide-react"

export function AnalyticsReports() {
  const { vehicles, trips, maintenanceLogs, fuelLogs, permissions } = useApp()

  const totalFuelSpend = useMemo(() => {
    return fuelLogs.reduce((acc, f) => acc + f.fuelLiters * 95, 0)
  }, [fuelLogs])

  const totalMaintenanceCost = useMemo(() => {
    return maintenanceLogs.reduce((acc, m) => acc + m.cost, 0)
  }, [maintenanceLogs])

  const totalOperationalCost = totalFuelSpend + totalMaintenanceCost
  const completedTrips = useMemo(() => trips.filter(t => t.status === "Delivered").length, [trips])

  const kpis = [
    { label: "Total Fuel Spend", value: `₹${totalFuelSpend.toLocaleString()}`, icon: DollarSign, color: "text-[#f59e0b]", bg: "bg-[#fffbeb]" },
    { label: "Total Maintenance Cost", value: `₹${totalMaintenanceCost.toLocaleString()}`, icon: Wrench, color: "text-[#8b5cf6]", bg: "bg-[#f5f3ff]" },
    { label: "Total Operational Cost", value: `₹${totalOperationalCost.toLocaleString()}`, icon: Truck, color: "text-[#3b82f6]", bg: "bg-[#eff6ff]" },
    { label: "Completed Trips", value: completedTrips, icon: CheckCircle2, color: "text-[#10b981]", bg: "bg-[#ecfdf5]" },
  ]

  const vehicleAnalytics = useMemo(() => {
    return vehicles.filter(v => v.status !== "Retired").map(vehicle => {
      const vTrips = trips.filter(t => t.vehicleId === vehicle.id && t.status === "Delivered")
      const vFuel = fuelLogs.filter(f => f.vehicleId === vehicle.id)
      const vMaintenance = maintenanceLogs.filter(m => m.vehicleId === vehicle.id)

      const fuelCost = vFuel.reduce((acc, f) => acc + f.fuelLiters * 95, 0)
      const maintenanceCost = vMaintenance.reduce((acc, m) => acc + m.cost, 0)
      const totalCost = fuelCost + maintenanceCost
      const totalDistance = vFuel.reduce((acc, f) => acc + f.distance, 0)
      const totalLiters = vFuel.reduce((acc, f) => acc + f.fuelLiters, 0)
      const efficiency = totalLiters > 0 ? totalDistance / totalLiters : 0

      // Simple revenue estimate for ROI
      const revenue = vTrips.length * 25000
      const roi = totalCost > 0 ? ((revenue - totalCost) / totalCost) * 100 : 0

      return {
        vehicleNumber: vehicle.vehicleNumber,
        tripsCount: vTrips.length,
        fuelCost,
        maintenanceCost,
        totalCost,
        efficiency,
        roi,
      }
    })
  }, [vehicles, trips, fuelLogs, maintenanceLogs])

  const exportCSV = useCallback(() => {
    const headers = ["Vehicle", "Trips", "Fuel Cost", "Maintenance Cost", "Total Cost", "Efficiency (km/L)", "ROI %"]
    const rows = vehicleAnalytics.map(v => [
      v.vehicleNumber, v.tripsCount, v.fuelCost, v.maintenanceCost, v.totalCost, v.efficiency.toFixed(1), v.roi.toFixed(1),
    ])
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "logistix-analytics.csv"
    a.click()
    URL.revokeObjectURL(url)
  }, [vehicleAnalytics])

  const exportPDF = useCallback(() => {
    const printContent = `
      <html><head><title>LogistiX Analytics Report</title>
      <style>
        body { font-family: 'DM Sans', sans-serif; padding: 40px; color: #111; }
        h1 { font-size: 24px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th, td { padding: 8px 12px; border: 1px solid #e5e7eb; text-align: left; }
        th { background: #f7f8fa; font-weight: 600; }
      </style></head><body>
      <h1>LogistiX Analytics Report</h1>
      <p>Generated on ${new Date().toLocaleDateString()}</p>
      <table>
        <thead><tr><th>Vehicle</th><th>Trips</th><th>Fuel Cost</th><th>Maintenance</th><th>Total Cost</th><th>Efficiency</th><th>ROI</th></tr></thead>
        <tbody>${vehicleAnalytics.map(v => `<tr>
          <td>${v.vehicleNumber}</td>
          <td>${v.tripsCount}</td>
          <td>₹${v.fuelCost.toLocaleString()}</td>
          <td>₹${v.maintenanceCost.toLocaleString()}</td>
          <td>₹${v.totalCost.toLocaleString()}</td>
          <td>${v.efficiency.toFixed(1)} km/L</td>
          <td>${v.roi.toFixed(1)}%</td>
        </tr>`).join("")}</tbody>
      </table></body></html>`
    const w = window.open("", "_blank")
    if (w) {
      w.document.write(printContent)
      w.document.close()
      w.print()
    }
  }, [vehicleAnalytics])

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Analytics & Reports</h1>
          <p className="text-sm text-[#6b7280] mt-1">Financial overview and vehicle performance</p>
        </div>
        {permissions?.canExport && (
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#111] border border-[#e5e7eb] rounded-lg hover:bg-[#f7f8fa] hover:shadow hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Download className="w-4 h-4" /> CSV
            </button>
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#111] rounded-lg hover:bg-[#222] hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Download className="w-4 h-4" /> PDF
            </button>
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl border border-[#f0f0f0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#6b7280] uppercase tracking-wider">{kpi.label}</p>
                <p className="text-2xl font-bold text-[#111] mt-1">{kpi.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Table */}
      <div className="bg-white rounded-xl border border-[#f0f0f0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f0f0f0]">
          <h2 className="text-sm font-semibold text-[#111]">Vehicle Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f0f0f0]">
                {["Vehicle", "Trips", "Fuel Cost", "Maintenance", "Total Cost", "Efficiency", "ROI"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-[#6b7280] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicleAnalytics.map(v => (
                <tr key={v.vehicleNumber} className="border-b border-[#f0f0f0] hover:bg-[#f7f8fa] transition-colors">
                  <td className="px-5 py-3 font-medium text-[#111]">{v.vehicleNumber}</td>
                  <td className="px-5 py-3 text-[#111]">{v.tripsCount}</td>
                  <td className="px-5 py-3 text-[#111]">{"₹"}{v.fuelCost.toLocaleString()}</td>
                  <td className="px-5 py-3 text-[#111]">{"₹"}{v.maintenanceCost.toLocaleString()}</td>
                  <td className="px-5 py-3 font-medium text-[#111]">{"₹"}{v.totalCost.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`font-medium ${v.efficiency >= 3 ? "text-[#10b981]" : "text-[#f59e0b]"}`}>
                      {v.efficiency.toFixed(1)} km/L
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`font-semibold ${v.roi > 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                      {v.roi > 0 ? "+" : ""}{v.roi.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
