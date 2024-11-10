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
exports.adminVehicleRoute = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authorizeAdminStaffPermissions = require("../../middleware/roleAuthorization");
const prisma = new client_1.PrismaClient();
exports.adminVehicleRoute = (0, express_1.Router)();
exports.adminVehicleRoute.put("/vehicle/:id", authorizeAdminStaffPermissions, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicleId = req.params.id;
    const updateData = req.body;
    try {
        const updateVehicle = yield prisma.vehicles.update({
            where: {
                id: vehicleId,
            },
            data: updateData,
        });
        if (!updateVehicle) {
            res.status(200).json({ message: `Vehicle ${vehicleId} not found` });
            return;
        }
        else {
            res.status(200).json({
                message: `Vehicle ${vehicleId} successfully updated`,
                updateVehicle,
            });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.adminVehicleRoute.delete("/vehicle/:id", authorizeAdminStaffPermissions, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicleId = req.params.id;
    try {
        const vehicle = yield prisma.vehicles.findUnique({
            where: {
                id: vehicleId,
            },
        });
        if (!vehicle) {
            res.status(404).json({ message: `Vehicle ${vehicleId}, not found` });
            return;
        }
        else {
            res
                .status(200)
                .json({ message: `Vehicle, ${vehicleId}, successfully deleted` });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
