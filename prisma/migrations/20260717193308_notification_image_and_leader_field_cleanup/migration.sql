/*
  Warnings:

  - You are about to drop the column `achievements` on the `community_leader` table. All the data in the column will be lost.
  - You are about to drop the column `jobTitle` on the `community_leader` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "community_leader" DROP COLUMN "achievements",
DROP COLUMN "jobTitle";

-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "imageUrl" TEXT;
