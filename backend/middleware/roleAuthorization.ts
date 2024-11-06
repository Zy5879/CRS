import { Request, Response, NextFunction } from "express";
import { Customer, Employee } from "@prisma/client";

const authorizeAdminStaffPermissions = (
  req: Request<Customer, Employee>,
  res: Response,
  next: NextFunction
) => {
  const user: Customer | Employee | undefined | null = req.body;

  if (!user || !user.role) {
    res.status(401).json({ error: "Access Denied" });
  }

  if (user && (user.role === "ADMIN" || user.role === "CUSTOMER")) {
    res.json(user);
    return;
  }

  return res.status(403).json({ error: "Access Denied" });
};

module.exports = authorizeAdminStaffPermissions;
