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
exports.adminAuthRoutes = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authorizeAdminStaffPermissions = require("../../middleware/roleAuthorization");
const prisma = new client_1.PrismaClient();
exports.adminAuthRoutes = (0, express_1.Router)();
exports.adminAuthRoutes.get("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const employee = yield prisma.employee.findFirst({
            where: { email: email, password: password },
        });
        if (!employee) {
            res
                .status(400)
                .json({ message: "Login Failed: Invaild Email or Password" });
            return;
        }
        else {
            res.status(200).json({ message: "Login Successful", employee });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
