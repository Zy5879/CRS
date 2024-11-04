-- CreateEnum
CREATE TYPE "Transmission" AS ENUM ('AUTOMATIC', 'MANUAL');

-- CreateEnum
CREATE TYPE "Maintenance" AS ENUM ('IN_MAINTENANCE', 'OUT_OF_SERVICE', 'IN_SERVICE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('PAID', 'UNPAID');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'LATE');

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "driversLicense" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicles" (
    "id" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" TIMESTAMP(3) NOT NULL,
    "transmission" "Transmission" NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "location" TEXT NOT NULL,
    "inventory" INTEGER NOT NULL,
    "maintenance" "Maintenance" NOT NULL,

    CONSTRAINT "Vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "cust_id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "pickupLocation" TEXT NOT NULL,
    "dropOffLocation" TEXT NOT NULL,
    "pickupDateTime" TIMESTAMP(3) NOT NULL,
    "dropOffDateTime" TIMESTAMP(3) NOT NULL,
    "reservationStatus" "ReservationStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "InvoiceStatus" NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_driversLicense_key" ON "Customer"("driversLicense");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_cust_id_key" ON "Reservation"("cust_id");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_vehicle_id_key" ON "Reservation"("vehicle_id");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_reservation_id_key" ON "Invoice"("reservation_id");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_cust_id_fkey" FOREIGN KEY ("cust_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
