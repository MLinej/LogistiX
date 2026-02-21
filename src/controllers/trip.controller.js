import * as TripService from "../services/trip.service.js";

export const getAllTrips = async (req, res) => {
  try {
    const trips = await TripService.getAllTrips();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await TripService.getTripById(req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createTrip = async (req, res) => {
  try {
    const trip = await TripService.createTrip(req.body);
    res.status(201).json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const trip = await TripService.updateTrip(req.params.id, req.body);
    res.json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    await TripService.deleteTrip(req.params.id);
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};