/*
  Warnings:

  - You are about to drop the column `isVerified` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `nationalId` on the `profiles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "profiles_nationalId_key";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "isVerified",
DROP COLUMN "nationalId";

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "department_name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DepartmentToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DepartmentToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DepartmentToUser_B_index" ON "_DepartmentToUser"("B");

-- AddForeignKey
ALTER TABLE "_DepartmentToUser" ADD CONSTRAINT "_DepartmentToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentToUser" ADD CONSTRAINT "_DepartmentToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
