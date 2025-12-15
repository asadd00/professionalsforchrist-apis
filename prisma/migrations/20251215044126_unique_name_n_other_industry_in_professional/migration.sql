/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `education` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `industry` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "professional" DROP CONSTRAINT "professional_industryId_fkey";

-- AlterTable
ALTER TABLE "professional" ADD COLUMN     "otherIndustry" TEXT,
ALTER COLUMN "industryId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "education_name_key" ON "education"("name");

-- CreateIndex
CREATE UNIQUE INDEX "industry_name_key" ON "industry"("name");

-- AddForeignKey
ALTER TABLE "professional" ADD CONSTRAINT "professional_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
