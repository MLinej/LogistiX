import express from "express";
import * as AlertController from "../controllers/alert.controller.js";

const router = express.Router();

router.get("/", AlertController.getAllAlerts);
router.get("/:id", AlertController.getAlertById);
router.put("/:id", AlertController.updateAlert);

export default router;