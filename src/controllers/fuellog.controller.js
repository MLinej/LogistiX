import * as FuelLogService from "../services/fuellog.service.js";

export const getAllFuelLogs = async (req, res) => {
  try {
    const logs = await FuelLogService.getAllFuelLogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFuelLogById = async (req, res) => {
  try {
    const log = await FuelLogService.getFuelLogById(req.params.id);
    if (!log) return res.status(404).json({ error: "Fuel log not found" });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createFuelLog = async (req, res) => {
  try {
    const log = await FuelLogService.createFuelLog(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateFuelLog = async (req, res) => {
  try {
    const log = await FuelLogService.updateFuelLog(req.params.id, req.body);
    res.json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteFuelLog = async (req, res) => {
  try {
    await FuelLogService.deleteFuelLog(req.params.id);
    res.json({ message: "Fuel log deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};