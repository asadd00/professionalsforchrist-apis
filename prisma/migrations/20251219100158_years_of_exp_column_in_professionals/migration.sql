/*
  Warnings:

  - Added the required column `yearsOfExperience` to the `professional` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "professional" ADD COLUMN     "yearsOfExperience" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "appPlatform" TEXT,
ADD COLUMN     "appVersion" TEXT,
ADD COLUMN     "lastLogin" INTEGER;
