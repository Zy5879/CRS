"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminReservationRoutes = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authorizeAdminStaffPermissions = require("../../middleware/roleAuthorization");
const prisma = new client_1.PrismaClient();
exports.adminReservationRoutes = (0, express_1.Router)();
exports.adminReservationRoutes.post("/reservation/:id/pickup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reservationId = req.params.id;
    try {
        const reservation = yield prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { vehicle: true },
        });
        if (!reservation) {
            res
                .status(404)
                .json({ error: `No Reservation Found for ${reservationId}` });
            return;
        }
        if (reservation.reservationStatus !== client_1.ReservationStatus.PENDING) {
            res
                .status(400)
                .json({ error: `Reservation is already picked up: ${reservation}` });
            return;
        }
        const startDate = reservation.pickupDateTime;
        const endDate = reservation.dropOffDateTime;
        const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = durationInDays * parseFloat(reservation.vehicle.pricePerDay.toString());
        const updatedReservation = yield prisma.reservation.update({
            where: { id: reservation.id },
            data: {
                reservationStatus: client_1.ReservationStatus.ACTIVE,
            },
        });
        const invoice = yield prisma.invoice.create({
            data: {
                reservation_id: reservation.id,
                amount: totalPrice,
                status: client_1.InvoiceStatus.PAID,
            },
        });
        res.status(201).json({
            message: `Reservation Status Updated. Invoice Generated: ${invoice.id}`,
            invoice,
            updatedReservation,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
}));
exports.adminReservationRoutes.get("/reservation", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reservations = yield prisma.reservation.findMany();
        if (!reservations) {
            res.status(200).json({ message: "No Current Reservations" });
            return;
        }
        else {
            res.status(200).json(reservations);
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
}));
exports.adminReservationRoutes.post("/reservation", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cust_id, vehicle_id, pickupLocation, dropOffLocation, pickUpDateTime, dropffDateTime, } = req.body;
    try {
        const vehicle = yield prisma.vehicles.findUnique({
            where: {
                id: vehicle_id,
            },
        });
        if (!vehicle) {
            res.status(404).json({ message: `Vehicle ${vehicle_id} not found` });
            return;
        }
        const customer = yield prisma.customer.findUnique({
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
        const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = durationInDays * parseInt(vehicle.pricePerDay.toString());
        const reservation = yield prisma.reservation.create({
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.adminReservationRoutes.put("/reservation/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reservationId = req.params.id;
    const { pickupDateTime, dropOffDateTime } = req.body;
    try {
        const existingReservation = yield prisma.reservation.findUnique({
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
        const checkForConflictingReservations = yield prisma.reservation.findMany({
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
        const updatedReservation = yield prisma.reservation.update({
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.adminReservationRoutes.post("/reservation/:id/return", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reservationId = req.params.id;
    try {
        const reservation = yield prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { vehicle: true },
        });
        if (!reservation) {
            res.status(404).json({ error: `Reservation ${reservationId} not found` });
            return;
        }
        if (reservation.reservationStatus !== client_1.ReservationStatus.ACTIVE) {
            res
                .status(400)
                .json({ erorr: `Reservation ${reservationId} already returned` });
            return;
        }
        const updateReservation = yield prisma.reservation.update({
            where: { id: reservation.id },
            data: {
                reservationStatus: client_1.ReservationStatus.COMPLETED,
            },
        });
        res.status(200).json({
            message: `Reservation ${reservationId} is completed: Vehicle Returned`,
            updateReservation,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.adminReservationRoutes.put("/reservation/:id/pickup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reservationId = req.params.id;
    try {
        const reservation = yield prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { vehicle: true },
        });
        if (!reservation) {
            res
                .status(404)
                .json({ error: `No Reservation Found for ${reservationId}` });
            return;
        }
        if (reservation.reservationStatus !== client_1.ReservationStatus.PENDING) {
            res
                .status(400)
                .json({ error: `Reservation is already picked up: ${reservation}` });
            return;
        }
        const startDate = reservation.pickupDateTime;
        const endDate = reservation.dropOffDateTime;
        const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = durationInDays * parseFloat(reservation.vehicle.pricePerDay.toString());
        const updatedReservation = yield prisma.reservation.update({
            where: { id: reservation.id },
            data: {
                reservationStatus: client_1.ReservationStatus.ACTIVE,
            },
        });
        const invoice = yield prisma.invoice.create({
            data: {
                reservation_id: reservation.id,
                amount: totalPrice,
                status: client_1.InvoiceStatus.PAID,
            },
        });
        res.status(201).json({
            message: `Reservation Status Updated. Invoice Generated: ${invoice.id}`,
            invoice,
            updatedReservation,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
}));
