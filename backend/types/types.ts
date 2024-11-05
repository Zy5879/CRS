import {
  Transmission,
  Maintenance,
  ReservationStatus,
  InvoiceStatus,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
export type Customer = {
  id: String;
  name: String;
  email: String;
  password: String;
  dob: Date;
  phone: String;
  state: String;
  city: String;
  driversLicense: String;
  createdAt: Date;
  reservations: Reservation | null | undefined;
};

export type Reservation = {
  id: String;
  cust_id: String;
  vehicle_id: String;
  pickupLocation: String;
  dropOffLocation: String;
  pickupDateTime: Date;
  dropOffDateTime: Date;
  reservationStatus: ReservationStatus;
  Invoice: Invoice | null | undefined;
  customer: Customer;
  vehicle: Vehicles;
};

export type Vehicles = {
  id: String;
  make: String;
  model: String;
  year: Number;
  transmission: Transmission;
  pricePerDay: Decimal;
  state: String;
  city: String;
  maintenance: Maintenance;
  Reservation: Reservation | null | undefined;
};

export type Invoice = {
  id: String;
  reservation_id: String;
  amount: Decimal;
  status: InvoiceStatus;
  reservation: Reservation;
};
