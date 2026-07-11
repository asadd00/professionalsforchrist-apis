-- CreateTable
CREATE TABLE "device_token" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "platform" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notable_business" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "industryId" INTEGER,
    "city" TEXT NOT NULL,
    "contribution" TEXT NOT NULL,
    "website" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "linkedin" TEXT,
    "whatsapp" TEXT,
    "phone" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "notable_business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_leader" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "industryId" INTEGER,
    "city" TEXT NOT NULL,
    "contribution" TEXT NOT NULL,
    "achievements" TEXT,
    "website" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "linkedin" TEXT,
    "whatsapp" TEXT,
    "phone" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "community_leader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prayer_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "prayer_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prayer_request" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "email" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "prayerTypeId" INTEGER NOT NULL,
    "prayerText" TEXT NOT NULL,
    "isPrayed" BOOLEAN NOT NULL DEFAULT false,
    "prayedAt" TIMESTAMP(3),
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "prayer_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education_fund" (
    "id" SERIAL NOT NULL,
    "totalFund" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "fundUtilized" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "education_fund_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "device_token_token_key" ON "device_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "prayer_type_name_key" ON "prayer_type"("name");

-- AddForeignKey
ALTER TABLE "device_token" ADD CONSTRAINT "device_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notable_business" ADD CONSTRAINT "notable_business_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_leader" ADD CONSTRAINT "community_leader_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_request" ADD CONSTRAINT "prayer_request_prayerTypeId_fkey" FOREIGN KEY ("prayerTypeId") REFERENCES "prayer_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_request" ADD CONSTRAINT "prayer_request_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
