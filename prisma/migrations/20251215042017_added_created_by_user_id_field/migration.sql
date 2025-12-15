/*
  Warnings:

  - Added the required column `createdById` to the `business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `professional` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "business" ADD COLUMN     "createdById" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "professional" ADD COLUMN     "createdById" INTEGER NOT NULL,
ADD COLUMN     "lastEmployer1" TEXT,
ADD COLUMN     "lastEmployer2" TEXT,
ADD COLUMN     "lastEmployer3" TEXT;
