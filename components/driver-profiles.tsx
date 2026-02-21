"use client"

import { useApp } from "@/lib/app-context"
import { useMemo, useState } from "react"
import { ShieldCheck, AlertTriangle, Clock, Plus, X } from "lucide-react"
import type { DriverStatus } from "@/lib/mock-data"

const statusColors: Record<DriverStatus, string> = {
  Available: "bg-[#ecfdf5] text-[#10b981]",
  "On Trip": "bg-[#eff6ff] text-[#3b82f6]",
  "Off Duty": "bg-[#f0f0f0] text-[#6b7280]",
  Suspended: "bg-[#fef2f2] text-[#ef4444]",
}

const nextStatus: Record<DriverStatus, DriverStatus> = {
  Available: "Off Duty",
  "Off Duty": "Available",
  "On Trip": "On Trip",
  Suspended: "Available",
}

type DriverCategory = "Van" | "Truck" | "Bike"

export function DriverProfiles() {
  const { drivers, addDriver, updateDriverStatus, updateDriverSafetyScore, permissions } = useApp()
  const [editingScore, setEditingScore] = useState<string | null>(null)
  const [scoreValue, setScoreValue] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [driverForm, setDriverForm] = useState({
    name: "",
    licenseNumber: "",
    licenseExpiry: "",
    category: "Truck" as DriverCategory,
    safetyScore: "80",
  })
  const [driverFormErrors, setDriverFormErrors] = useState<Record<string, string>>({})

  const now = useMemo(() => new Date(), [])
  const sixtyDays = 60 * 24 * 60 * 60 * 1000

  const getLicenseStatus = (expiry: string) => {
    const expiryDate = new Date(expiry)
    const diff = expiryDate.getTime() - now.getTime()
    if (diff < 0) return "expired"
    if (diff < sixtyDays) return "expiring"
    return "valid"
  }

  const handleSaveScore = (driverId: string) => {
    const score = Number(scoreValue)
    if (score >= 0 && score <= 100) {
      updateDriverSafetyScore(driverId, score)
    }
    setEditingScore(null)
    setScoreValue("")
  }

  const handleAddDriver = () => {
    const errors: Record<string, string> = {}
    if (!driverForm.name.trim()) errors.name = "Name is required"
    if (!driverForm.licenseNumber.trim()) {
      errors.licenseNumber = "License number is required"
    } else if (!/^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$/.test(driverForm.licenseNumber.trim())) {
      errors.licenseNumber = "Enter valid license number (e.g., MH1420110062821)"
    }
    if (!driverForm.licenseExpiry) errors.licenseExpiry = "License expiry is required"
    const score = Number(driverForm.safetyScore)
    if (isNaN(score) || score < 0 || score > 100) errors.safetyScore = "Score must be 0-100"

    setDriverFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    addDriver({
      name: driverForm.name.trim(),
      licenseNumber: driverForm.licenseNumber.trim(),
      licenseExpiry: driverForm.licenseExpiry,
      safetyScore: score,
    })
    setShowAddModal(false)
    setDriverForm({ name: "", licenseNumber: "", licenseExpiry: "", category: "Truck", safetyScore: "80" })
    setDriverFormErrors({})
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Driver Profiles</h1>
          <p className="text-sm text-[#6b7280] mt-1">{drivers.length} registered drivers</p>
        </div>
        {permissions?.canAddDriver && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#111] text-white text-sm font-medium rounded-lg hover:bg-[#222] hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Driver
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {drivers.map(driver => {
          const licStatus = getLicenseStatus(driver.licenseExpiry)
          return (
            <div
              key={driver.id}
              className="bg-white rounded-xl border border-[#f0f0f0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-[#111]">{driver.name}</h3>
                  <p className="text-xs text-[#6b7280] mt-0.5">{driver.licenseNumber}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${statusColors[driver.status]}`}>
                  {driver.status}
                </span>
              </div>

              {/* License */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium mb-3 ${
                licStatus === "expired" ? "bg-[#fef2f2] text-[#ef4444]" :
                licStatus === "expiring" ? "bg-[#fffbeb] text-[#d97706]" :
                "bg-[#ecfdf5] text-[#10b981]"
              }`}>
                {licStatus === "expired" ? <AlertTriangle className="w-3.5 h-3.5" /> :
                 licStatus === "expiring" ? <Clock className="w-3.5 h-3.5" /> :
                 <ShieldCheck className="w-3.5 h-3.5" />}
                {licStatus === "expired" ? "License expired" :
                 licStatus === "expiring" ? `Expires ${driver.licenseExpiry}` :
                 `Valid until ${driver.licenseExpiry}`}
              </div>

              {/* Safety Score */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[#6b7280]">Safety Score</span>
                  {editingScore === driver.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={scoreValue}
                        onChange={e => setScoreValue(e.target.value)}
                        className="w-14 h-6 px-1.5 text-xs border border-[#e5e7eb] rounded text-[#111] focus:border-[#f59e0b] outline-none"
                      />
                      <button onClick={() => handleSaveScore(driver.id)} className="text-xs text-[#10b981] font-medium hover:text-[#059669]">Save</button>
                      <button onClick={() => setEditingScore(null)} className="text-xs text-[#6b7280] hover:text-[#111]">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className={`font-semibold ${driver.safetyScore >= 80 ? "text-[#10b981]" : driver.safetyScore >= 60 ? "text-[#f59e0b]" : "text-[#ef4444]"}`}>
                        {driver.safetyScore}
                      </span>
                      {permissions?.canEditSafetyScore && (
                        <button
                          onClick={() => { setEditingScore(driver.id); setScoreValue(String(driver.safetyScore)) }}
                          className="text-[10px] text-[#6b7280] hover:text-[#f59e0b] ml-1 font-medium"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${driver.safetyScore >= 80 ? "bg-[#10b981]" : driver.safetyScore >= 60 ? "bg-[#f59e0b]" : "bg-[#ef4444]"}`}
                    style={{ width: `${driver.safetyScore}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-[#6b7280] mb-3">
                <span>Trips completed</span>
                <span className="font-semibold text-[#111]">{driver.tripsCompleted}</span>
              </div>

              {/* Toggle Status */}
              {permissions?.canEditDriver && driver.status !== "On Trip" && (
                <button
                  onClick={() => updateDriverStatus(driver.id, nextStatus[driver.status])}
                  className="w-full py-2 rounded-lg text-xs font-medium border border-[#e5e7eb] text-[#6b7280] hover:bg-[#f7f8fa] hover:text-[#111] transition-all"
                >
                  {driver.status === "Suspended" ? "Reactivate" : driver.status === "Off Duty" ? "Set Available" : "Set Off Duty"}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0]">
              <h3 className="text-lg font-semibold text-[#111]">Add New Driver</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#6b7280] hover:text-[#111] transition-colors" aria-label="Close modal">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-[#111] mb-1">
                  Name <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Rajesh Kumar"
                  value={driverForm.name}
                  onChange={e => setDriverForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] placeholder:text-[#9ca3af] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all"
                />
                {driverFormErrors.name && <p className="text-xs text-[#ef4444] mt-0.5">{driverFormErrors.name}</p>}
              </div>

              {/* License Number */}
              <div>
                <label className="block text-xs font-medium text-[#111] mb-1">
                  License Number <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="MH1420110062821"
                  value={driverForm.licenseNumber}
                  onChange={e => setDriverForm(prev => ({ ...prev, licenseNumber: e.target.value.toUpperCase() }))}
                  className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] placeholder:text-[#9ca3af] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all"
                />
                {driverFormErrors.licenseNumber && <p className="text-xs text-[#ef4444] mt-0.5">{driverFormErrors.licenseNumber}</p>}
              </div>

              {/* License Expiry */}
              <div>
                <label className="block text-xs font-medium text-[#111] mb-1">
                  License Expiry <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="date"
                  value={driverForm.licenseExpiry}
                  onChange={e => setDriverForm(prev => ({ ...prev, licenseExpiry: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] placeholder:text-[#9ca3af] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all"
                />
                {driverFormErrors.licenseExpiry && <p className="text-xs text-[#ef4444] mt-0.5">{driverFormErrors.licenseExpiry}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-[#111] mb-1">Category</label>
                <div className="flex gap-2">
                  {(["Van", "Truck", "Bike"] as DriverCategory[]).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setDriverForm(prev => ({ ...prev, category: cat }))}
                      className={`flex-1 h-9 rounded-lg text-xs font-medium border transition-all ${
                        driverForm.category === cat
                          ? "bg-[#111] text-white border-[#111]"
                          : "bg-white text-[#6b7280] border-[#e5e7eb] hover:border-[#f59e0b] hover:text-[#111]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Safety Score */}
              <div>
                <label className="block text-xs font-medium text-[#111] mb-1">
                  Safety Score (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="80"
                  value={driverForm.safetyScore}
                  onChange={e => setDriverForm(prev => ({ ...prev, safetyScore: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] placeholder:text-[#9ca3af] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all"
                />
                {driverFormErrors.safetyScore && <p className="text-xs text-[#ef4444] mt-0.5">{driverFormErrors.safetyScore}</p>}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#f0f0f0] flex justify-end gap-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-[#6b7280] hover:text-[#111] transition-colors">
                Cancel
              </button>
              <button onClick={handleAddDriver} className="px-4 py-2 bg-[#111] text-white text-sm font-medium rounded-lg hover:bg-[#222] hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all">
                Add Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
