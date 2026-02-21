import type { Vehicle, Driver, Trip, MaintenanceLog, FuelLog } from "./mock-data";

export const mapVehicle = (v: any): Vehicle => ({
  id: String(v.id),
  vehicleNumber: v.vehicle_number,
  model: v.model || "",
  capacity: v.capacity_kg,
  odometer: v.odometer,
  lastServiceKm: v.last_service_km,
  stateCode: v.state_code || "",
  rtoCode: v.rto_code || "",
  status: v.status,
});

export const mapDriver = (d: any): Driver => ({
  id: String(d.id),
  name: d.name,
  licenseNumber: d.license_number || "",
  licenseExpiry: d.license_expiry ? d.license_expiry.split("T")[0] : "",
  safetyScore: d.safety_score,
  tripsCompleted: d.trips_completed || 0, // Backend might not have this, but schema had trips relation
  status: d.status,
});

export const mapTrip = (t: any): Trip => ({
  id: String(t.id),
  vehicleId: String(t.vehicle_id),
  driverId: String(t.driver_id),
  loadWeight: t.load_weight,
  startLocation: t.start_location,
  endLocation: t.end_location,
  status: t.status,
  createdAt: t.created_at ? t.created_at.split("T")[0] : "",
});

export const mapMaintenanceLog = (m: any): MaintenanceLog => ({
  id: String(m.id),
  vehicleId: String(m.vehicle_id),
  serviceType: m.service_type,
  cost: m.cost,
  serviceKm: m.service_km,
  nextServiceDueKm: m.next_service_due_km,
  date: m.created_at ? m.created_at.split("T")[0] : "",
});

export const mapFuelLog = (f: any): FuelLog => ({
  id: String(f.id),
  vehicleId: String(f.vehicle_id),
  tripId: String(f.trip_id),
  distance: f.distance_km,
  fuelLiters: f.fuel_liters,
  date: f.created_at ? f.created_at.split("T")[0] : "",
});
