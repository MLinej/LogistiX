import express from "express";
import * as MaintenanceController from "../controllers/maintenance.controller.js";

const router = express.Router();

router.get("/", MaintenanceController.getAllMaintenance);
router.get("/:id", MaintenanceController.getMaintenanceById);
router.post("/", MaintenanceController.createMaintenance);
router.put("/:id", MaintenanceController.updateMaintenance);
router.delete("/:id", MaintenanceController.deleteMaintenance);

export default router;