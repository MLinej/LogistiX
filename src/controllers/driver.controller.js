import * as DriverService from "../services/driver.service.js";

export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await DriverService.getAllDrivers();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDriverById = async (req, res) => {
  try {
    const driver = await DriverService.getDriverById(req.params.id);
    if (!driver) return res.status(404).json({ error: "Driver not found" });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDriver = async (req, res) => {
  try {
    const driver = await DriverService.createDriver(req.body);
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const driver = await DriverService.updateDriver(req.params.id, req.body);
    res.json(driver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    await DriverService.deleteDriver(req.params.id);
    res.json({ message: "Driver deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
