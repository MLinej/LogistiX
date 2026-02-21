import express from "express";
import * as FuelLogController from "../controllers/fuellog.controller.js";

const router = express.Router();

router.get("/", FuelLogController.getAllFuelLogs);
router.get("/:id", FuelLogController.getFuelLogById);
router.post("/", FuelLogController.createFuelLog);
router.put("/:id", FuelLogController.updateFuelLog);
router.delete("/:id", FuelLogController.deleteFuelLog);

export default router;