import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const adminAuthRoutes = Router();

adminAuthRoutes.post("/login", async (req, res) => {
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
      res.status(200).json({ success: true, employee: employee });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
