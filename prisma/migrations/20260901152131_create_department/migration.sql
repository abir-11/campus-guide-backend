/*
  Warnings:

  - The `status` column on the `departments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[departmentName]` on the table `departments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DepartmentStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterEnum
ALTER TYPE "EventStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "departments" ALTER COLUMN "description" SET DATA TYPE VARCHAR(500),
DROP COLUMN "status",
ADD COLUMN     "status" "DepartmentStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "departmentStatus";

-- CreateIndex
CREATE UNIQUE INDEX "departments_departmentName_key" ON "departments"("departmentName");

-- CreateIndex
CREATE INDEX "departments_status_idx" ON "departments"("status");
