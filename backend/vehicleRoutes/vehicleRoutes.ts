import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { PrismaClient } from "@prisma/client";

export const vehicleRouter = Router();
const prisma = new PrismaClient();

vehicleRouter.get(
  "/",
  expressAsyncHandler(async (_req, res) => {
    try {
      const vehicles = await prisma.vehicles.findMany();
      res.status(200).json(vehicles);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

vehicleRouter.get(
  "/check-availability",
  expressAsyncHandler(async (_req, res) => {})
);
