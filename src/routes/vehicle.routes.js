import express from "express";
import * as VehicleController from "../controllers/vehicle.controller.js";

const router = express.Router();

router.get("/", VehicleController.getAllVehicles);
router.get("/:id", VehicleController.getVehicleById);
router.post("/", VehicleController.createVehicle);
router.put("/:id", VehicleController.updateVehicle);
router.delete("/:id", VehicleController.deleteVehicle);

export default router;