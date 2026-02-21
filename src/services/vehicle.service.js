import prisma from "../config/db.js";

export const getAllVehicles = async () => {
  return await prisma.vehicle.findMany({
    orderBy: { created_at: "desc" },
  });
};

export const getVehicleById = async (id) => {
  return await prisma.vehicle.findUnique({
    where: { id: parseInt(id) },
  });
};

export const createVehicle = async (data) => {
  return await prisma.vehicle.create({ data });
};

export const updateVehicle = async (id, data) => {
  return await prisma.vehicle.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const deleteVehicle = async (id) => {
  return await prisma.vehicle.delete({
    where: { id: parseInt(id) },
  });
};