/*
  Warnings:

  - You are about to drop the column `price` on the `Vehicles` table. All the data in the column will be lost.
  - Added the required column `pricePerDay` to the `Vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicles" DROP COLUMN "price",
ADD COLUMN     "pricePerDay" DECIMAL(12,2) NOT NULL;
