import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const authorizeAdminStaffPermissions = require("../../middleware/roleAuthorization");

const prisma = new PrismaClient();
export const adminRentalReport = Router();

adminRentalReport.get(
  "/in-house",
  authorizeAdminStaffPermissions,
  async (req, res) => {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    try {
      const rentedVehicles = await prisma.vehicles.findMany({
        where: {
          reservation: {
            some: {
              pickupDateTime: { lte: start },
              dropOffDateTime: { gte: end },
              reservationStatus: "ACTIVE",
            },
          },
        },
        include: {
          reservation: true,
        },
      });

      if (rentedVehicles.length === 0) {
        res.status(200).json({
          message: `No vehicles being rented during start: ${start} and end: ${end}`,
        });
        return;
      }

      res.status(200).json({ rentedVehicles });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

adminRentalReport.get(
  "/in-house",
  authorizeAdminStaffPermissions,
  async (req, res) => {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    try {
      const inhouseVehicles = await prisma.vehicles.findMany({
        where: {
          reservation: {
            none: {
              AND: [
                { pickupDateTime: { lte: end } },
                { dropOffDateTime: { gte: start } },
              ],
            },
          },
        },
        include: {
          reservation: true,
        },
      });

      if (inhouseVehicles.length === 0) {
        res.status(200).json({
          message: `No Vehicles in house during start: ${start} and end: ${end}`,
        });
        return;
      }

      res.status(200).json(inhouseVehicles);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  }
);

adminRentalReport.get(
  "/revenue",
  authorizeAdminStaffPermissions,
  async (req, res) => {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    try {
      const totalRevenue = await prisma.invoice.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: "PAID",
          reservation: {
            pickupDateTime: { lte: end },
            dropOffDateTime: { gte: start },
          },
        },
      });

      const revenueAmount = totalRevenue._sum.amount || 0;
      res.status(200).json({
        totalRevenue: revenueAmount,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  }
);
