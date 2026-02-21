import prisma from "../config/db.js";

export const getAllAlerts = async () => {
  return await prisma.alert.findMany({
    orderBy: { created_at: "desc" },
    include: { vehicle: true, driver: true },
  });
};

export const getAlertById = async (id) => {
  return await prisma.alert.findUnique({
    where: { id: parseInt(id) },
    include: { vehicle: true, driver: true },
  });
};

export const updateAlert = async (id, data) => {
  return await prisma.alert.update({
    where: { id: parseInt(id) },
    data,
  });
};