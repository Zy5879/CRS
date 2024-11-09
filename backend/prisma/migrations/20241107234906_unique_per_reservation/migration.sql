/*
  Warnings:

  - A unique constraint covering the columns `[cust_id,vehicle_id]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reservation_cust_id_vehicle_id_key" ON "Reservation"("cust_id", "vehicle_id");
