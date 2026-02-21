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

import * as api from "@/lib/api"
import { getUser } from "./auth"
import { mapVehicle, mapDriver, mapTrip, mapMaintenanceLog, mapFuelLog } from "./api-utils"
import { useEffect } from "react"

interface AuthUser {
  id: number
  name: string
  email: string
  role: 'manager' | 'dispatcher' | 'safety_officer' | 'finance'
}

interface AppContextType {
  // Auth
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  permissions: typeof rolePermissions["Fleet Manager"] | null

  // Vehicles
  vehicles: Vehicle[]
  addVehicle: (v: Omit<Vehicle, "id" | "status">) => Promise<void>
  updateVehicleStatus: (id: string, status: VehicleStatus) => Promise<void>

  // Drivers
  drivers: Driver[]
  addDriver: (d: Omit<Driver, "id" | "status" | "tripsCompleted">) => Promise<void>
  updateDriverStatus: (id: string, status: DriverStatus) => Promise<void>
  updateDriverSafetyScore: (id: string, score: number) => Promise<void>

  // Trips
  trips: Trip[]
  addTrip: (t: Omit<Trip, "id" | "status" | "createdAt">) => Promise<void>
  updateTripStatus: (id: string, status: TripStatus) => Promise<void>

  // Maintenance
  maintenanceLogs: MaintenanceLog[]
  addMaintenanceLog: (m: Omit<MaintenanceLog, "id" | "date">) => Promise<void>

  // Fuel
  fuelLogs: FuelLog[]
  addFuelLog: (f: Omit<FuelLog, "id" | "date">) => Promise<void>

  // Navigation
  activePage: string
  setActivePage: (page: string) => void
  refreshData: () => Promise<void>
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getUser())
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([])
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([])
  const [activePage, setActivePage] = useState("Command Center")

  const refreshData = useCallback(async () => {
    if (!user) return;
    try {
      const [vRes, dRes, tRes, mRes, fRes] = await Promise.all([
        api.getVehicles(),
        api.getDrivers(),
        api.getTrips(),
        api.getMaintenance(),
        api.getFuelLogs(),
      ]);

      setVehicles(vRes.data.map(mapVehicle));
      setDrivers(dRes.data.map(mapDriver));
      setTrips(tRes.data.map(mapTrip));
      setMaintenanceLogs(mRes.data.map(mapMaintenanceLog));
      setFuelLogs(fRes.data.map(mapFuelLog));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const login = useCallback(async (email: string, role: string) => {
    // This is a placeholder since login is handled in LoginPage/signIn
    // but we update state here if needed.
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
      setActivePage("Command Center");
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("lx_token")
    localStorage.removeItem("lx_user")
    window.location.href = "/"
  }, [])

  const permissions = user ? (
    user.role === 'manager' ? rolePermissions["Fleet Manager"] :
      user.role === 'dispatcher' ? rolePermissions["Dispatcher"] :
        user.role === 'safety_officer' ? rolePermissions["Safety Officer"] :
          user.role === 'finance' ? rolePermissions["Financial Analyst"] :
            rolePermissions["Dispatcher"]
  ) : null

  // Vehicle CRUD
  const addVehicle = useCallback(async (v: Omit<Vehicle, "id" | "status">) => {
    try {
      await api.createVehicle({
        vehicle_number: v.vehicleNumber,
        model: v.model,
        capacity_kg: v.capacity,
        odometer: v.odometer,
        last_service_km: v.lastServiceKm,
        state_code: v.stateCode,
        rto_code: v.rtoCode,
      });
      await refreshData();
    } catch (error) {
      console.error("Failed to add vehicle:", error);
    }
  }, [refreshData])

  const updateVehicleStatus = useCallback(async (id: string, status: VehicleStatus) => {
    try {
      await api.updateVehicle(Number(id), { status });
      await refreshData();
    } catch (error) {
      console.error("Failed to update vehicle status:", error);
    }
  }, [refreshData])

  // Driver CRUD
  const addDriver = useCallback(async (d: Omit<Driver, "id" | "status" | "tripsCompleted">) => {
    try {
      await api.createDriver({
        name: d.name,
        license_number: d.licenseNumber,
        license_expiry: new Date(d.licenseExpiry).toISOString(),
        safety_score: d.safetyScore,
      });
      await refreshData();
    } catch (error) {
      console.error("Failed to add driver:", error);
    }
  }, [refreshData])

  const updateDriverStatus = useCallback(async (id: string, status: DriverStatus) => {
    try {
      await api.updateDriver(Number(id), { status });
      await refreshData();
    } catch (error) {
      console.error("Failed to update driver status:", error);
    }
  }, [refreshData])

  const updateDriverSafetyScore = useCallback(async (id: string, score: number) => {
    try {
      await api.updateDriver(Number(id), { safety_score: score });
      await refreshData();
    } catch (error) {
      console.error("Failed to update driver safety score:", error);
    }
  }, [refreshData])

  // Trip CRUD
  const addTrip = useCallback(async (t: Omit<Trip, "id" | "status" | "createdAt">) => {
    try {
      await api.createTrip({
        vehicle_id: Number(t.vehicleId),
        driver_id: Number(t.driverId),
        load_weight: t.loadWeight,
        start_location: t.startLocation,
        end_location: t.endLocation,
      });
      await refreshData();
    } catch (error) {
      console.error("Failed to add trip:", error);
    }
  }, [refreshData])

  const updateTripStatus = useCallback(async (id: string, status: TripStatus) => {
    try {
      // Logic for status side effects (updating vehicle/driver status)
      // is ideally handled by the backend, but we can do it here if needed.
      await api.updateTrip(Number(id), { status });
      await refreshData();
    } catch (error) {
      console.error("Failed to update trip status:", error);
    }
  }, [refreshData])

  // Maintenance CRUD
  const addMaintenanceLog = useCallback(async (m: Omit<MaintenanceLog, "id" | "date">) => {
    try {
      await api.createMaintenance({
        vehicle_id: Number(m.vehicleId),
        service_type: m.serviceType,
        cost: m.cost,
        service_km: m.serviceKm,
        next_service_due_km: m.nextServiceDueKm,
      });
      await refreshData();
    } catch (error) {
      console.error("Failed to add maintenance log:", error);
    }
  }, [refreshData])

  // Fuel CRUD
  const addFuelLog = useCallback(async (f: Omit<FuelLog, "id" | "date">) => {
    try {
      await api.createFuelLog({
        vehicle_id: Number(f.vehicleId),
        trip_id: Number(f.tripId),
        distance_km: f.distance,
        fuel_liters: f.fuelLiters,
      });
      await refreshData();
    } catch (error) {
      console.error("Failed to add fuel log:", error);
    }
  }, [refreshData])

  return (
    <AppContext.Provider value={{
      user, login, logout, permissions,
      vehicles, addVehicle, updateVehicleStatus,
      drivers, addDriver, updateDriverStatus, updateDriverSafetyScore,
      trips, addTrip, updateTripStatus,
      maintenanceLogs, addMaintenanceLog,
      fuelLogs, addFuelLog,
      activePage, setActivePage,
      refreshData,
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
