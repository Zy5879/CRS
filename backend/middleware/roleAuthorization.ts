import { Request, Response, NextFunction } from "express";
import { Customer, Employee } from "@prisma/client";

const authorizeAdminStaffPermissions = (
  req: Request<Customer, Employee>,
  res: Response,
  next: NextFunction
) => {
  const user: Customer | Employee | undefined | null = req.headers.authorization
    ? JSON.parse(req.headers.authorization as string)
    : null;

  if (!user || !user.role) {
    res.status(401).json({ error: "Access Denied" });
    return;
  }

  if (user && (user.role === "ADMIN" || user.role === "STAFF")) {
    next();
    return;
  }

  return res.status(403).json({ error: "Access Denied" });
};

module.exports = authorizeAdminStaffPermissions;
