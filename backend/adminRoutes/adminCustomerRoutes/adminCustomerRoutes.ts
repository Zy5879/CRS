import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const authorizeAdminStaffPermissions = require("../../middleware/roleAuthorization");

const prisma = new PrismaClient();

export const adminViewCustomers = Router();

adminViewCustomers.get(
  "/customers",
  authorizeAdminStaffPermissions,
  async (_req, res) => {
    try {
      const customers = await prisma.customer.findMany();
      if (!customers) {
        res.status(200).json({ message: "No Customers Find" });
        return;
      } else {
        res.status(200).json(customers);
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

adminViewCustomers.get(
  "/customers/:id",
  authorizeAdminStaffPermissions,
  async (req, res) => {
    try {
      const cust_id = req.params.id;

      const customer = await prisma.customer.findUnique({
        where: {
          id: cust_id,
        },
      });

      if (!customer) {
        res.status(400).json({ message: `Customer ${cust_id} not found` });
        return;
      } else {
        res.status(200).json(customer);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

adminViewCustomers.put(
  "/customers/:id",
  authorizeAdminStaffPermissions,
  async (req, res) => {
    try {
      const cust_id = req.params.id;
      const updateData = req.body;

      const updateCustomer = await prisma.customer.update({
        where: { id: cust_id },
        data: updateData,
      });

      res
        .status(200)
        .json({ message: "Customer updated successfully", updateCustomer });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
