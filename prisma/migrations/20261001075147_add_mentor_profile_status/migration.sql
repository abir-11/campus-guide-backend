-- CreateEnum
CREATE TYPE "MentorApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropIndex
DROP INDEX "mentor_profiles_cgpa_idx";

-- AlterTable
ALTER TABLE "mentor_profiles" ADD COLUMN     "status" "MentorApplicationStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "mentor_profiles_status_idx" ON "mentor_profiles"("status");
