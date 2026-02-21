import prisma from "../config/db.js";

export const getAllFuelLogs = async () => {
  return await prisma.fuelLog.findMany({
    orderBy: { created_at: "desc" },
    include: { vehicle: true, trip: true },
  });
};

export const getFuelLogById = async (id) => {
  return await prisma.fuelLog.findUnique({
    where: { id: parseInt(id) },
    include: { vehicle: true, trip: true },
  });
};

export const createFuelLog = async (data) => {
  return await prisma.fuelLog.create({ data });
};

export const updateFuelLog = async (id, data) => {
  return await prisma.fuelLog.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const deleteFuelLog = async (id) => {
  return await prisma.fuelLog.delete({
    where: { id: parseInt(id) },
  });
};