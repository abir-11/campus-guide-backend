/*
  Warnings:

  - You are about to drop the `_DepartmentToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DepartmentToUser" DROP CONSTRAINT "_DepartmentToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_DepartmentToUser" DROP CONSTRAINT "_DepartmentToUser_B_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "departmentId" TEXT;

-- DropTable
DROP TABLE "_DepartmentToUser";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
