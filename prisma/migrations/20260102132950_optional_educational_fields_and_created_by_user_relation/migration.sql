-- AlterTable
ALTER TABLE "professional" ALTER COLUMN "lastDegreeName" DROP NOT NULL,
ALTER COLUMN "lastInstituteAttended" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "professional" ADD CONSTRAINT "professional_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "business_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
