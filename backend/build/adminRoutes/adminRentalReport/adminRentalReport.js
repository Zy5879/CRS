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
exports.adminRentalReport = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.adminRentalReport = (0, express_1.Router)();
exports.adminRentalReport.get("/rented", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    try {
        const rentedVehicles = yield prisma.vehicles.findMany({
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.adminRentalReport.get("/in-house", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    try {
        const inhouseVehicles = yield prisma.vehicles.findMany({
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
}));
exports.adminRentalReport.get("/revenue", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    try {
        const totalRevenue = yield prisma.invoice.aggregate({
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
}));
