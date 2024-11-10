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
exports.reservationRoutes = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authorizeAdminStaffPermissions = require("../../middleware/roleAuthorization");
const prisma = new client_1.PrismaClient();
exports.reservationRoutes = (0, express_1.Router)();
exports.reservationRoutes.post("/reservation", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const startDate = new Date(pickUpDateTime);
        const endDate = new Date(dropffDateTime);
        const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = durationInDays * parseInt(vehicle.pricePerDay.toString());
        const reservation = yield prisma.reservation.create({
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.reservationRoutes.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
