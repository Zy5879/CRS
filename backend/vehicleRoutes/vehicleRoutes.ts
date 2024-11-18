import { Router } from "express";
import { PrismaClient, Vehicles } from "@prisma/client";

export const vehicleRouter = Router();
const prisma = new PrismaClient();

vehicleRouter.get("/", async (_req, res) => {
  try {
    const vehicles = await prisma.vehicles.findMany();
    if (!vehicles) {
      res.status(200).json({ message: "No Vehicles Available" });
      return;
    } else {
      res.status(200).json(vehicles);
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

vehicleRouter.get("/available", async (req, res) => {
  const { pickUpDate, dropOffDate, make, model, year, state, city } = req.query;

  const start = new Date(pickUpDate as string);
  const end = new Date(dropOffDate as string);

  const filters: any = {
    reservation: {
      none: {
        AND: [
          {
            pickupDateTime: { gte: start },
          },
          {
            dropOffDateTime: { lte: end },
          },
        ],
      },
    },
  };

  if (make) filters.make = make;
  if (model) filters.model = model;
  if (year) filters.year = parseInt(year as string);
  if (city) filters.city = city as string;
  if (state) filters.state = state as string;

  console.log(JSON.stringify(filters, null, 2));

  try {
    const availableVehicles = await prisma.vehicles.findMany({
      where: filters,
    });

    console.log(JSON.stringify(availableVehicles, null, 2));

    if (availableVehicles.length === 0) {
      res.status(200).json({ message: "No available Vehicles " });
      return;
    } else {
      res.status(200).json(availableVehicles);
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

vehicleRouter.get("/:id", async (req, res) => {
  const vehicleId = req.params.id;
  try {
    const vehicle = await prisma.vehicles.findUnique({
      where: {
        id: vehicleId,
      },
    });

    if (!vehicle) {
      res.status(400).json({ message: `Vehicle ${vehicleId} not found` });
      return;
    } else {
      res.status(200).json(vehicle);
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
