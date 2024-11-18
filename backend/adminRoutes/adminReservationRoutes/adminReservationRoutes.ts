import { Router } from "express";
import { PrismaClient, ReservationStatus, InvoiceStatus } from "@prisma/client";
const authorizeAdminStaffPermissions = require("../../middleware/roleAuthorization");

const prisma = new PrismaClient();
export const adminReservationRoutes = Router();

adminReservationRoutes.post("/reservation/:id/pickup", async (req, res) => {
  const reservationId = req.params.id;

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { vehicle: true },
    });

    if (!reservation) {
      res
        .status(404)
        .json({ error: `No Reservation Found for ${reservationId}` });
      return;
    }

    if (reservation.reservationStatus !== ReservationStatus.PENDING) {
      res
        .status(400)
        .json({ error: `Reservation is already picked up: ${reservation}` });
      return;
    }

    const startDate = reservation.pickupDateTime;
    const endDate = reservation.dropOffDateTime;
    const durationInDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice =
      durationInDays * parseFloat(reservation.vehicle.pricePerDay.toString());

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        reservationStatus: ReservationStatus.ACTIVE,
      },
    });

    const invoice = await prisma.invoice.create({
      data: {
        reservation_id: reservation.id,
        amount: totalPrice,
        status: InvoiceStatus.PAID,
      },
    });
    res.status(201).json({
      message: `Reservation Status Updated. Invoice Generated: ${invoice.id}`,
      invoice,
      updatedReservation,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});

adminReservationRoutes.get("/reservation", async (_req, res) => {
  try {
    const reservations = await prisma.reservation.findMany();
    if (!reservations) {
      res.status(200).json({ message: "No Current Reservations" });
      return;
    } else {
      res.status(200).json(reservations);
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});

adminReservationRoutes.post("/reservation", async (req, res) => {
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

    const customer = await prisma.customer.findUnique({
      where: {
        id: cust_id,
      },
    });

    console.log(JSON.stringify(customer, null, 2));

    if (!customer) {
      res.status(404).json({ message: `Customer ${cust_id} not found` });
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
        cust_id: customer.id,
        vehicle_id: vehicle.id,
        pickupLocation,
        dropOffLocation,
        pickupDateTime: startDate,
        dropOffDateTime: endDate,
        reservationStatus: "PENDING",
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

adminReservationRoutes.put("/reservation/:id", async (req, res) => {
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

adminReservationRoutes.post("/reservation/:id/return", async (req, res) => {
  const reservationId = req.params.id;

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { vehicle: true },
    });

    if (!reservation) {
      res.status(404).json({ error: `Reservation ${reservationId} not found` });
      return;
    }

    if (reservation.reservationStatus !== ReservationStatus.ACTIVE) {
      res
        .status(400)
        .json({ erorr: `Reservation ${reservationId} already returned` });
      return;
    }

    const updateReservation = await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        reservationStatus: ReservationStatus.COMPLETED,
      },
    });

    res.status(200).json({
      message: `Reservation ${reservationId} is completed: Vehicle Returned`,
      updateReservation,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

adminReservationRoutes.put("/reservation/:id/pickup", async (req, res) => {
  const reservationId = req.params.id;

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { vehicle: true },
    });

    if (!reservation) {
      res
        .status(404)
        .json({ error: `No Reservation Found for ${reservationId}` });
      return;
    }

    if (reservation.reservationStatus !== ReservationStatus.PENDING) {
      res
        .status(400)
        .json({ error: `Reservation is already picked up: ${reservation}` });
      return;
    }

    const startDate = reservation.pickupDateTime;
    const endDate = reservation.dropOffDateTime;
    const durationInDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice =
      durationInDays * parseFloat(reservation.vehicle.pricePerDay.toString());

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        reservationStatus: ReservationStatus.ACTIVE,
      },
    });

    const invoice = await prisma.invoice.create({
      data: {
        reservation_id: reservation.id,
        amount: totalPrice,
        status: InvoiceStatus.PAID,
      },
    });
    res.status(201).json({
      message: `Reservation Status Updated. Invoice Generated: ${invoice.id}`,
      invoice,
      updatedReservation,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});
