import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";

export const customerSignUpRouter = Router();
export const customerSignInRouter = Router();
export const customerForgetPassword = Router();

const prisma = new PrismaClient();

customerSignUpRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const { name, email, password, dob, phone, state, city, driversLicense } =
      req.body;

    try {
      const checkExistingCustomer = await prisma.customer.findUnique({
        where: { email },
      });
      if (checkExistingCustomer) {
        res
          .status(400)
          .json({ error: "Signup Failed: Email Already Registered" });
        return;
      }

      const customer = await prisma.customer.create({
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
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
);

customerSignInRouter.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
      const currentCustomer = await prisma.customer.findFirst({
        where: { email: email, password: password },
      });

      if (currentCustomer) {
        res.status(200).json({
          success: true,
          message: "Login Successfull",
          currentCustomer,
        });
        return;
      } else {
        res.status(400).json({
          success: false,
          message: "Login Failed: Invalid email or password",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Service Error" });
      return;
    }
  })
);

customerForgetPassword.post(
  "/forgot-password",
  expressAsyncHandler(async (req, res) => {
    const { email, driversLicense, password } = req.body;

    try {
      const currentCustomer = await prisma.customer.findFirst({
        where: {
          email: email,
          driversLicense: driversLicense,
        },
      });

      if (currentCustomer) {
        await prisma.customer.update({
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
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid email and/or drivers license",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);
