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
const port = 8000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/customerAuth", customerAuthRoutes_1.customerSignInRouter, customerAuthRoutes_1.customerSignUpRouter);
app.use("/admin", adminCustomerRoutes_1.adminViewCustomers, adminAuthRoutes_1.adminAuthRoutes);
app.get("/", (_req, res) => {
    res.send("Welcome");
});
app.listen(port, () => {
    console.log(`Starting server on port ${port}`);
});
