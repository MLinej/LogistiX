"use client"

import { useApp } from "@/lib/app-context"
import { useState, useMemo } from "react"
import { Send, CheckCircle2, XCircle, Play } from "lucide-react"

export function TripDispatcher() {
  const { vehicles, drivers, trips, addTrip, updateTripStatus, permissions } = useApp()
  const [form, setForm] = useState({ vehicleId: "", driverId: "", loadWeight: "", startLocation: "", endLocation: "" })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const availableVehicles = useMemo(() => vehicles.filter(v => v.status === "Available"), [vehicles])
  const availableDrivers = useMemo(() => {
    const now = new Date()
    return drivers.filter(d => d.status === "Available" && new Date(d.licenseExpiry) > now)
  }, [drivers])

  const handleCreate = () => {
    const errors: Record<string, string> = {}
    if (!form.vehicleId) errors.vehicleId = "Select a vehicle"
    if (!form.driverId) errors.driverId = "Select a driver"
    if (!form.loadWeight || Number(form.loadWeight) <= 0) errors.loadWeight = "Load weight must be greater than 0"
    if (!form.startLocation.trim()) errors.startLocation = "Start location is required"
    if (!form.endLocation.trim()) errors.endLocation = "End location is required"

    if (form.startLocation.trim() && form.endLocation.trim() && form.startLocation.trim().toLowerCase() === form.endLocation.trim().toLowerCase()) {
      errors.endLocation = "End location cannot be the same as start"
    }

    if (form.vehicleId && form.loadWeight) {
      const vehicle = vehicles.find(v => v.id === form.vehicleId)
      if (vehicle && Number(form.loadWeight) > vehicle.capacity) {
        errors.loadWeight = `Exceeds vehicle capacity of ${vehicle.capacity.toLocaleString()} kg`
      }
    }

    const driver = drivers.find(d => d.id === form.driverId)
    if (driver && new Date(driver.licenseExpiry) < new Date()) {
      errors.driverId = "Driver license has expired"
    }

    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    addTrip({
      vehicleId: form.vehicleId,
      driverId: form.driverId,
      loadWeight: Number(form.loadWeight),
      startLocation: form.startLocation,
      endLocation: form.endLocation,
    })
    setForm({ vehicleId: "", driverId: "", loadWeight: "", startLocation: "", endLocation: "" })
    setFormErrors({})
  }

  const statusColors: Record<string, string> = {
    Draft: "bg-[#f0f0f0] text-[#6b7280]",
    Dispatched: "bg-[#eff6ff] text-[#3b82f6]",
    Delivered: "bg-[#ecfdf5] text-[#10b981]",
    Cancelled: "bg-[#fef2f2] text-[#ef4444]",
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-[#111]">Trip Dispatcher</h1>
        <p className="text-sm text-[#6b7280] mt-1">Create and manage fleet dispatches</p>
      </div>

      {/* Create Trip Form */}
      {permissions?.canCreateTrip && (
        <div className="bg-white rounded-xl border border-[#f0f0f0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h2 className="text-sm font-semibold text-[#111] mb-4">New Trip</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#111] mb-1">Vehicle</label>
              <select
                value={form.vehicleId}
                onChange={e => setForm(prev => ({ ...prev, vehicleId: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all"
              >
                <option value="">Select vehicle...</option>
                {availableVehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.vehicleNumber} — {v.model} ({v.capacity.toLocaleString()} kg)</option>
                ))}
              </select>
              {formErrors.vehicleId && <p className="text-xs text-[#ef4444] mt-0.5">{formErrors.vehicleId}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-[#111] mb-1">Driver</label>
              <select
                value={form.driverId}
                onChange={e => setForm(prev => ({ ...prev, driverId: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all"
              >
                <option value="">Select driver...</option>
                {availableDrivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name} — Score: {d.safetyScore}</option>
                ))}
              </select>
              {formErrors.driverId && <p className="text-xs text-[#ef4444] mt-0.5">{formErrors.driverId}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-[#111] mb-1">Load Weight (kg)</label>
              <input
                type="number"
                placeholder="e.g. 18000"
                value={form.loadWeight}
                onChange={e => setForm(prev => ({ ...prev, loadWeight: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] placeholder:text-[#9ca3af] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all"
              />
              {formErrors.loadWeight && <p className="text-xs text-[#ef4444] mt-0.5">{formErrors.loadWeight}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-[#111] mb-1">Start Location</label>
              <input
                type="text"
                placeholder="Mumbai, MH"
                value={form.startLocation}
                onChange={e => setForm(prev => ({ ...prev, startLocation: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] placeholder:text-[#9ca3af] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all"
              />
              {formErrors.startLocation && <p className="text-xs text-[#ef4444] mt-0.5">{formErrors.startLocation}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-[#111] mb-1">End Location</label>
              <input
                type="text"
                placeholder="Pune, MH"
                value={form.endLocation}
                onChange={e => setForm(prev => ({ ...prev, endLocation: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] placeholder:text-[#9ca3af] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all"
              />
              {formErrors.endLocation && <p className="text-xs text-[#ef4444] mt-0.5">{formErrors.endLocation}</p>}
            </div>
            <div className="flex items-end">
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-4 py-2 bg-[#111] text-white text-sm font-medium rounded-lg hover:bg-[#222] hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <Send className="w-4 h-4" />
                Create Trip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trips Table */}
      <div className="bg-white rounded-xl border border-[#f0f0f0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f0f0f0]">
          <h2 className="text-sm font-semibold text-[#111]">All Trips</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f0f0f0]">
                {["ID", "Vehicle", "Driver", "Route", "Load", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-[#6b7280] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trips.map(trip => {
                const vehicle = vehicles.find(v => v.id === trip.vehicleId)
                const driver = drivers.find(d => d.id === trip.driverId)
                return (
                  <tr key={trip.id} className="border-b border-[#f0f0f0] hover:bg-[#f7f8fa] transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-[#6b7280]">{trip.id.toUpperCase()}</td>
                    <td className="px-5 py-3 text-[#111]">{vehicle?.vehicleNumber || trip.vehicleId}</td>
                    <td className="px-5 py-3 text-[#111]">{driver?.name || trip.driverId}</td>
                    <td className="px-5 py-3 text-[#111]">{trip.startLocation} → {trip.endLocation}</td>
                    <td className="px-5 py-3 text-[#111]">{(trip.loadWeight / 1000).toFixed(1)}T</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${statusColors[trip.status]}`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#6b7280]">{trip.createdAt}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        {trip.status === "Draft" && permissions?.canCreateTrip && (
                          <button
                            onClick={() => updateTripStatus(trip.id, "Dispatched")}
                            title="Dispatch"
                            className="p-1.5 rounded-md hover:bg-[#eff6ff] text-[#3b82f6] transition-colors"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {trip.status === "Dispatched" && permissions?.canCreateTrip && (
                          <button
                            onClick={() => updateTripStatus(trip.id, "Delivered")}
                            title="Complete"
                            className="p-1.5 rounded-md hover:bg-[#ecfdf5] text-[#10b981] transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {(trip.status === "Draft" || trip.status === "Dispatched") && permissions?.canCreateTrip && (
                          <button
                            onClick={() => updateTripStatus(trip.id, "Cancelled")}
                            title="Cancel"
                            className="p-1.5 rounded-md hover:bg-[#fef2f2] text-[#ef4444] transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
