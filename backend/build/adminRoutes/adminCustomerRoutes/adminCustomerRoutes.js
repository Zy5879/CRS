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
exports.adminViewCustomers = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authorizeAdminStaffPermissions = require("../../middleware/roleAuthorization");
const prisma = new client_1.PrismaClient();
exports.adminViewCustomers = (0, express_1.Router)();
exports.adminViewCustomers.get("/customers", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield prisma.customer.findMany();
        if (!customers) {
            res.status(200).json({ message: "No Customers Find" });
            return;
        }
        else {
            res.status(200).json(customers);
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.adminViewCustomers.get("/customers/:id", authorizeAdminStaffPermissions, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cust_id = req.params.id;
        const customer = yield prisma.customer.findUnique({
            where: {
                id: cust_id,
            },
        });
        if (!customer) {
            res.status(400).json({ message: `Customer ${cust_id} not found` });
            return;
        }
        else {
            res.status(200).json(customer);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.adminViewCustomers.put("/customers/:id", authorizeAdminStaffPermissions, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cust_id = req.params.id;
        const updateData = req.body;
        const updateCustomer = yield prisma.customer.update({
            where: { id: cust_id },
            data: updateData,
        });
        res
            .status(200)
            .json({ message: "Customer updated successfully", updateCustomer });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.adminViewCustomers.delete("/customers/:id", authorizeAdminStaffPermissions, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cust_id = req.params.id;
        const customer = yield prisma.customer.findUnique({
            where: {
                id: cust_id,
            },
        });
        if (!customer) {
            res.status(404).json({ message: `Customer ${cust_id} not found` });
            return;
        }
        else {
            res
                .status(200)
                .json({ message: `Customer ${cust_id}, deleted successfully` });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
