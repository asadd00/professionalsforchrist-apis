/*
  Warnings:

  - You are about to drop the column `socialType` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[socialId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,loginType]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateOfBirth` to the `business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `professional` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "business" ADD COLUMN     "dateOfBirth" TEXT NOT NULL,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "professional" ADD COLUMN     "dateOfBirth" TEXT NOT NULL,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "socialType",
ADD COLUMN     "loginType" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_socialId_key" ON "user"("socialId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_loginType_key" ON "user"("email", "loginType");
