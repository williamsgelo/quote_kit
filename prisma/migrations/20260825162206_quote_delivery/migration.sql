-- CreateEnum
CREATE TYPE "QuoteActivityType" AS ENUM ('CREATED', 'UPDATED', 'SENT', 'VIEWED', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "Quote"
ADD COLUMN "publicToken" VARCHAR(64),
ADD COLUMN "sentAt" TIMESTAMP(3),
ADD COLUMN "firstViewedAt" TIMESTAMP(3),
ADD COLUMN "acceptedAt" TIMESTAMP(3),
ADD COLUMN "declinedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "QuoteActivity" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "type" "QuoteActivityType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quote_publicToken_key" ON "Quote"("publicToken");

-- CreateIndex
CREATE INDEX "QuoteActivity_quoteId_createdAt_idx" ON "QuoteActivity"("quoteId", "createdAt");

-- AddForeignKey
ALTER TABLE "QuoteActivity" ADD CONSTRAINT "QuoteActivity_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
