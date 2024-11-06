import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const authorizeAdminStaffPermissions = require("../../middleware/roleAuthorization");

const prisma = new PrismaClient();

export const adminAuthRoutes = Router();

adminAuthRoutes.get(
  "/login",
  authorizeAdminStaffPermissions,
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const employee = await prisma.employee.findFirst({
        where: { email: email, password: password },
      });

      if (!employee) {
        res
          .status(400)
          .json({ message: "Login Failed: Invaild Email or Password" });
        return;
      } else {
        res.status(200).json({ message: "Login Successful", employee });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
