import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const authorizeAdminStaffPermissions = require("../../middleware/roleAuthorization");

const prisma = new PrismaClient();
export const reservationRoutes = Router();

reservationRoutes.post("/reservation", async (req, res) => {
  const {
    cust_id,
    vehicle_id,
    pickupLocation,
    dropOffLocation,
    pickUpDateTime,
    dropffDateTime,
  } = req.body;

  try {
    const vehicle = await prisma.vehicles.findUnique({
      where: {
        id: vehicle_id,
      },
    });

    if (!vehicle) {
      res.status(404).json({ message: `Vehicle ${vehicle_id} not found` });
      return;
    }

    const startDate = new Date(pickUpDateTime);
    const endDate = new Date(dropffDateTime);

    const durationInDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const totalPrice =
      durationInDays * parseInt(vehicle.pricePerDay.toString());

    const reservation = await prisma.reservation.create({
      data: {
        cust_id,
        vehicle_id,
        pickupLocation,
        dropOffLocation,
        pickupDateTime: startDate,
        dropOffDateTime: endDate,
        reservationStatus: "PENDING",
        vehicle: { connect: { id: vehicle_id } },
        customer: { connect: { id: cust_id } },
      },
    });

    res
      .status(201)
      .json({ message: "Reservation created", reservation, totalPrice });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

reservationRoutes.put("/:id", async (req, res) => {
  const reservationId = req.params.id;
  const { pickupDateTime, dropOffDateTime } = req.body;

  try {
    const existingReservation = await prisma.reservation.findUnique({
      where: {
        id: reservationId,
      },
    });

    if (!existingReservation) {
      res
        .status(404)
        .json({ message: `Reservation ${reservationId} does not exist` });
      return;
    }

    const vehicleId = existingReservation.vehicle_id;
    const newPickUpDate = pickupDateTime
      ? new Date(pickupDateTime)
      : existingReservation.pickupDateTime;
    const newDropOffDate = dropOffDateTime
      ? new Date(dropOffDateTime)
      : existingReservation.dropOffDateTime;

    const checkForConflictingReservations = await prisma.reservation.findMany({
      where: {
        vehicle_id: vehicleId,
        id: { not: reservationId },
        AND: [
          {
            pickupDateTime: { lt: newDropOffDate },
          },
          {
            dropOffDateTime: { gt: newPickUpDate },
          },
        ],
      },
    });

    if (checkForConflictingReservations.length > 0) {
      res.status(400).json({
        error: `Vehicle is already reserved for ${newPickUpDate}, ${newDropOffDate}`,
      });
      return;
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        pickupDateTime: newPickUpDate,
        dropOffDateTime: newDropOffDate,
      },
    });
    res
      .status(200)
      .json({ message: "Reservation Updated", updatedReservation });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
