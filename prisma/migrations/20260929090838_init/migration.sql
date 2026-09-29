-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "styleTags" JSONB NOT NULL,
    "colours" JSONB NOT NULL,
    "veilLength" TEXT NOT NULL,
    "fabric" TEXT NOT NULL,
    "embroidery" TEXT NOT NULL,
    "basePrice" INTEGER NOT NULL,
    "minPrice" INTEGER,
    "maxPrice" INTEGER,
    "customizationOptions" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "imageUrls" JSONB NOT NULL,
    "videoUrls" JSONB NOT NULL DEFAULT '[]',
    "customerMediaUrls" JSONB NOT NULL DEFAULT '[]',
    "deliveryDays" INTEGER NOT NULL DEFAULT 21,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isSample" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "enquiryNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "customerName" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "weddingDate" TEXT,
    "city" TEXT,
    "pincode" TEXT,
    "outfitColour" TEXT,
    "preferredStyle" TEXT,
    "budgetMin" INTEGER,
    "budgetMax" INTEGER,
    "notes" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnquiryProduct" (
    "id" TEXT NOT NULL,
    "enquiryId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "EnquiryProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Enquiry_enquiryNumber_key" ON "Enquiry"("enquiryNumber");

-- CreateIndex
CREATE UNIQUE INDEX "EnquiryProduct_enquiryId_productId_key" ON "EnquiryProduct"("enquiryId", "productId");

-- AddForeignKey
ALTER TABLE "EnquiryProduct" ADD CONSTRAINT "EnquiryProduct_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnquiryProduct" ADD CONSTRAINT "EnquiryProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
