"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const customerAuthRoutes_1 = require("./customerAuthRoutes/customerAuthRoutes");
const adminCustomerRoutes_1 = require("./adminRoutes/adminCustomerRoutes/adminCustomerRoutes");
const adminAuthRoutes_1 = require("./adminRoutes/adminAuthRoutes/adminAuthRoutes");
const adminInvoiceRoutes_1 = require("./adminRoutes/adminInvoiceRoutes/adminInvoiceRoutes");
const adminReservationRoutes_1 = require("./adminRoutes/adminReservationRoutes/adminReservationRoutes");
const adminVehicleRoutes_1 = require("./adminRoutes/adminVehicleRoutes/adminVehicleRoutes");
const vehicleRoutes_1 = require("./vehicleRoutes/vehicleRoutes");
const port = 8000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/customer", customerAuthRoutes_1.customerSignInRouter, customerAuthRoutes_1.customerSignUpRouter);
app.use("/admin", adminCustomerRoutes_1.adminViewCustomers, adminAuthRoutes_1.adminAuthRoutes, adminInvoiceRoutes_1.adminInvoiceRoutes, adminReservationRoutes_1.adminReservationRoutes, adminVehicleRoutes_1.adminVehicleRoute);
app.use("/vehicles", vehicleRoutes_1.vehicleRouter);
app.get("/", (_req, res) => {
    res.send("Welcome");
});
app.listen(port, () => {
    console.log(`Starting server on port ${port}`);
});
