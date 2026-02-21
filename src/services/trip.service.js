import prisma from "../config/db.js";

export const getAllTrips = async () => {
  return await prisma.trip.findMany({
    orderBy: { created_at: "desc" },
    include: { vehicle: true, driver: true },
  });
};

export const getTripById = async (id) => {
  return await prisma.trip.findUnique({
    where: { id: parseInt(id) },
    include: { vehicle: true, driver: true },
  });
};

export const createTrip = async (data) => {
  return await prisma.trip.create({ data });
};

export const updateTrip = async (id, data) => {
  return await prisma.trip.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const deleteTrip = async (id) => {
  return await prisma.trip.delete({
    where: { id: parseInt(id) },
  });
};