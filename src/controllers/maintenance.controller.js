import * as MaintenanceService from "../services/maintenance.service.js";

export const getAllMaintenance = async (req, res) => {
  try {
    const records = await MaintenanceService.getAllMaintenance();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMaintenanceById = async (req, res) => {
  try {
    const record = await MaintenanceService.getMaintenanceById(req.params.id);
    if (!record) return res.status(404).json({ error: "Maintenance record not found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMaintenance = async (req, res) => {
  try {
    const record = await MaintenanceService.createMaintenance(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateMaintenance = async (req, res) => {
  try {
    const record = await MaintenanceService.updateMaintenance(req.params.id, req.body);
    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteMaintenance = async (req, res) => {
  try {
    await MaintenanceService.deleteMaintenance(req.params.id);
    res.json({ message: "Maintenance record deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};