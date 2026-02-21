import express from "express";
import cors from "cors";
import prisma from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import fuelLogRoutes from "./routes/fuellog.routes.js";
import maintenanceRoutes from "./routes/maintenance.routes.js";
import alertRoutes from "./routes/alert.routes.js";
import { authenticate, authorizeAdmin } from "./middleware/auth.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/vehicles", authenticate, vehicleRoutes);
app.use("/api/drivers", authenticate, driverRoutes);  // ← fixed bug here
app.use("/api/trips", authenticate, tripRoutes);
app.use("/api/fuellogs", authenticate, fuelLogRoutes);
app.use("/api/maintenance", authenticate, authorizeAdmin, maintenanceRoutes);
app.use("/api/alerts", authenticate, alertRoutes);

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});