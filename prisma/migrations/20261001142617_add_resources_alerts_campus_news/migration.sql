/*
  Warnings:

  - You are about to drop the column `description` on the `campus_alerts` table. All the data in the column will be lost.
  - The `alertType` column on the `campus_alerts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `news` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `fileUrl` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `resources` table. All the data in the column will be lost.
  - Added the required column `message` to the `campus_alerts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link` to the `resources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `resources` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ResourceCategory" AS ENUM ('ACADEMIC', 'RESEARCH', 'CAREER', 'LIBRARY', 'TOOLS', 'OTHER');

-- CreateEnum
CREATE TYPE "AlertPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('ACADEMIC', 'EMERGENCY', 'EVENT', 'GENERAL', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "NewsStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('ACADEMIC', 'RESEARCH', 'CAMPUS_LIFE', 'SPORTS', 'ACHIEVEMENTS', 'GENERAL');

-- AlterTable
ALTER TABLE "campus_alerts" DROP COLUMN "description",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "priority" "AlertPriority" NOT NULL DEFAULT 'MEDIUM',
DROP COLUMN "alertType",
ADD COLUMN     "alertType" "AlertType" NOT NULL DEFAULT 'GENERAL';

-- AlterTable
ALTER TABLE "news" ADD COLUMN     "category" "NewsCategory" NOT NULL DEFAULT 'GENERAL',
ADD COLUMN     "image" VARCHAR(500),
ADD COLUMN     "publishedAt" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "NewsStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "resources" DROP COLUMN "fileUrl",
DROP COLUMN "name",
ADD COLUMN     "category" "ResourceCategory" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "image" VARCHAR(500),
ADD COLUMN     "link" VARCHAR(500) NOT NULL,
ADD COLUMN     "title" VARCHAR(255) NOT NULL,
ALTER COLUMN "description" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "campus_alerts_status_idx" ON "campus_alerts"("status");

-- CreateIndex
CREATE INDEX "campus_alerts_priority_idx" ON "campus_alerts"("priority");

-- CreateIndex
CREATE INDEX "news_status_idx" ON "news"("status");

-- CreateIndex
CREATE INDEX "news_category_idx" ON "news"("category");

-- CreateIndex
CREATE INDEX "resources_status_idx" ON "resources"("status");

-- CreateIndex
CREATE INDEX "resources_category_idx" ON "resources"("category");
