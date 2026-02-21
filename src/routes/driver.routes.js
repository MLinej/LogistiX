import express from "express";
import * as DriverController from "../controllers/driver.controller.js";

const router = express.Router();

router.get("/", DriverController.getAllDrivers);
router.get("/:id", DriverController.getDriverById);
router.post("/", DriverController.createDriver);
router.put("/:id", DriverController.updateDriver);
router.delete("/:id", DriverController.deleteDriver);

export default router;