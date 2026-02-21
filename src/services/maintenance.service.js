import prisma from "../config/db.js";

export const getAllMaintenance = async () => {
  return await prisma.maintenance.findMany({
    orderBy: { created_at: "desc" },
    include: { vehicle: true },
  });
};

export const getMaintenanceById = async (id) => {
  return await prisma.maintenance.findUnique({
    where: { id: parseInt(id) },
    include: { vehicle: true },
  });
};

export const createMaintenance = async (data) => {
  return await prisma.maintenance.create({ data });
};

export const updateMaintenance = async (id, data) => {
  return await prisma.maintenance.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const deleteMaintenance = async (id) => {
  return await prisma.maintenance.delete({
    where: { id: parseInt(id) },
  });
};