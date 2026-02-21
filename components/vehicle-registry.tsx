"use client"

import { useApp } from "@/lib/app-context"
import { useState } from "react"
import { Plus, X, RotateCcw, Archive } from "lucide-react"
import type { VehicleStatus } from "@/lib/mock-data"

const statusColors: Record<VehicleStatus, string> = {
  Available: "bg-[#ecfdf5] text-[#10b981]",
  "On Trip": "bg-[#eff6ff] text-[#3b82f6]",
  "In Shop": "bg-[#fffbeb] text-[#d97706]",
  Retired: "bg-[#f0f0f0] text-[#6b7280]",
}

export function VehicleRegistry() {
  const { vehicles, addVehicle, updateVehicleStatus, permissions } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ vehicleNumber: "", model: "", capacity: "", odometer: "", lastServiceKm: "", stateCode: "", rtoCode: "" })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handleAdd = () => {
    const errors: Record<string, string> = {}
    if (!form.vehicleNumber.trim()) {
      errors.vehicleNumber = "Vehicle number is required"
    } else if (!/^[A-Z]{2}-[0-9]{2}-[A-Z]{2}-[0-9]{4}$/.test(form.vehicleNumber.trim())) {
      errors.vehicleNumber = "Enter valid vehicle number (e.g., GJ-03-DG-4980)"
    }
    if (!form.model.trim()) errors.model = "Model is required"
    if (!form.capacity || Number(form.capacity) <= 0) errors.capacity = "Capacity must be greater than 0"
    if (!form.odometer && form.odometer !== "0") {
      errors.odometer = "Odometer reading is required"
    } else if (Number(form.odometer) < 0) {
      errors.odometer = "Odometer cannot be negative"
    }
    if (form.stateCode && !/^[A-Z]{2}$/.test(form.stateCode)) errors.stateCode = "Must be 2 uppercase letters"
    if (form.rtoCode && !/^\d{2}$/.test(form.rtoCode)) errors.rtoCode = "Must be 2 digits"

    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    addVehicle({
      vehicleNumber: form.vehicleNumber,
      model: form.model,
      capacity: Number(form.capacity),
      odometer: Number(form.odometer) || 0,
      lastServiceKm: Number(form.lastServiceKm) || 0,
      stateCode: form.stateCode,
      rtoCode: form.rtoCode,
    })
    setShowModal(false)
    setForm({ vehicleNumber: "", model: "", capacity: "", odometer: "", lastServiceKm: "", stateCode: "", rtoCode: "" })
    setFormErrors({})
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Vehicle Registry</h1>
          <p className="text-sm text-[#6b7280] mt-1">{vehicles.length} vehicles registered</p>
        </div>
        {permissions?.canAddVehicle && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#111] text-white text-sm font-medium rounded-lg hover:bg-[#222] hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#f0f0f0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f0f0f0]">
                {["Vehicle Number", "Model", "Capacity (kg)", "Odometer", "State", "RTO", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-[#6b7280] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map(v => (
                <tr key={v.id} className="border-b border-[#f0f0f0] hover:bg-[#f7f8fa] transition-colors">
                  <td className="px-5 py-3 font-medium text-[#111]">{v.vehicleNumber}</td>
                  <td className="px-5 py-3 text-[#6b7280]">{v.model}</td>
                  <td className="px-5 py-3 text-[#111]">{v.capacity.toLocaleString()}</td>
                  <td className="px-5 py-3 text-[#111]">{v.odometer.toLocaleString()} km</td>
                  <td className="px-5 py-3 text-[#6b7280]">{v.stateCode}</td>
                  <td className="px-5 py-3 text-[#6b7280]">{v.rtoCode}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${statusColors[v.status]}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {permissions?.canAddVehicle && v.status !== "On Trip" && (
                      v.status === "Retired" ? (
                        <button
                          onClick={() => updateVehicleStatus(v.id, "Available")}
                          className="flex items-center gap-1 text-xs text-[#10b981] hover:text-[#059669] font-medium transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Restore
                        </button>
                      ) : (
                        <button
                          onClick={() => updateVehicleStatus(v.id, "Retired")}
                          className="flex items-center gap-1 text-xs text-[#6b7280] hover:text-[#ef4444] font-medium transition-colors"
                        >
                          <Archive className="w-3.5 h-3.5" /> Retire
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0]">
              <h3 className="text-lg font-semibold text-[#111]">Add New Vehicle</h3>
              <button onClick={() => setShowModal(false)} className="text-[#6b7280] hover:text-[#111] transition-colors" aria-label="Close modal">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
              {[
                { key: "vehicleNumber", label: "Vehicle Number", placeholder: "GJ-03-DG-4980", required: true },
                { key: "model", label: "Model", placeholder: "Tata Prima 4928.S", required: true },
                { key: "capacity", label: "Capacity (kg)", placeholder: "28000", type: "number", required: true },
                { key: "odometer", label: "Odometer (km)", placeholder: "0", type: "number", required: true },
                { key: "lastServiceKm", label: "Last Service (km)", placeholder: "0", type: "number" },
                { key: "stateCode", label: "State Code", placeholder: "MH" },
                { key: "rtoCode", label: "RTO Code", placeholder: "12" },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-[#111] mb-1">
                    {field.label} {field.required && <span className="text-[#ef4444]">*</span>}
                  </label>
                  <input
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={e => {
                      const val = field.key === "vehicleNumber" || field.key === "stateCode"
                        ? e.target.value.toUpperCase()
                        : e.target.value
                      setForm(prev => ({ ...prev, [field.key]: val }))
                    }}
                    className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] placeholder:text-[#9ca3af] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all"
                  />
                  {formErrors[field.key] && <p className="text-xs text-[#ef4444] mt-0.5">{formErrors[field.key]}</p>}
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-[#f0f0f0] flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-[#6b7280] hover:text-[#111] transition-colors">
                Cancel
              </button>
              <button onClick={handleAdd} className="px-4 py-2 bg-[#111] text-white text-sm font-medium rounded-lg hover:bg-[#222] hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all">
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
