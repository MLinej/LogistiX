import * as AlertService from "../services/alert.service.js";

export const getAllAlerts = async (req, res) => {
  try {
    const alerts = await AlertService.getAllAlerts();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAlertById = async (req, res) => {
  try {
    const alert = await AlertService.getAlertById(req.params.id);
    if (!alert) return res.status(404).json({ error: "Alert not found" });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAlert = async (req, res) => {
  try {
    const alert = await AlertService.updateAlert(req.params.id, req.body);
    res.json(alert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};