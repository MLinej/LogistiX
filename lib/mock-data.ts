// ─── Types ──────────────────────────────────────────────────────
export type Role = "Fleet Manager" | "Dispatcher" | "Safety Officer" | "Financial Analyst"

export type VehicleStatus = "Available" | "On Trip" | "In Shop" | "Retired"
export type DriverStatus = "Available" | "On Trip" | "Off Duty" | "Suspended"
export type TripStatus = "Draft" | "Dispatched" | "Delivered" | "Cancelled"

export interface Vehicle {
  id: string
  vehicleNumber: string
  model: string
  capacity: number
  odometer: number
  lastServiceKm: number
  stateCode: string
  rtoCode: string
  status: VehicleStatus
}

export interface Driver {
  id: string
  name: string
  licenseNumber: string
  licenseExpiry: string
  safetyScore: number
  tripsCompleted: number
  status: DriverStatus
}

export interface Trip {
  id: string
  vehicleId: string
  driverId: string
  loadWeight: number
  startLocation: string
  endLocation: string
  status: TripStatus
  createdAt: string
}

export interface MaintenanceLog {
  id: string
  vehicleId: string
  serviceType: string
  cost: number
  serviceKm: number
  nextServiceDueKm: number
  date: string
}

export interface FuelLog {
  id: string
  vehicleId: string
  tripId: string
  distance: number
  fuelLiters: number
  date: string
}

// ─── Mock Data ──────────────────────────────────────────────────

export const initialVehicles: Vehicle[] = [
  { id: "v1", vehicleNumber: "MH-12-AB-1234", model: "Tata Prima 4928.S", capacity: 28000, odometer: 142300, lastServiceKm: 140000, stateCode: "MH", rtoCode: "12", status: "On Trip" },
  { id: "v2", vehicleNumber: "MH-14-CD-5678", model: "Ashok Leyland 4220", capacity: 22000, odometer: 98500, lastServiceKm: 95000, stateCode: "MH", rtoCode: "14", status: "Available" },
  { id: "v3", vehicleNumber: "GJ-01-EF-9012", model: "BharatBenz 3523R", capacity: 35000, odometer: 210000, lastServiceKm: 205000, stateCode: "GJ", rtoCode: "01", status: "On Trip" },
  { id: "v4", vehicleNumber: "RJ-14-GH-3456", model: "Eicher Pro 6049", capacity: 49000, odometer: 175600, lastServiceKm: 170000, stateCode: "RJ", rtoCode: "14", status: "In Shop" },
  { id: "v5", vehicleNumber: "KA-01-IJ-7890", model: "Volvo FM 380", capacity: 40000, odometer: 88900, lastServiceKm: 85000, stateCode: "KA", rtoCode: "01", status: "Available" },
  { id: "v6", vehicleNumber: "TN-09-KL-2345", model: "Tata Signa 4825.TK", capacity: 25000, odometer: 312000, lastServiceKm: 310000, stateCode: "TN", rtoCode: "09", status: "On Trip" },
  { id: "v7", vehicleNumber: "DL-01-MN-6789", model: "Ashok Leyland U3518T", capacity: 18000, odometer: 67200, lastServiceKm: 65000, stateCode: "DL", rtoCode: "01", status: "Available" },
  { id: "v8", vehicleNumber: "UP-32-OP-1357", model: "BharatBenz 1617R", capacity: 16000, odometer: 145000, lastServiceKm: 140000, stateCode: "UP", rtoCode: "32", status: "Retired" },
  { id: "v9", vehicleNumber: "MP-09-QR-2468", model: "Eicher Pro 3019", capacity: 19000, odometer: 55000, lastServiceKm: 50000, stateCode: "MP", rtoCode: "09", status: "Available" },
  { id: "v10", vehicleNumber: "AP-07-ST-3579", model: "Tata LPT 3518", capacity: 18000, odometer: 198000, lastServiceKm: 195000, stateCode: "AP", rtoCode: "07", status: "On Trip" },
]

export const initialDrivers: Driver[] = [
  { id: "d1", name: "Rajesh Kumar", licenseNumber: "MH1220200001234", licenseExpiry: "2026-08-15", safetyScore: 92, tripsCompleted: 248, status: "On Trip" },
  { id: "d2", name: "Vikram Singh", licenseNumber: "GJ0120190005678", licenseExpiry: "2026-03-20", safetyScore: 87, tripsCompleted: 312, status: "On Trip" },
  { id: "d3", name: "Amit Patel", licenseNumber: "RJ1420210009012", licenseExpiry: "2027-01-10", safetyScore: 95, tripsCompleted: 189, status: "Available" },
  { id: "d4", name: "Suresh Reddy", licenseNumber: "KA0120180003456", licenseExpiry: "2026-04-05", safetyScore: 78, tripsCompleted: 421, status: "Available" },
  { id: "d5", name: "Mohammed Ismail", licenseNumber: "TN0920200007890", licenseExpiry: "2025-12-31", safetyScore: 91, tripsCompleted: 156, status: "On Trip" },
  { id: "d6", name: "Deepak Sharma", licenseNumber: "DL0120220002345", licenseExpiry: "2028-06-01", safetyScore: 84, tripsCompleted: 97, status: "Off Duty" },
  { id: "d7", name: "Karthik Nair", licenseNumber: "AP0720190006789", licenseExpiry: "2026-02-28", safetyScore: 68, tripsCompleted: 534, status: "On Trip" },
  { id: "d8", name: "Pradeep Yadav", licenseNumber: "UP3220210001357", licenseExpiry: "2027-09-15", safetyScore: 90, tripsCompleted: 203, status: "Available" },
]

export const initialTrips: Trip[] = [
  { id: "t1", vehicleId: "v1", driverId: "d1", loadWeight: 24000, startLocation: "Mumbai, MH", endLocation: "Pune, MH", status: "Dispatched", createdAt: "2026-02-18" },
  { id: "t2", vehicleId: "v3", driverId: "d2", loadWeight: 32000, startLocation: "Ahmedabad, GJ", endLocation: "Jaipur, RJ", status: "Dispatched", createdAt: "2026-02-17" },
  { id: "t3", vehicleId: "v6", driverId: "d5", loadWeight: 22000, startLocation: "Chennai, TN", endLocation: "Bengaluru, KA", status: "Dispatched", createdAt: "2026-02-19" },
  { id: "t4", vehicleId: "v10", driverId: "d7", loadWeight: 16000, startLocation: "Hyderabad, AP", endLocation: "Vijayawada, AP", status: "Dispatched", createdAt: "2026-02-20" },
  { id: "t5", vehicleId: "v2", driverId: "d3", loadWeight: 18000, startLocation: "Nagpur, MH", endLocation: "Indore, MP", status: "Delivered", createdAt: "2026-02-15" },
  { id: "t6", vehicleId: "v5", driverId: "d4", loadWeight: 35000, startLocation: "Bengaluru, KA", endLocation: "Mysore, KA", status: "Delivered", createdAt: "2026-02-14" },
  { id: "t7", vehicleId: "v7", driverId: "d6", loadWeight: 12000, startLocation: "Delhi, DL", endLocation: "Agra, UP", status: "Delivered", createdAt: "2026-02-13" },
  { id: "t8", vehicleId: "v9", driverId: "d8", loadWeight: 15000, startLocation: "Bhopal, MP", endLocation: "Lucknow, UP", status: "Cancelled", createdAt: "2026-02-12" },
]

export const initialMaintenanceLogs: MaintenanceLog[] = [
  { id: "m1", vehicleId: "v4", serviceType: "Engine Overhaul", cost: 85000, serviceKm: 175000, nextServiceDueKm: 195000, date: "2026-02-15" },
  { id: "m2", vehicleId: "v1", serviceType: "Brake Replacement", cost: 22000, serviceKm: 140000, nextServiceDueKm: 155000, date: "2026-01-28" },
  { id: "m3", vehicleId: "v3", serviceType: "Oil Change & Filter", cost: 8500, serviceKm: 205000, nextServiceDueKm: 215000, date: "2026-02-10" },
  { id: "m4", vehicleId: "v6", serviceType: "Transmission Service", cost: 45000, serviceKm: 310000, nextServiceDueKm: 325000, date: "2026-02-05" },
  { id: "m5", vehicleId: "v8", serviceType: "Clutch Replacement", cost: 35000, serviceKm: 140000, nextServiceDueKm: 160000, date: "2026-01-20" },
  { id: "m6", vehicleId: "v2", serviceType: "Tire Rotation", cost: 12000, serviceKm: 95000, nextServiceDueKm: 105000, date: "2026-02-01" },
  { id: "m7", vehicleId: "v5", serviceType: "Battery Replacement", cost: 15000, serviceKm: 85000, nextServiceDueKm: 135000, date: "2026-01-15" },
]

export const initialFuelLogs: FuelLog[] = [
  { id: "f1", vehicleId: "v1", tripId: "t1", distance: 148, fuelLiters: 42, date: "2026-02-18" },
  { id: "f2", vehicleId: "v3", tripId: "t2", distance: 620, fuelLiters: 185, date: "2026-02-17" },
  { id: "f3", vehicleId: "v6", tripId: "t3", distance: 346, fuelLiters: 98, date: "2026-02-19" },
  { id: "f4", vehicleId: "v10", tripId: "t4", distance: 275, fuelLiters: 78, date: "2026-02-20" },
  { id: "f5", vehicleId: "v2", tripId: "t5", distance: 530, fuelLiters: 145, date: "2026-02-15" },
  { id: "f6", vehicleId: "v5", tripId: "t6", distance: 145, fuelLiters: 38, date: "2026-02-14" },
  { id: "f7", vehicleId: "v7", tripId: "t7", distance: 233, fuelLiters: 58, date: "2026-02-13" },
  { id: "f8", vehicleId: "v1", tripId: "t1", distance: 95, fuelLiters: 35, date: "2026-02-16" },
  { id: "f9", vehicleId: "v3", tripId: "t2", distance: 180, fuelLiters: 65, date: "2026-02-18" },
  { id: "f10", vehicleId: "v6", tripId: "t3", distance: 120, fuelLiters: 55, date: "2026-02-20" },
]

// ─── Permission matrix ──────────────────────────────────────────
export const rolePermissions: Record<Role, {
  canViewVehicles: boolean
  canAddVehicle: boolean
  canEditVehicle: boolean
  canViewTrips: boolean
  canCreateTrip: boolean
  canViewDrivers: boolean
  canEditSafetyScore: boolean
  canEditDriver: boolean
  canDeleteDriver: boolean
  canViewFuelLogs: boolean
  canAddFuelLog: boolean
  canViewMaintenance: boolean
  canAddMaintenance: boolean
  canViewAnalytics: boolean
  canExport: boolean
  canAddDriver: boolean
  canDismissAlerts: boolean
  sidebarItems: string[]
}> = {
  "Fleet Manager": {
    canViewVehicles: true,
    canAddVehicle: true,
    canEditVehicle: true,
    canViewTrips: true,
    canCreateTrip: true,
    canViewDrivers: true,
    canEditSafetyScore: true,
    canEditDriver: true,
    canDeleteDriver: true,
    canViewFuelLogs: true,
    canAddFuelLog: true,
    canViewMaintenance: true,
    canAddMaintenance: true,
    canViewAnalytics: true,
    canExport: true,
    canAddDriver: true,
    canDismissAlerts: true,
    sidebarItems: ["Command Center", "Vehicle Registry", "Trip Dispatcher", "Driver Profiles", "Maintenance & Fuel", "Analytics & Reports"],
  },
  Dispatcher: {
    canViewVehicles: true,
    canAddVehicle: false,
    canEditVehicle: false,
    canViewTrips: true,
    canCreateTrip: true,
    canViewDrivers: true,
    canEditSafetyScore: false,
    canEditDriver: false,
    canDeleteDriver: false,
    canViewFuelLogs: true,
    canAddFuelLog: false,
    canViewMaintenance: true,
    canAddMaintenance: false,
    canViewAnalytics: false,
    canExport: false,
    canAddDriver: false,
    canDismissAlerts: false,
    sidebarItems: ["Command Center", "Vehicle Registry", "Trip Dispatcher", "Driver Profiles", "Maintenance & Fuel"],
  },
  "Safety Officer": {
    canViewVehicles: true,
    canAddVehicle: false,
    canEditVehicle: false,
    canViewTrips: false,
    canCreateTrip: false,
    canViewDrivers: true,
    canEditSafetyScore: true,
    canEditDriver: true,
    canDeleteDriver: false,
    canViewFuelLogs: false,
    canAddFuelLog: false,
    canViewMaintenance: true,
    canAddMaintenance: false,
    canViewAnalytics: true,
    canExport: false,
    canAddDriver: true,
    canDismissAlerts: true,
    sidebarItems: ["Command Center", "Driver Profiles", "Maintenance & Fuel", "Analytics & Reports"],
  },
  "Financial Analyst": {
    canViewVehicles: true,
    canAddVehicle: false,
    canEditVehicle: false,
    canViewTrips: true,
    canCreateTrip: false,
    canViewDrivers: false,
    canEditSafetyScore: false,
    canEditDriver: false,
    canDeleteDriver: false,
    canViewFuelLogs: true,
    canAddFuelLog: true,
    canViewMaintenance: true,
    canAddMaintenance: true,
    canViewAnalytics: true,
    canExport: true,
    canAddDriver: false,
    canDismissAlerts: false,
    sidebarItems: ["Command Center", "Vehicle Registry", "Maintenance & Fuel", "Analytics & Reports"],
  },
}
