/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RegisterFor" AS ENUM ('self', 'someoneElse');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT,
    "socialId" TEXT,
    "socialType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional" (
    "id" SERIAL NOT NULL,
    "registerFor" "RegisterFor" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "shouldNumberVisible" BOOLEAN NOT NULL,
    "gender" "Gender" NOT NULL,
    "churchName" TEXT NOT NULL,
    "churchArea" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "lastEducationId" INTEGER NOT NULL,
    "lastDegreeName" TEXT NOT NULL,
    "lastInstituteAttended" TEXT NOT NULL,
    "isEmployed" BOOLEAN NOT NULL,
    "occupation" TEXT NOT NULL,
    "industryId" INTEGER NOT NULL,
    "jobTitle" TEXT,
    "employer" TEXT,
    "residentialAddress" TEXT NOT NULL,
    "residentialArea" TEXT NOT NULL,
    "linkedInUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industry" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business" (
    "id" SERIAL NOT NULL,
    "registerFor" "RegisterFor" NOT NULL,
    "ownerName" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "yearsOfExperience" TEXT NOT NULL,
    "email" TEXT,
    "contactNumber" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "residentialArea" TEXT NOT NULL,
    "website" TEXT,
    "fbPage" TEXT,
    "instaPage" TEXT,
    "linkedInUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "business_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "professional" ADD CONSTRAINT "professional_lastEducationId_fkey" FOREIGN KEY ("lastEducationId") REFERENCES "education"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional" ADD CONSTRAINT "professional_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "industry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
