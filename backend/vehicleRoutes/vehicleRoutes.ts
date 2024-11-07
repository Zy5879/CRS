import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const authorizeAdminStaffPermissions = require("../../middleware/roleAuthorization");

export const vehicleRouter = Router();
const prisma = new PrismaClient();

vehicleRouter.get("/", async (req, res) => {
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

vehicleRouter.put("/:id", authorizeAdminStaffPermissions, async (req, res) => {
  const vehicleId = req.params.id;
  const updateData = req.body;

  try {
    const updateVehicle = await prisma.vehicles.update({
      where: {
        id: vehicleId,
      },
      data: updateData,
    });

    if (!updateVehicle) {
      res.status(200).json({ message: `Vehicle ${vehicleId} not found` });
      return;
    } else {
      res.status(200).json({
        message: `Vehicle ${vehicleId} successfully updated`,
        updateVehicle,
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

vehicleRouter.delete(
  "/:id",
  authorizeAdminStaffPermissions,
  async (req, res) => {
    const vehicleId = req.params.id;

    try {
      const vehicle = await prisma.vehicles.findUnique({
        where: {
          id: vehicleId,
        },
      });

      if (!vehicle) {
        res.status(404).json({ message: `Vehicle ${vehicleId}, not found` });
        return;
      } else {
        res
          .status(200)
          .json({ message: `Vehicle, ${vehicleId}, successfully deleted` });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

vehicleRouter.get("/available", async (req, res) => {
  const { pickUpDate, dropOffDate, make, model, year, state, city } = req.query;

  const start = new Date(pickUpDate as string);
  const end = new Date(dropOffDate as string);

  const filters: any = {
    Reservation: {
      none: {
        AND: [
          {
            pickUpDateTime: { lt: end },
          },
          {
            dropffDateTime: { gt: start },
          },
        ],
      },
    },
  };

  if (make) filters.make = make;
  if (model) filters.model = model;
  if (year) filters.year = parseInt(year as string);
  if (city) filters.city = city as string;

  try {
    const availableVehicles = await prisma.vehicles.findMany({
      where: filters,
    });

    if (!availableVehicles) {
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

// vehicleRouter.get(
//   "/",
//   expressAsyncHandler(async (_req, res) => {
//     try {
//       const vehicles = await prisma.vehicles.findMany();
//       res.status(200).json(vehicles);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   })
// );

// vehicleRouter.get(
//   "/check-availability",
//   expressAsyncHandler(async (_req, res) => {})
// );
