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
exports.vehicleRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
exports.vehicleRouter = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
exports.vehicleRouter.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicles = yield prisma.vehicles.findMany();
        if (!vehicles) {
            res.status(200).json({ message: "No Vehicles Available" });
            return;
        }
        else {
            res.status(200).json(vehicles);
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.vehicleRouter.get("/available", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pickUpDate, dropOffDate, make, model, year, state, city } = req.query;
    const start = new Date(pickUpDate);
    const end = new Date(dropOffDate);
    const filters = {
        reservation: {
            none: {
                AND: [
                    {
                        pickupDateTime: { gte: start },
                    },
                    {
                        dropOffDateTime: { lte: end },
                    },
                ],
            },
        },
    };
    if (make)
        filters.make = make;
    if (model)
        filters.model = model;
    if (year)
        filters.year = parseInt(year);
    if (city)
        filters.city = city;
    if (state)
        filters.state = state;
    console.log(JSON.stringify(filters, null, 2));
    try {
        const availableVehicles = yield prisma.vehicles.findMany({
            where: filters,
        });
        if (availableVehicles.length === 0) {
            res.status(200).json({ message: "No available Vehicles " });
            return;
        }
        else {
            res.status(200).json(availableVehicles);
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.vehicleRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicleId = req.params.id;
    try {
        const vehicle = yield prisma.vehicles.findUnique({
            where: {
                id: vehicleId,
            },
        });
        if (!vehicle) {
            res.status(400).json({ message: `Vehicle ${vehicleId} not found` });
            return;
        }
        else {
            res.status(200).json(vehicle);
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
