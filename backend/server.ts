import express from "express";
import cors from "cors";
import {
  customerSignInRouter,
  customerSignUpRouter,
} from "./customerAuthRoutes/customerAuthRoutes";
import { adminViewCustomers } from "./adminRoutes/adminCustomerRoutes/adminCustomerRoutes";
import { adminAuthRoutes } from "./adminRoutes/adminAuthRoutes/adminAuthRoutes";
import { adminInvoiceRoutes } from "./adminRoutes/adminInvoiceRoutes/adminInvoiceRoutes";
import { adminReservationRoutes } from "./adminRoutes/adminReservationRoutes/adminReservationRoutes";
import { adminVehicleRoute } from "./adminRoutes/adminVehicleRoutes/adminVehicleRoutes";
import { vehicleRouter } from "./vehicleRoutes/vehicleRoutes";

const port = 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/customerAuth", customerSignInRouter, customerSignUpRouter);
app.use(
  "/admin",
  adminViewCustomers,
  adminAuthRoutes,
  adminInvoiceRoutes,
  adminReservationRoutes,
  adminVehicleRoute
);
app.use("/vehicles", vehicleRouter);

app.get("/", (_req, res) => {
  res.send("Welcome");
});

app.listen(port, () => {
  console.log(`Starting server on port ${port}`);
});
