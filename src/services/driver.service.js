import prisma from "../config/db.js";

export const getAllDrivers = async () => {
  return await prisma.driver.findMany({
    orderBy: { created_at: "desc" },
  });
};

export const getDriverById = async (id) => {
  return await prisma.driver.findUnique({
    where: { id: parseInt(id) },
  });
};

export const createDriver = async (data) => {
  return await prisma.driver.create({ data });
};

export const updateDriver = async (id, data) => {
  return await prisma.driver.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const deleteDriver = async (id) => {
  return await prisma.driver.delete({
    where: { id: parseInt(id) },
  });
};