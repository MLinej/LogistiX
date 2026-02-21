"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getVehicles,
  getDrivers,
  getTrips,
  getFuelLogs,
  getMaintenance,
  getAlerts,
} from "@/lib/api";

export function useFleetData() {
  const [vehicles,    setVehicles]    = useState<any[]>([]);
  const [drivers,     setDrivers]     = useState<any[]>([]);
  const [trips,       setTrips]       = useState<any[]>([]);
  const [fuelLogs,    setFuelLogs]    = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [alerts,      setAlerts]      = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [v, d, t, f, m, a] = await Promise.all([
        getVehicles(),
        getDrivers(),
        getTrips(),
        getFuelLogs(),
        getMaintenance(),
        getAlerts(),
      ]);
      setVehicles(v.data);
      setDrivers(d.data);
      setTrips(t.data);
      setFuelLogs(f.data);
      setMaintenance(m.data);
      setAlerts(a.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    vehicles,
    drivers,
    trips,
    fuelLogs,
    maintenance,
    alerts,
    loading,
    error,
    refetch: fetchAll,
  };
}