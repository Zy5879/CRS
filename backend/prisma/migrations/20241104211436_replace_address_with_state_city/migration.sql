/*
  Warnings:

  - You are about to drop the column `address` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Vehicles` table. All the data in the column will be lost.
  - Added the required column `city` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "address",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "address",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vehicles" DROP COLUMN "location",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
