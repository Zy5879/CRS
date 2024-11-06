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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerForgetPassword = exports.customerSignInRouter = exports.customerSignUpRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.customerSignUpRouter = (0, express_1.Router)();
exports.customerSignInRouter = (0, express_1.Router)();
exports.customerForgetPassword = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
exports.customerSignUpRouter.post("/signup", (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, dob, phone, state, city, driversLicense } = req.body;
    try {
        const checkExistingCustomer = yield prisma.customer.findUnique({
            where: { email },
        });
        if (checkExistingCustomer) {
            res
                .status(400)
                .json({ error: "Signup Failed: Email Already Registered" });
            return;
        }
        const customer = yield prisma.customer.create({
            data: {
                name,
                email,
                password,
                dob,
                phone,
                state,
                city,
                driversLicense,
            },
        });
        res.status(201).json({ message: "SignUp Successful", customer });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
})));
exports.customerSignInRouter.get("/login", (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const currentCustomer = yield prisma.customer.findFirst({
            where: { email: email, password: password },
        });
        if (currentCustomer) {
            res.status(200).json({
                success: true,
                message: "Login Successfull",
                currentCustomer,
            });
            return;
        }
        else {
            res.status(400).json({
                success: false,
                message: "Login Failed: Invalid email or password",
            });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Service Error" });
        return;
    }
})));
exports.customerForgetPassword.post("/forgot-password", (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, driversLicense, password } = req.body;
    try {
        const currentCustomer = yield prisma.customer.findFirst({
            where: {
                email: email,
                driversLicense: driversLicense,
            },
        });
        if (currentCustomer) {
            yield prisma.customer.update({
                where: { email },
                data: {
                    password: password,
                },
            });
            res.status(201).json({
                success: true,
                message: "Password Changed: Try Logging In Now",
            });
            return;
        }
        else {
            res.status(400).json({
                success: false,
                message: "Invalid email and/or drivers license",
            });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})));
