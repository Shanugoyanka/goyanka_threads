-- AlterTable
ALTER TABLE "Enquiry" ADD COLUMN     "assignedTo" TEXT,
ADD COLUMN     "campaign" TEXT,
ADD COLUMN     "contactedAt" TIMESTAMP(3),
ADD COLUMN     "convertedAt" TIMESTAMP(3),
ADD COLUMN     "customOutfitColour" TEXT,
ADD COLUMN     "firstOpenedAt" TIMESTAMP(3),
ADD COLUMN     "internalNotes" TEXT,
ADD COLUMN     "personalization" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "weddingDateNotFixed" BOOLEAN NOT NULL DEFAULT false;
