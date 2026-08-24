-- CreateTable
CREATE TABLE "CatalogItem" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sku" TEXT,
    "unit" TEXT NOT NULL,
    "unitPrice" DECIMAL(19,2) NOT NULL,
    "taxRate" DECIMAL(5,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CatalogItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CatalogItem_organizationId_idx" ON "CatalogItem"("organizationId");

-- CreateIndex
CREATE INDEX "CatalogItem_organizationId_isActive_idx" ON "CatalogItem"("organizationId", "isActive");

-- CreateIndex
CREATE INDEX "CatalogItem_organizationId_name_idx" ON "CatalogItem"("organizationId", "name");

-- CreateIndex
CREATE INDEX "CatalogItem_organizationId_sku_idx" ON "CatalogItem"("organizationId", "sku");

-- AddForeignKey
ALTER TABLE "CatalogItem" ADD CONSTRAINT "CatalogItem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
