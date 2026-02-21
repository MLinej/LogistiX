"use client"

import { useApp } from "@/lib/app-context"
import { useState, useMemo } from "react"
import { Wrench, Fuel, AlertCircle, Plus } from "lucide-react"

export function MaintenanceFuel() {
  const { vehicles, trips, maintenanceLogs, fuelLogs, addMaintenanceLog, addFuelLog, permissions } = useApp()

  // Maintenance form
  const [mForm, setMForm] = useState({ vehicleId: "", serviceType: "", cost: "", serviceKm: "", nextServiceDueKm: "" })
  const [mErrors, setMErrors] = useState<Record<string, string>>({})

  // Fuel form
  const [fForm, setFForm] = useState({ vehicleId: "", tripId: "", distance: "", fuelLiters: "" })
  const [fErrors, setFErrors] = useState<Record<string, string>>({})

  const handleAddMaintenance = () => {
    const errors: Record<string, string> = {}
    if (!mForm.vehicleId) errors.vehicleId = "Select a vehicle"
    if (!mForm.serviceType.trim()) errors.serviceType = "Service type is required"
    if (!mForm.cost || Number(mForm.cost) <= 0) errors.cost = "Cost must be greater than 0"
    if (!mForm.serviceKm || Number(mForm.serviceKm) <= 0) errors.serviceKm = "Service km is required"
    if (!mForm.nextServiceDueKm || Number(mForm.nextServiceDueKm) <= 0) errors.nextServiceDueKm = "Next service km is required"

    setMErrors(errors)
    if (Object.keys(errors).length > 0) return

    addMaintenanceLog({
      vehicleId: mForm.vehicleId,
      serviceType: mForm.serviceType,
      cost: Number(mForm.cost),
      serviceKm: Number(mForm.serviceKm),
      nextServiceDueKm: Number(mForm.nextServiceDueKm),
    })
    setMForm({ vehicleId: "", serviceType: "", cost: "", serviceKm: "", nextServiceDueKm: "" })
  }

  const handleAddFuel = () => {
    const errors: Record<string, string> = {}
    if (!fForm.vehicleId) errors.vehicleId = "Select a vehicle"
    if (!fForm.tripId) errors.tripId = "Select a trip"
    if (!fForm.distance || Number(fForm.distance) <= 0) errors.distance = "Distance must be greater than 0"
    if (!fForm.fuelLiters || Number(fForm.fuelLiters) <= 0) errors.fuelLiters = "Fuel liters must be greater than 0"

    setFErrors(errors)
    if (Object.keys(errors).length > 0) return

    addFuelLog({
      vehicleId: fForm.vehicleId,
      tripId: fForm.tripId,
      distance: Number(fForm.distance),
      fuelLiters: Number(fForm.fuelLiters),
    })
    setFForm({ vehicleId: "", tripId: "", distance: "", fuelLiters: "" })
  }

  const maintenanceWarnings = useMemo(() => {
    return maintenanceLogs.filter(m => {
      const vehicle = vehicles.find(v => v.id === m.vehicleId)
      return vehicle && vehicle.odometer >= m.nextServiceDueKm
    })
  }, [maintenanceLogs, vehicles])

  const totalFuelCost = useMemo(() => {
    return fuelLogs.reduce((acc, f) => acc + f.fuelLiters * 95, 0)
  }, [fuelLogs])

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-[#111]">Maintenance & Fuel</h1>
        <p className="text-sm text-[#6b7280] mt-1">Service records and fuel consumption tracking</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Maintenance Panel */}
        <div className="flex flex-col gap-4">
          {permissions?.canAddMaintenance && (
          <div className="bg-white rounded-xl border border-[#f0f0f0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#fffbeb] flex items-center justify-center">
                <Wrench className="w-4 h-4 text-[#f59e0b]" />
              </div>
              <h2 className="text-sm font-semibold text-[#111]">Log Maintenance</h2>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-[#111] mb-1">Vehicle</label>
                <select
                  value={mForm.vehicleId}
                  onChange={e => setMForm(p => ({ ...p, vehicleId: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all"
                >
                  <option value="">Select vehicle...</option>
                  {vehicles.filter(v => v.status !== "Retired").map(v => (
                    <option key={v.id} value={v.id}>{v.vehicleNumber}</option>
                  ))}
                </select>
                {mErrors.vehicleId && <p className="text-xs text-[#ef4444] mt-0.5">{mErrors.vehicleId}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111] mb-1">Service Type</label>
                <input
                  type="text"
                  placeholder="e.g. Oil Change"
                  value={mForm.serviceType}
                  onChange={e => setMForm(p => ({ ...p, serviceType: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] placeholder:text-[#9ca3af] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all"
                />
                {mErrors.serviceType && <p className="text-xs text-[#ef4444] mt-0.5">{mErrors.serviceType}</p>}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#111] mb-1">Cost</label>
                  <input type="number" placeholder="0" value={mForm.cost} onChange={e => setMForm(p => ({ ...p, cost: e.target.value }))} className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] placeholder:text-[#9ca3af] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all" />
                  {mErrors.cost && <p className="text-xs text-[#ef4444] mt-0.5">{mErrors.cost}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111] mb-1">Service km</label>
                  <input type="number" placeholder="0" value={mForm.serviceKm} onChange={e => setMForm(p => ({ ...p, serviceKm: e.target.value }))} className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] placeholder:text-[#9ca3af] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all" />
                  {mErrors.serviceKm && <p className="text-xs text-[#ef4444] mt-0.5">{mErrors.serviceKm}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111] mb-1">Next due km</label>
                  <input type="number" placeholder="0" value={mForm.nextServiceDueKm} onChange={e => setMForm(p => ({ ...p, nextServiceDueKm: e.target.value }))} className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] placeholder:text-[#9ca3af] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all" />
                  {mErrors.nextServiceDueKm && <p className="text-xs text-[#ef4444] mt-0.5">{mErrors.nextServiceDueKm}</p>}
                </div>
              </div>
              <button onClick={handleAddMaintenance} className="flex items-center justify-center gap-2 w-full py-2 bg-[#111] text-white text-sm font-medium rounded-lg hover:bg-[#222] hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all">
                <Plus className="w-4 h-4" /> Log Service
              </button>
            </div>
          </div>
          )}

          {/* Maintenance Table */}
          <div className="bg-white rounded-xl border border-[#f0f0f0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#f0f0f0] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#111]">Service History</h3>
              {maintenanceWarnings.length > 0 && (
                <span className="flex items-center gap-1 text-xs font-medium text-[#d97706] bg-[#fffbeb] px-2 py-0.5 rounded-md">
                  <AlertCircle className="w-3 h-3" /> {maintenanceWarnings.length} overdue
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f0f0f0]">
                    {["Vehicle", "Service", "Cost", "Service km", "Next Due", "Date", ""].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-[#6b7280] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {maintenanceLogs.map(m => {
                    const vehicle = vehicles.find(v => v.id === m.vehicleId)
                    const isOverdue = vehicle && vehicle.odometer >= m.nextServiceDueKm
                    return (
                      <tr key={m.id} className="border-b border-[#f0f0f0] hover:bg-[#f7f8fa] transition-colors">
                        <td className="px-4 py-2.5 text-[#111] font-medium">{vehicle?.vehicleNumber || m.vehicleId}</td>
                        <td className="px-4 py-2.5 text-[#6b7280]">{m.serviceType}</td>
                        <td className="px-4 py-2.5 text-[#111]">{"₹"}{m.cost.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-[#6b7280]">{m.serviceKm.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-[#6b7280]">{m.nextServiceDueKm.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-[#6b7280]">{m.date}</td>
                        <td className="px-4 py-2.5">
                          {isOverdue && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[#fef2f2] text-[#ef4444]">
                              Overdue
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Fuel Panel */}
        <div className="flex flex-col gap-4">
          {permissions?.canAddFuelLog && (
          <div className="bg-white rounded-xl border border-[#f0f0f0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] flex items-center justify-center">
                <Fuel className="w-4 h-4 text-[#10b981]" />
              </div>
              <h2 className="text-sm font-semibold text-[#111]">Log Fuel</h2>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-[#111] mb-1">Vehicle</label>
                <select
                  value={fForm.vehicleId}
                  onChange={e => setFForm(p => ({ ...p, vehicleId: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all"
                >
                  <option value="">Select vehicle...</option>
                  {vehicles.filter(v => v.status !== "Retired").map(v => (
                    <option key={v.id} value={v.id}>{v.vehicleNumber}</option>
                  ))}
                </select>
                {fErrors.vehicleId && <p className="text-xs text-[#ef4444] mt-0.5">{fErrors.vehicleId}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111] mb-1">Trip</label>
                <select
                  value={fForm.tripId}
                  onChange={e => setFForm(p => ({ ...p, tripId: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all"
                >
                  <option value="">Select trip...</option>
                  {trips.filter(t => t.status === "Dispatched" || t.status === "Delivered").map(t => (
                    <option key={t.id} value={t.id}>{t.id.toUpperCase()} — {t.startLocation} → {t.endLocation}</option>
                  ))}
                </select>
                {fErrors.tripId && <p className="text-xs text-[#ef4444] mt-0.5">{fErrors.tripId}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#111] mb-1">Distance (km)</label>
                  <input type="number" placeholder="0" value={fForm.distance} onChange={e => setFForm(p => ({ ...p, distance: e.target.value }))} className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] placeholder:text-[#9ca3af] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all" />
                  {fErrors.distance && <p className="text-xs text-[#ef4444] mt-0.5">{fErrors.distance}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111] mb-1">Fuel (liters)</label>
                  <input type="number" placeholder="0" value={fForm.fuelLiters} onChange={e => setFForm(p => ({ ...p, fuelLiters: e.target.value }))} className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] placeholder:text-[#9ca3af] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all" />
                  {fErrors.fuelLiters && <p className="text-xs text-[#ef4444] mt-0.5">{fErrors.fuelLiters}</p>}
                </div>
              </div>
              <button onClick={handleAddFuel} className="flex items-center justify-center gap-2 w-full py-2 bg-[#111] text-white text-sm font-medium rounded-lg hover:bg-[#222] hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all">
                <Plus className="w-4 h-4" /> Log Fuel
              </button>
            </div>
          </div>
          )}

          {/* Fuel Table */}
          <div className="bg-white rounded-xl border border-[#f0f0f0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#f0f0f0] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#111]">Fuel Logs</h3>
              <span className="text-xs font-medium text-[#6b7280]">
                Total: {"₹"}{totalFuelCost.toLocaleString()}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f0f0f0]">
                    {["Vehicle", "Trip", "Distance", "Fuel (L)", "Efficiency", "Date", ""].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-[#6b7280] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fuelLogs.map(f => {
                    const vehicle = vehicles.find(v => v.id === f.vehicleId)
                    const efficiency = f.fuelLiters > 0 ? f.distance / f.fuelLiters : 0
                    const isAnomaly = efficiency < 2
                    return (
                      <tr key={f.id} className="border-b border-[#f0f0f0] hover:bg-[#f7f8fa] transition-colors">
                        <td className="px-4 py-2.5 text-[#111] font-medium">{vehicle?.vehicleNumber || f.vehicleId}</td>
                        <td className="px-4 py-2.5 font-mono text-xs text-[#6b7280]">{f.tripId.toUpperCase()}</td>
                        <td className="px-4 py-2.5 text-[#111]">{f.distance} km</td>
                        <td className="px-4 py-2.5 text-[#111]">{f.fuelLiters} L</td>
                        <td className="px-4 py-2.5">
                          <span className={`font-medium ${efficiency >= 3 ? "text-[#10b981]" : efficiency >= 2 ? "text-[#f59e0b]" : "text-[#ef4444]"}`}>
                            {efficiency.toFixed(1)} km/L
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-[#6b7280]">{f.date}</td>
                        <td className="px-4 py-2.5">
                          {isAnomaly && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[#fef2f2] text-[#ef4444]">
                              Fuel Anomaly
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
