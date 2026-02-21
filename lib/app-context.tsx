"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import {
  type Role,
  type Vehicle,
  type Driver,
  type Trip,
  type MaintenanceLog,
  type FuelLog,
  type VehicleStatus,
  type DriverStatus,
  type TripStatus,
  initialVehicles,
  initialDrivers,
  initialTrips,
  initialMaintenanceLogs,
  initialFuelLogs,
  rolePermissions,
} from "@/lib/mock-data"

interface AuthUser {
  email: string
  role: Role
}

interface AppContextType {
  // Auth
  user: AuthUser | null
  login: (email: string, role: Role) => void
  logout: () => void
  permissions: typeof rolePermissions["Fleet Manager"] | null

  // Vehicles
  vehicles: Vehicle[]
  addVehicle: (v: Omit<Vehicle, "id" | "status">) => void
  updateVehicleStatus: (id: string, status: VehicleStatus) => void

  // Drivers
  drivers: Driver[]
  addDriver: (d: Omit<Driver, "id" | "status" | "tripsCompleted">) => void
  updateDriverStatus: (id: string, status: DriverStatus) => void
  updateDriverSafetyScore: (id: string, score: number) => void

  // Trips
  trips: Trip[]
  addTrip: (t: Omit<Trip, "id" | "status" | "createdAt">) => void
  updateTripStatus: (id: string, status: TripStatus) => void

  // Maintenance
  maintenanceLogs: MaintenanceLog[]
  addMaintenanceLog: (m: Omit<MaintenanceLog, "id" | "date">) => void

  // Fuel
  fuelLogs: FuelLog[]
  addFuelLog: (f: Omit<FuelLog, "id" | "date">) => void

  // Navigation
  activePage: string
  setActivePage: (page: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles)
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers)
  const [trips, setTrips] = useState<Trip[]>(initialTrips)
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(initialMaintenanceLogs)
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(initialFuelLogs)
  const [activePage, setActivePage] = useState("Command Center")

  const login = useCallback((email: string, role: Role) => {
    setUser({ email, role })
    setActivePage("Command Center")
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const permissions = user ? rolePermissions[user.role] : null

  // Vehicle CRUD
  const addVehicle = useCallback((v: Omit<Vehicle, "id" | "status">) => {
    setVehicles(prev => [...prev, { ...v, id: `v${Date.now()}`, status: "Available" as VehicleStatus }])
  }, [])

  const updateVehicleStatus = useCallback((id: string, status: VehicleStatus) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, status } : v))
  }, [])

  // Driver CRUD
  const addDriver = useCallback((d: Omit<Driver, "id" | "status" | "tripsCompleted">) => {
    setDrivers(prev => [...prev, { ...d, id: `d${Date.now()}`, status: "Off Duty" as DriverStatus, tripsCompleted: 0 }])
  }, [])

  const updateDriverStatus = useCallback((id: string, status: DriverStatus) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, status } : d))
  }, [])

  const updateDriverSafetyScore = useCallback((id: string, score: number) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, safetyScore: score } : d))
  }, [])

  // Trip CRUD
  const addTrip = useCallback((t: Omit<Trip, "id" | "status" | "createdAt">) => {
    const newTrip: Trip = {
      ...t,
      id: `t${Date.now()}`,
      status: "Draft",
      createdAt: new Date().toISOString().split("T")[0],
    }
    setTrips(prev => [...prev, newTrip])
  }, [])

  const updateTripStatus = useCallback((id: string, status: TripStatus) => {
    setTrips(prev => {
      const trip = prev.find(t => t.id === id)
      if (!trip) return prev

      const updated = prev.map(t => t.id === id ? { ...t, status } : t)

      if (status === "Dispatched") {
        setVehicles(vList => vList.map(v => v.id === trip.vehicleId ? { ...v, status: "On Trip" as VehicleStatus } : v))
        setDrivers(dList => dList.map(d => d.id === trip.driverId ? { ...d, status: "On Trip" as DriverStatus } : d))
      }
      if (status === "Delivered" || status === "Cancelled") {
        setVehicles(vList => vList.map(v => v.id === trip.vehicleId ? { ...v, status: "Available" as VehicleStatus } : v))
        setDrivers(dList => dList.map(d => d.id === trip.driverId ? { ...d, status: "Available" as DriverStatus, tripsCompleted: status === "Delivered" ? d.tripsCompleted + 1 : d.tripsCompleted } : d))
      }

      return updated
    })
  }, [])

  // Maintenance CRUD
  const addMaintenanceLog = useCallback((m: Omit<MaintenanceLog, "id" | "date">) => {
    setMaintenanceLogs(prev => [...prev, { ...m, id: `m${Date.now()}`, date: new Date().toISOString().split("T")[0] }])
    setVehicles(prev => prev.map(v => v.id === m.vehicleId ? { ...v, status: "In Shop" as VehicleStatus, lastServiceKm: m.serviceKm } : v))
  }, [])

  // Fuel CRUD
  const addFuelLog = useCallback((f: Omit<FuelLog, "id" | "date">) => {
    setFuelLogs(prev => [...prev, { ...f, id: `f${Date.now()}`, date: new Date().toISOString().split("T")[0] }])
  }, [])

  return (
    <AppContext.Provider value={{
      user, login, logout, permissions,
      vehicles, addVehicle, updateVehicleStatus,
      drivers, addDriver, updateDriverStatus, updateDriverSafetyScore,
      trips, addTrip, updateTripStatus,
      maintenanceLogs, addMaintenanceLog,
      fuelLogs, addFuelLog,
      activePage, setActivePage,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
