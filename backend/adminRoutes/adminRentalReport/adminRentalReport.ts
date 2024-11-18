import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const adminRentalReport = Router();

adminRentalReport.get("/rented", async (req, res) => {
  const { startDate, endDate } = req.query;

  const start = new Date(startDate as string);
  const end = new Date(endDate as string);

  try {
    const rentedVehicles = await prisma.vehicles.findMany({
      where: {
        reservation: {
          some: {
            pickupDateTime: { gte: start },
            dropOffDateTime: { lte: end },
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

    res
      .status(200)
      .json({ message: "Rental Report Generated", report: rentedVehicles });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

adminRentalReport.get("/in-house", async (req, res) => {
  const { startDate, endDate } = req.query;

  const start = new Date(startDate as string);
  const end = new Date(endDate as string);

  try {
    const inhouseVehicles = await prisma.vehicles.findMany({
      where: {
        reservation: {
          none: {
            OR: [
              { dropOffDateTime: { lte: start } },
              { pickupDateTime: { gte: end } },
            ],
          },
        },
      },
    });

    if (inhouseVehicles.length === 0) {
      res.status(200).json({
        message: `No Vehicles in house during start: ${start} and end: ${end}`,
      });
      return;
    }

    res.status(200).json({
      message: "Generated",
      report: inhouseVehicles,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});

adminRentalReport.get("/revenue", async (req, res) => {
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
      message: `Total Revenue For start: ${startDate} and end: ${endDate} is $ ${revenueAmount}`,
      report: revenueAmount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});
