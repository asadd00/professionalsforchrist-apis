/*
  Warnings:

  - You are about to drop the column `registerFor` on the `professional` table. All the data in the column will be lost.
  - You are about to drop the column `residentialAddress` on the `professional` table. All the data in the column will be lost.
  - Made the column `industryId` on table `professional` required. Existing NULL values are backfilled to the "Other" industry below.
  - Made the column `jobTitle` on table `professional` required. Existing NULL values are backfilled to 'Not specified' below.
  - Made the column `employer` on table `professional` required. Existing NULL values are backfilled to 'Not specified' below.

*/

-- Backfill: existing rows with a NULL industryId get the seeded "Other" industry.
-- If no "Other" industry row exists yet (e.g. seed hasn't run), this UPDATE is a no-op
-- and the subsequent SET NOT NULL will fail loudly instead of silently corrupting data.
UPDATE "professional"
SET "industryId" = (SELECT "id" FROM "industry" WHERE "name" = 'Other' LIMIT 1)
WHERE "industryId" IS NULL;

-- Backfill: existing rows with NULL jobTitle/employer get a placeholder, since there's
-- no sensible derived default for free-text fields that were previously optional.
UPDATE "professional" SET "jobTitle" = 'Not specified' WHERE "jobTitle" IS NULL;
UPDATE "professional" SET "employer" = 'Not specified' WHERE "employer" IS NULL;

-- DropForeignKey
ALTER TABLE "professional" DROP CONSTRAINT "professional_industryId_fkey";

-- DropForeignKey
ALTER TABLE "professional" DROP CONSTRAINT "professional_lastEducationId_fkey";

-- AlterTable
ALTER TABLE "professional"
  DROP COLUMN "registerFor",
  DROP COLUMN "residentialAddress",
  ALTER COLUMN "email" DROP NOT NULL,
  ALTER COLUMN "lastEducationId" DROP NOT NULL,
  ALTER COLUMN "industryId" SET NOT NULL,
  ALTER COLUMN "jobTitle" SET NOT NULL,
  ALTER COLUMN "employer" SET NOT NULL,
  ALTER COLUMN "yearsOfExperience" DROP NOT NULL,
  ALTER COLUMN "dateOfBirth" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "professional" ADD CONSTRAINT "professional_lastEducationId_fkey" FOREIGN KEY ("lastEducationId") REFERENCES "education"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional" ADD CONSTRAINT "professional_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "industry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
