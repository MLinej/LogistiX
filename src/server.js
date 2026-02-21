import express       from "express";
import cors          from "cors";
import dotenv        from "dotenv";
import prisma        from "./config/db.js";
import vehicleRoutes     from "./routes/vehicle.routes.js";
import driverRoutes      from "./routes/driver.routes.js";
import tripRoutes        from "./routes/trip.routes.js";
import fuelLogRoutes     from "./routes/fuellog.routes.js";
import maintenanceRoutes from "./routes/maintenance.routes.js";
import alertRoutes       from "./routes/alert.routes.js";
import userRoutes        from "./routes/user.routes.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ["http://localhost:3001", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());

app.use("/api/users",       userRoutes);
app.use("/api/vehicles",    vehicleRoutes);
app.use("/api/drivers",     driverRoutes);
app.use("/api/trips",       tripRoutes);
app.use("/api/fuellogs",    fuelLogRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/alerts",      alertRoutes);

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`LogistiX backend running on port ${PORT}`);
});