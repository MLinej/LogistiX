import express from "express";
import * as TripController from "../controllers/trip.controller.js";

const router = express.Router();

router.get("/", TripController.getAllTrips);
router.get("/:id", TripController.getTripById);
router.post("/", TripController.createTrip);
router.put("/:id", TripController.updateTrip);
router.delete("/:id", TripController.deleteTrip);

export default router;