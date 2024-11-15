import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const authorizeAdminStaffPermissions = require("../../middleware/roleAuthorization");

const prisma = new PrismaClient();
export const adminVehicleRoute = Router();

adminVehicleRoute.get("/vehicle", async (_req, res) => {
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

adminVehicleRoute.put("/vehicle/:id", async (req, res) => {
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

adminVehicleRoute.delete("/vehicle/:id", async (req, res) => {
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
});
