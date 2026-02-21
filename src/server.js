import express from "express";
import cors from "cors";
import prisma from "./config/db.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import fuelLogRoutes from "./routes/fuellog.routes.js";
import maintenanceRoutes from "./routes/maintenance.routes.js";
import alertRoutes from "./routes/alert.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());  
app.use(express.json());
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/fuellogs", fuelLogRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/alerts", alertRoutes);

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