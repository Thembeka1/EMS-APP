/*
  Warnings:

  - You are about to drop the column `managerId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `Employee` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_managerId_fkey";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "managerId",
DROP COLUMN "salary",
ALTER COLUMN "position" DROP NOT NULL;
